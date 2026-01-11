import { createClient } from 'npm:@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

interface Event {
  title: string;
  description: string;
  event_date: string;
  event_end_date?: string;
  venue: string;
  address?: string;
  image_url?: string;
  original_url: string;
  ticket_url?: string;
  price?: string;
  category?: string;
  source: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const url = new URL(req.url);
    const source = url.searchParams.get('source') || 'all';

    const scrapedEvents: Event[] = [];

    if (source === 'all' || source === 'demo') {
      const demoEvents = await scrapeDemoEvents();
      scrapedEvents.push(...demoEvents);
    }

    let insertedCount = 0;
    let updatedCount = 0;

    for (const event of scrapedEvents) {
      const { data: existing } = await supabase
        .from('events')
        .select('id, updated_at')
        .eq('original_url', event.original_url)
        .maybeSingle();

      if (existing) {
        const { error } = await supabase
          .from('events')
          .update(event)
          .eq('id', existing.id);
        
        if (!error) updatedCount++;
      } else {
        const { error } = await supabase
          .from('events')
          .insert([event]);
        
        if (!error) insertedCount++;
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: `Scraped ${scrapedEvents.length} events`,
        inserted: insertedCount,
        updated: updatedCount,
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Error scraping events:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
});

async function scrapeDemoEvents(): Promise<Event[]> {
  const now = new Date();
  const events: Event[] = [
    {
      title: 'Vivid Sydney 2026',
      description: 'Experience the magic of light, music and ideas at the world\'s largest festival of light, music and ideas. Vivid Sydney transforms the city with mesmerizing light installations, creative performances, and thought-provoking talks.',
      event_date: new Date(now.getFullYear(), 4, 24).toISOString(),
      event_end_date: new Date(now.getFullYear(), 5, 15).toISOString(),
      venue: 'Various Locations',
      address: 'Circular Quay, Darling Harbour, and more',
      image_url: 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=1200',
      original_url: 'https://www.vividsydney.com',
      ticket_url: 'https://www.vividsydney.com/tickets',
      price: 'Free (some events ticketed)',
      category: 'Festival',
      source: 'demo',
    },
    {
      title: 'Sydney Opera House: La Bohème',
      description: 'Puccini\'s beloved opera tells the passionate story of love and loss in 19th century Paris. Experience this timeless masterpiece performed by Opera Australia with world-class singers and orchestra.',
      event_date: new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000).toISOString(),
      venue: 'Sydney Opera House',
      address: 'Bennelong Point, Sydney NSW 2000',
      image_url: 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=1200',
      original_url: 'https://www.sydneyoperahouse.com/events/la-boheme',
      ticket_url: 'https://www.sydneyoperahouse.com/events/la-boheme',
      price: 'From $79',
      category: 'Opera',
      source: 'demo',
    },
    {
      title: 'Sydney Food & Wine Fair',
      description: 'Indulge in the finest food and wine from Australia\'s best producers. Sample premium wines, gourmet foods, and attend masterclasses with celebrity chefs. A must-visit for food lovers.',
      event_date: new Date(now.getTime() + 15 * 24 * 60 * 60 * 1000).toISOString(),
      event_end_date: new Date(now.getTime() + 17 * 24 * 60 * 60 * 1000).toISOString(),
      venue: 'International Convention Centre Sydney',
      address: '14 Darling Dr, Sydney NSW 2000',
      image_url: 'https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?auto=compress&cs=tinysrgb&w=1200',
      original_url: 'https://sydneyfoodandwinefair.com.au',
      ticket_url: 'https://sydneyfoodandwinefair.com.au/tickets',
      price: 'From $45',
      category: 'Food & Wine',
      source: 'demo',
    },
    {
      title: 'Coastal Comedy Club',
      description: 'Laugh out loud with Australia\'s top comedians in an intimate club setting. This week features rising stars and surprise guest appearances. Great food and drinks available.',
      event_date: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      venue: 'The Comedy Store',
      address: 'Entertainment Quarter, 122 Lang Rd, Moore Park NSW 2021',
      image_url: 'https://images.pexels.com/photos/1047442/pexels-photo-1047442.jpeg?auto=compress&cs=tinysrgb&w=1200',
      original_url: 'https://www.comedystore.com.au',
      ticket_url: 'https://www.comedystore.com.au/tickets',
      price: '$35',
      category: 'Comedy',
      source: 'demo',
    },
    {
      title: 'Bondi Beach Markets',
      description: 'Browse unique handmade crafts, vintage clothing, artisan jewelry, and local art at Bondi\'s famous weekend markets. Enjoy live music, delicious street food, and stunning ocean views.',
      event_date: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      venue: 'Bondi Beach Public School',
      address: 'Campbell Parade, Bondi Beach NSW 2026',
      image_url: 'https://images.pexels.com/photos/1309240/pexels-photo-1309240.jpeg?auto=compress&cs=tinysrgb&w=1200',
      original_url: 'https://bondimarkets.com.au',
      ticket_url: 'https://bondimarkets.com.au',
      price: 'Free entry',
      category: 'Markets',
      source: 'demo',
    },
    {
      title: 'Sydney Harbour Bridge Climb',
      description: 'Scale the iconic Sydney Harbour Bridge for breathtaking 360-degree views of the city. Professional guides share fascinating stories about the bridge\'s history and construction.',
      event_date: new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000).toISOString(),
      venue: 'Sydney Harbour Bridge',
      address: '3 Cumberland St, The Rocks NSW 2000',
      image_url: 'https://images.pexels.com/photos/783682/pexels-photo-783682.jpeg?auto=compress&cs=tinysrgb&w=1200',
      original_url: 'https://www.bridgeclimb.com',
      ticket_url: 'https://www.bridgeclimb.com/tickets',
      price: 'From $268',
      category: 'Adventure',
      source: 'demo',
    },
    {
      title: 'Sydney Jazz Festival',
      description: 'Three nights of world-class jazz featuring international and local artists. From smooth classics to contemporary fusion, experience the best of jazz in Sydney\'s premier venues.',
      event_date: new Date(now.getTime() + 20 * 24 * 60 * 60 * 1000).toISOString(),
      event_end_date: new Date(now.getTime() + 22 * 24 * 60 * 60 * 1000).toISOString(),
      venue: 'City Recital Hall',
      address: '2 Angel Pl, Sydney NSW 2000',
      image_url: 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=1200',
      original_url: 'https://sydneyjazzfestival.com.au',
      ticket_url: 'https://sydneyjazzfestival.com.au/tickets',
      price: 'From $65',
      category: 'Music',
      source: 'demo',
    },
    {
      title: 'Art Gallery NSW: Modern Masters',
      description: 'Explore an extraordinary collection of modern art featuring works by Picasso, Matisse, and Australian masters. This limited exhibition showcases rarely-seen pieces from private collections.',
      event_date: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      event_end_date: new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000).toISOString(),
      venue: 'Art Gallery of New South Wales',
      address: 'Art Gallery Rd, Sydney NSW 2000',
      image_url: 'https://images.pexels.com/photos/1839919/pexels-photo-1839919.jpeg?auto=compress&cs=tinysrgb&w=1200',
      original_url: 'https://www.artgallery.nsw.gov.au',
      ticket_url: 'https://www.artgallery.nsw.gov.au/tickets',
      price: '$28',
      category: 'Art',
      source: 'demo',
    },
    {
      title: 'Luna Park Sydney Twilight Sessions',
      description: 'Experience the magic of Luna Park after dark with unlimited rides, carnival games, and spectacular harbour views. Perfect for families and thrill-seekers alike.',
      event_date: new Date(now.getTime() + 4 * 24 * 60 * 60 * 1000).toISOString(),
      venue: 'Luna Park Sydney',
      address: '1 Olympic Dr, Milsons Point NSW 2061',
      image_url: 'https://images.pexels.com/photos/1701214/pexels-photo-1701214.jpeg?auto=compress&cs=tinysrgb&w=1200',
      original_url: 'https://www.lunaparksydney.com',
      ticket_url: 'https://www.lunaparksydney.com/tickets',
      price: 'From $59',
      category: 'Entertainment',
      source: 'demo',
    },
    {
      title: 'Taronga Zoo Twilight Concert Series',
      description: 'Enjoy live music with stunning harbour views at Taronga Zoo. Pack a picnic, explore the zoo after hours, and watch the sunset over Sydney while listening to top Australian artists.',
      event_date: new Date(now.getTime() + 12 * 24 * 60 * 60 * 1000).toISOString(),
      venue: 'Taronga Zoo',
      address: 'Bradleys Head Rd, Mosman NSW 2088',
      image_url: 'https://images.pexels.com/photos/1661179/pexels-photo-1661179.jpeg?auto=compress&cs=tinysrgb&w=1200',
      original_url: 'https://taronga.org.au/twilight',
      ticket_url: 'https://taronga.org.au/twilight/tickets',
      price: 'From $75',
      category: 'Music',
      source: 'demo',
    },
    {
      title: 'Sydney Marathon',
      description: 'Run through Sydney\'s most iconic locations including the Harbour Bridge and Opera House. Join thousands of runners in this world-class marathon event with distances for all abilities.',
      event_date: new Date(now.getTime() + 45 * 24 * 60 * 60 * 1000).toISOString(),
      venue: 'Sydney CBD',
      address: 'Starting at Milsons Point, Sydney NSW',
      image_url: 'https://images.pexels.com/photos/2526878/pexels-photo-2526878.jpeg?auto=compress&cs=tinysrgb&w=1200',
      original_url: 'https://www.sydneymarathon.com',
      ticket_url: 'https://www.sydneymarathon.com/register',
      price: 'From $150',
      category: 'Sports',
      source: 'demo',
    },
    {
      title: 'Sculpture by the Sea',
      description: 'Walk the stunning coastal path from Bondi to Tamarama and experience over 100 sculptures by artists from around the world. This free exhibition transforms the coastline into an outdoor gallery.',
      event_date: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      event_end_date: new Date(now.getTime() + 44 * 24 * 60 * 60 * 1000).toISOString(),
      venue: 'Bondi to Tamarama Coastal Walk',
      address: 'Bondi Beach, NSW 2026',
      image_url: 'https://images.pexels.com/photos/1109354/pexels-photo-1109354.jpeg?auto=compress&cs=tinysrgb&w=1200',
      original_url: 'https://sculpturebythesea.com',
      ticket_url: 'https://sculpturebythesea.com',
      price: 'Free',
      category: 'Art',
      source: 'demo',
    },
  ];

  return events;
}
