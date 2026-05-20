import type { EventWithHomes, HomePhoto } from "@/types/database";

const sampleInviteFields = {
  invite_token: null,
  invite_status: "active" as const,
  approval_status: "approved" as const,
  seller_email: null,
  seller_phone: null,
  submitted_at: null,
  approved_at: new Date().toISOString(),
  approved_by: null,
  last_edited_at: null,
};

const now = new Date().toISOString();

function samplePhoto(
  homeId: string,
  index: number,
  imageUrl: string,
  caption: string,
  sortOrder: number
): HomePhoto {
  return {
    id: `${homeId}-photo-${index}`,
    home_id: homeId,
    image_url: imageUrl,
    caption,
    sort_order: sortOrder,
    created_at: now,
  };
}

export const SAMPLE_EVENT: EventWithHomes = {
  id: "sample",
  organizer_id: "sample",
  title: "Maplewood Community Garage Sale",
  slug: "maplewood-community-garage-sale",
  description:
    "Join us for the annual Maplewood neighborhood garage sale — one of the best treasure-hunting weekends in Essex County!\n\nFifteen homes are participating along Oak, Birch, Pine, Elm, and Cedar streets. Expect furniture, kids' gear, tools, books, antiques, electronics, and plenty of curb-side freebies. Grab a coffee from the pop-up stand at Maple & Oak (Saturday 9 AM) and stroll the neighborhood at your own pace.\n\nEarly birds welcome Saturday; Sunday is best for families. Most sellers accept cash and Venmo. Rain or shine — if it drizzles, look for the covered tables in driveways.",
  event_date: "2026-06-08",
  event_end_date: "2026-06-10",
  start_time: "08:00:00",
  end_time: "15:00:00",
  city: "Maplewood",
  region: "NJ",
  country: "US",
  main_address: "45 Maple Avenue, Maplewood, NJ 07040",
  latitude: 40.7312,
  longitude: -74.2734,
  status: "published",
  tier: "neighborhood",
  max_homes: 20,
  is_featured: true,
  payment_status: "paid",
  stripe_session_id: null,
  banner_image_url: "/sample/banner.jpg",
  created_at: now,
  updated_at: now,
  homes: [
    {
      id: "h1",
      event_id: "sample",
      seller_name: "The Johnson Family",
      address: "12 Oak Street, Maplewood, NJ 07040",
      latitude: 40.7321,
      longitude: -74.2741,
      description:
        "We're downsizing after twenty years on Oak Street — everything in the dining room, kitchen, and upstairs office must go.\n\nHighlights include a solid oak dining set (seats six), a KitchenAid stand mixer with three bowls, braided area rugs, bar stools, and a rolling kitchen island. All furniture is smoke-free and pet-free. We'll have photos taped to larger pieces with asking prices; reasonable offers welcome on Sunday afternoon.\n\nPark on Oak Street and walk up the driveway — look for the red \"Moving Sale\" balloons.",
      categories: ["Furniture", "Kitchen", "Home Decor"],
      featured_items: [
        "Oak dining table with six chairs",
        "KitchenAid Artisan mixer + bowls",
        "8×10 braided area rugs (2)",
        "Rolling kitchen island cart",
        "Matching bar stools (set of 3)",
        "Microwave cart & small appliances",
      ],
      opening_time: "08:00:00",
      closing_time: "14:00:00",
      notes: "Cash or Venmo. Early birds welcome Saturday 8 AM. We can help load large items into your vehicle.",
      sort_order: 0,
      ...sampleInviteFields,
      created_at: now,
      updated_at: now,
      home_photos: [
        samplePhoto(
          "h1",
          1,
          "/sample/h1-dining.jpg",
          "Oak dining set — table plus six chairs",
          0
        ),
        samplePhoto(
          "h1",
          2,
          "/sample/h1-mixer.jpg",
          "KitchenAid stand mixer with extra bowls",
          1
        ),
        samplePhoto(
          "h1",
          3,
          "/sample/h1-rug.jpg",
          "Braided area rugs and living room pieces",
          2
        ),
        samplePhoto(
          "h1",
          4,
          "/sample/h1-kitchen.jpg",
          "Kitchen island, stools, and small appliances",
          3
        ),
      ],
    },
    {
      id: "h2",
      event_id: "sample",
      seller_name: "Sarah M.",
      address: "28 Birch Lane, Maplewood, NJ 07040",
      latitude: 40.7308,
      longitude: -74.272,
      description:
        "Kids outgrew everything — time for the next family to enjoy it! Sizes mostly 4T through youth large. All clothing freshly washed and sorted by size in labeled bins.\n\nToys include LEGO sets (complete with instructions), board games, scooters, and a double stroller in great shape. Baby gear: pack-and-play, high chair, and Boppy pillows. Books from picture books through early chapter readers.\n\nFriendly golden retriever on property (leashed). Please don't block driveways on Birch Lane.",
      categories: ["Baby & Kids", "Clothing", "Toys", "Books"],
      featured_items: [
        "LEGO City & Creator sets (complete)",
        "Graco double stroller",
        "Winter coats & boots (sizes 4–6)",
        "Board games & puzzles",
        "Pack-and-play + high chair bundle",
        "Picture books & chapter readers (50+)",
        "Scooters & outdoor toys",
      ],
      opening_time: "08:00:00",
      closing_time: "15:00:00",
      notes: "Everything priced to move — bundle discounts if you fill a bag!",
      sort_order: 1,
      ...sampleInviteFields,
      created_at: now,
      updated_at: now,
      home_photos: [
        samplePhoto(
          "h2",
          1,
          "/sample/h2-lego.jpg",
          "LEGO sets with instructions — $5–$25 each",
          0
        ),
        samplePhoto(
          "h2",
          2,
          "/sample/h2-stroller.jpg",
          "Double stroller, high chair, and baby gear",
          1
        ),
        samplePhoto(
          "h2",
          3,
          "/sample/h2-clothes.jpg",
          "Kids clothing sorted by size in labeled bins",
          2
        ),
        samplePhoto(
          "h2",
          4,
          "/sample/h2-toys.jpg",
          "Toys, games, and outdoor play equipment",
          3
        ),
      ],
    },
    {
      id: "h3",
      event_id: "sample",
      seller_name: "Mike's Tool Shed",
      address: "55 Pine Court, Maplewood, NJ 07040",
      latitude: 40.7315,
      longitude: -74.2755,
      description:
        "Garage clean-out from a retired contractor — hand tools, power tools, and workshop gear priced well below retail.\n\nPower: DeWalt circular saw, cordless drill/driver kits, shop vac, and extension cords. Hand tools: Stanley and Craftsman wrenches, levels, clamps, and a full socket set. Garden: shovels, rakes, hose reels, and planters. Sports corner: adult golf clubs with bag and a kids' bike helmet.\n\nSharing the driveway with the Garcias next door (household goods & plants). Coffee pot usually on — say hi!",
      categories: ["Tools", "Garden", "Sports", "Electronics"],
      featured_items: [
        "DeWalt 7¼\" circular saw",
        "Cordless drill/driver kits (2)",
        "Craftsman socket set — metric & SAE",
        "Shop vac + extension cords",
        "Garden tools & hose reels",
        "Golf clubs with stand bag",
        "Workbench clamps & hand planes",
      ],
      opening_time: "07:30:00",
      closing_time: "13:00:00",
      notes: "Multi-family sale with the Garcias next door! Cash preferred; no holds without deposit.",
      sort_order: 2,
      ...sampleInviteFields,
      created_at: now,
      updated_at: now,
      home_photos: [
        samplePhoto(
          "h3",
          1,
          "/sample/h3-tools.jpg",
          "Hand tools, sockets, and workshop organizers",
          0
        ),
        samplePhoto(
          "h3",
          2,
          "/sample/h3-saw.jpg",
          "Power tools — saws, drills, and shop vac",
          1
        ),
        samplePhoto(
          "h3",
          3,
          "/sample/h3-garden.jpg",
          "Shovels, rakes, planters, and garden supplies",
          2
        ),
        samplePhoto(
          "h3",
          4,
          "/sample/h3-golf.jpg",
          "Golf clubs, bag, and sports equipment",
          3
        ),
      ],
    },
    {
      id: "h4",
      event_id: "sample",
      seller_name: "Books & Treasures",
      address: "101 Elm Avenue, Maplewood, NJ 07040",
      latitude: 40.7299,
      longitude: -74.2715,
      description:
        "Estate sale from a longtime Maplewood collector — three rooms plus the basement packed with books, vinyl, glassware, and small antiques.\n\nVinyl: jazz, soul, and classic rock (1960s–80s), most in excellent sleeves. Books: history, cookbooks, and a shelf of first editions — ask for the catalog on the clipboard. Collectibles: crystal vases, brass candlesticks, vintage cameras, and commemorative plates.\n\nFragile items are on tables; please ask before opening boxed lots. Estate pricing all weekend — everything must go by Sunday 3 PM.",
      categories: ["Books", "Antiques", "Collectibles", "Estate Sale", "Artwork"],
      featured_items: [
        "Vintage vinyl — 200+ records",
        "First edition & signed books",
        "Crystal vases & glassware sets",
        "Brass candlesticks & mantel clocks",
        "Vintage film cameras",
        "Framed prints & local art",
        "Commemorative plates & figurines",
      ],
      opening_time: "09:00:00",
      closing_time: "15:00:00",
      notes: "Estate sale — everything must go! Quiet browsing appreciated before 10 AM.",
      sort_order: 3,
      ...sampleInviteFields,
      created_at: now,
      updated_at: now,
      home_photos: [
        samplePhoto(
          "h4",
          1,
          "/sample/h4-vinyl.jpg",
          "Vintage vinyl — jazz, soul, and classic rock",
          0
        ),
        samplePhoto(
          "h4",
          2,
          "/sample/h4-books.jpg",
          "Floor-to-ceiling bookshelves — ask for the catalog",
          1
        ),
        samplePhoto(
          "h4",
          3,
          "/sample/h4-antiques.jpg",
          "Antique clocks, brass, and collectibles",
          2
        ),
        samplePhoto(
          "h4",
          4,
          "/sample/h4-glass.jpg",
          "Crystal vases, glassware, and vintage cameras",
          3
        ),
      ],
    },
    {
      id: "h5",
      event_id: "sample",
      seller_name: "Free Stuff Corner",
      address: "77 Cedar Road, Maplewood, NJ 07040",
      latitude: 40.733,
      longitude: -74.273,
      description:
        "Clearing the basement and office — lots of FREE items on the curb plus low-priced electronics inside the garage.\n\nFree on the lawn: older monitors (works but heavy), USB cables, keyboards, a desk lamp, and garden pots. Inside the garage: printers, routers, speakers, and a flat-screen TV (1080p, $40). Also free: moving boxes, packing paper, and a folding table.\n\nTake only what you'll use — please don't dump leftovers. Donations to the food pantry box by the mailbox appreciated!",
      categories: ["Free Items", "Electronics", "Garden"],
      featured_items: [
        "Monitors & cables (FREE on curb)",
        "USB hubs, keyboards, mice",
        "Desk lamps & office organizers",
        "1080p flat-screen TV — $40",
        "Bluetooth speakers — $10 each",
        "Garden pots & planters (FREE)",
        "Moving boxes & packing supplies",
      ],
      opening_time: "08:00:00",
      closing_time: "12:00:00",
      notes: "Free curb items are first come, first served — refreshed throughout the morning!",
      sort_order: 4,
      ...sampleInviteFields,
      created_at: now,
      updated_at: now,
      home_photos: [
        samplePhoto(
          "h5",
          1,
          "/sample/h5-electronics.jpg",
          "FREE monitors, cables, and keyboards on the curb",
          0
        ),
        samplePhoto(
          "h5",
          2,
          "/sample/h5-tv.jpg",
          "Flat-screen TV and speakers in the garage",
          1
        ),
        samplePhoto(
          "h5",
          3,
          "/sample/h5-lamp.jpg",
          "Desk lamps and office organizers",
          2
        ),
        samplePhoto(
          "h5",
          4,
          "/sample/h5-curb.jpg",
          "Free garden pots and planters by the driveway",
          3
        ),
      ],
    },
  ],
};

export const SAMPLE_EVENT_SLUG = SAMPLE_EVENT.slug;
