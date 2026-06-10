import { createClient } from '@supabase/supabase-js';

const sb = createClient(
  'https://ixgbdmrembkrpbkjhtfi.supabase.co',
  process.env.SUPABASE_SERVICE_KEY
);

// User-supplied GPS coordinates for the 12 active YVR lounges.
// Matched to DB rows by pier/gate (names in user's list don't all match DB names exactly).
const updates = [
  { slug: 'plaza-premium-domestic-pier-c-yvr',        lat: 49.194538071018705,  lng: -123.1812804267801   },
  { slug: 'ac-maple-leaf-lounge-domestic-yvr',        lat: 49.19506334891551,   lng: -123.18166957043985  },
  { slug: 'air-canada-cafe-c46-yvr',                  lat: 49.19551471998058,   lng: -123.18445880643634  },
  { slug: 'plaza-premium-domestic-yvr',               lat: 49.192690543116164,  lng: -123.1812035706693   },
  { slug: 'ac-signature-suite-yvr',                   lat: 49.1960972733436,    lng: -123.17828219541684  },
  { slug: 'ac-maple-leaf-lounge-international-yvr',   lat: 49.19631404854061,   lng: -123.17819926316149  },
  { slug: 'plaza-premium-us-yvr',                     lat: 49.19707504937145,   lng: -123.17709648268149  },
  { slug: 'ac-maple-leaf-lounge-transborder-yvr',     lat: 49.19715797326503,   lng: -123.17571907061473  },
  { slug: 'skyteam-lounge-yvr',                       lat: 49.19771910762571,   lng: -123.17867373683589  },
  { slug: 'cathay-pacific-lounge-yvr',                lat: 49.19823601457757,   lng: -123.179171330368    },
  { slug: 'plaza-premium-international-yvr',          lat: 49.19904320386852,   lng: -123.18188914689128  },
  { slug: 'plaza-premium-first-yvr',                  lat: 49.199158159554045,  lng: -123.1825342083826   },
];

for (const u of updates) {
  const { data, error } = await sb
    .from('lounges')
    .update({ latitude: u.lat, longitude: u.lng, updated_at: new Date().toISOString() })
    .eq('slug', u.slug)
    .select('name, latitude, longitude')
    .single();
  if (error) console.error(`✗ ${u.slug}: ${error.message}`);
  else      console.log(`✓ ${data.name.padEnd(50)} → ${data.latitude}, ${data.longitude}`);
}
