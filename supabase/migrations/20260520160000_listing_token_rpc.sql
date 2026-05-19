-- Secure token-based listing access for homeowners (no login, no service role reads)

create or replace function public.get_listing_by_invite_token(p_token text)
returns json
language plpgsql
security definer
set search_path = public
as $$
declare
  result json;
begin
  if p_token is null or length(trim(p_token)) = 0 then
    return null;
  end if;

  select json_build_object(
    'id', h.id,
    'event_id', h.event_id,
    'seller_name', h.seller_name,
    'address', h.address,
    'latitude', h.latitude,
    'longitude', h.longitude,
    'description', h.description,
    'categories', h.categories,
    'featured_items', h.featured_items,
    'opening_time', h.opening_time,
    'closing_time', h.closing_time,
    'notes', h.notes,
    'sort_order', h.sort_order,
    'invite_token', h.invite_token,
    'invite_status', h.invite_status,
    'approval_status', h.approval_status,
    'seller_email', h.seller_email,
    'seller_phone', h.seller_phone,
    'submitted_at', h.submitted_at,
    'approved_at', h.approved_at,
    'approved_by', h.approved_by,
    'last_edited_at', h.last_edited_at,
    'created_at', h.created_at,
    'updated_at', h.updated_at,
    'events', json_build_object(
      'id', e.id,
      'title', e.title,
      'tier', e.tier,
      'event_date', e.event_date,
      'event_end_date', e.event_end_date,
      'status', e.status
    ),
    'home_photos', coalesce(
      (
        select json_agg(
          json_build_object(
            'id', hp.id,
            'home_id', hp.home_id,
            'image_url', hp.image_url,
            'caption', hp.caption,
            'sort_order', hp.sort_order,
            'created_at', hp.created_at
          )
          order by hp.sort_order
        )
        from home_photos hp
        where hp.home_id = h.id
      ),
      '[]'::json
    )
  )
  into result
  from homes h
  inner join events e on e.id = h.event_id
  where h.invite_token = p_token
    and h.invite_status = 'active';

  return result;
end;
$$;

create or replace function public.update_listing_by_invite_token(
  p_token text,
  p_payload jsonb
)
returns json
language plpgsql
security definer
set search_path = public
as $$
declare
  home_row public.homes%rowtype;
begin
  select * into home_row
  from public.homes
  where invite_token = p_token
    and invite_status = 'active';

  if not found then
    return null;
  end if;

  if home_row.approval_status not in ('draft', 'needs_changes') then
    raise exception 'listing_not_editable';
  end if;

  update public.homes
  set
    seller_name = coalesce(nullif(trim(p_payload->>'seller_name'), ''), seller_name),
    seller_email = coalesce(nullif(trim(p_payload->>'seller_email'), ''), seller_email),
    seller_phone = coalesce(nullif(trim(p_payload->>'seller_phone'), ''), seller_phone),
    address = coalesce(nullif(trim(p_payload->>'address'), ''), address),
    latitude = case
      when p_payload ? 'latitude' then (p_payload->>'latitude')::numeric
      else latitude
    end,
    longitude = case
      when p_payload ? 'longitude' then (p_payload->>'longitude')::numeric
      else longitude
    end,
    description = case
      when p_payload ? 'description' then nullif(trim(p_payload->>'description'), '')
      else description
    end,
    categories = case
      when p_payload ? 'categories' then coalesce(
        array(select jsonb_array_elements_text(p_payload->'categories')),
        categories
      )
      else categories
    end,
    featured_items = case
      when p_payload ? 'featured_items' then coalesce(
        array(select jsonb_array_elements_text(p_payload->'featured_items')),
        featured_items
      )
      else featured_items
    end,
    opening_time = case
      when p_payload ? 'opening_time' then nullif(p_payload->>'opening_time', '')
      else opening_time
    end,
    closing_time = case
      when p_payload ? 'closing_time' then nullif(p_payload->>'closing_time', '')
      else closing_time
    end,
    notes = case
      when p_payload ? 'notes' then nullif(trim(p_payload->>'notes'), '')
      else notes
    end,
    approval_status = 'draft',
    last_edited_at = now()
  where id = home_row.id
  returning * into home_row;

  return to_jsonb(home_row);
end;
$$;

create or replace function public.submit_listing_by_invite_token(p_token text)
returns json
language plpgsql
security definer
set search_path = public
as $$
declare
  home_row public.homes%rowtype;
begin
  select * into home_row
  from public.homes
  where invite_token = p_token
    and invite_status = 'active';

  if not found then
    return null;
  end if;

  if home_row.approval_status not in ('draft', 'needs_changes') then
    raise exception 'listing_not_editable';
  end if;

  if home_row.address is null or length(trim(home_row.address)) = 0 then
    raise exception 'address_required';
  end if;

  update public.homes
  set
    approval_status = 'submitted',
    submitted_at = now(),
    last_edited_at = now()
  where id = home_row.id
  returning * into home_row;

  return to_jsonb(home_row);
end;
$$;

revoke all on function public.get_listing_by_invite_token(text) from public;
revoke all on function public.update_listing_by_invite_token(text, jsonb) from public;
revoke all on function public.submit_listing_by_invite_token(text) from public;

grant execute on function public.get_listing_by_invite_token(text) to anon, authenticated, service_role;
grant execute on function public.update_listing_by_invite_token(text, jsonb) to anon, authenticated, service_role;
grant execute on function public.submit_listing_by_invite_token(text) to anon, authenticated, service_role;
