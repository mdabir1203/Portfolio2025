/**
 * Contact registry with rich metadata for hyperpersonalization.
 */

const DEFAULT_CONTACTS = [
  {
    name: 'Satwa Bedspace Instagram (ladies)',
    phone: '+971529331188',
    source: 'Instagram @satwabedspace',
    tags: ['satwa', 'ladies', 'instagram'],
    profile: {
      likely_audience: 'Filipina / Indian ladies',
      building_hint: 'unknown - Instagram-only listing',
      speaks: ['english', 'tagalog'],
      best_window: '11:00-14:00 GULF',
    },
  },
  {
    name: 'Satwa Big Mosque capsule partition',
    phone: '+971522884786',
    source: 'Facebook group - Dubai bedspace',
    tags: ['satwa', 'capsule', 'mosque-area'],
    profile: {
      likely_audience: 'mixed (Indian/Pak/Bangla)',
      building_hint: 'near Satwa Big Mosque bus stop, beside Satwa Palace restaurant',
      speaks: ['english', 'hindi', 'urdu'],
      best_window: 'evening 19:00-22:00 GULF',
    },
  },
  {
    name: 'Satwa Roundabout (Abu Nasir)',
    phone: '+971566353859',
    source: 'Locanto + rentforroom listings',
    tags: ['satwa', 'roundabout', 'max-metro'],
    profile: {
      likely_audience: 'African + Indian mix',
      building_hint: 'Apartment building near Satwa Roundabout, very close to Max Metro',
      speaks: ['english'],
      best_window: '09:00-17:00 GULF (business hours)',
    },
  },
  {
    name: 'Satwa FB Group admin (Nazir Karim)',
    phone: '+971563229004',
    source: 'FB group admin - Satwa Area Only Bedspace',
    tags: ['satwa', 'admin', 'aggregator'],
    profile: {
      likely_audience: 'admin of the biggest Satwa bedspace group - has insider info',
      building_hint: 'n/a (aggregator)',
      speaks: ['english', 'hindi', 'urdu'],
      best_window: 'morning + late evening',
    },
  },
  {
    name: 'Karama Bed Space FB admin (Rez Ez)',
    phone: '+971551519645',
    source: 'FB group admin - Karama Bed Space and Partition',
    tags: ['karama', 'admin', 'aggregator'],
    profile: {
      likely_audience: 'Karama bedspace admin',
      building_hint: 'n/a (aggregator)',
      speaks: ['english'],
      best_window: 'morning + late evening',
    },
  },
  {
    name: 'rentforroom.com Satwa (Abu Nasir)',
    phone: '+971503569919',
    source: 'rentforroom.com Satwa aggregator',
    tags: ['satwa', 'aggregator', 'rentforroom'],
    profile: {
      likely_audience: 'professional aggregator, multi-building',
      building_hint: 'Satwa - many buildings',
      speaks: ['english', 'hindi', 'urdu', 'tamil'],
      best_window: '09:00-17:00 GULF (business hours)',
    },
  },
  {
    name: 'rentforroom Karama 1',
    phone: '+971508870458',
    source: 'rentforroom.com Karama aggregator',
    tags: ['karama', 'aggregator', 'rentforroom'],
    profile: {
      likely_audience: 'Indian/Pakistani/Sri Lankan aggregator',
      building_hint: 'Karama multiple buildings',
      speaks: ['english', 'hindi', 'urdu'],
      best_window: '09:00-17:00 GULF',
    },
  },
  {
    name: 'rentforroom Karama 2',
    phone: '+971501659458',
    source: 'rentforroom.com Karama aggregator',
    tags: ['karama', 'aggregator', 'rentforroom'],
    profile: {
      likely_audience: 'Indian/Pakistani/Sri Lankan aggregator',
      building_hint: 'Karama multiple buildings',
      speaks: ['english', 'hindi', 'urdu'],
      best_window: '09:00-17:00 GULF',
    },
  },
  {
    name: 'rentforroom Karama 3',
    phone: '+971567957047',
    source: 'rentforroom.com Karama aggregator',
    tags: ['karama', 'aggregator', 'rentforroom'],
    profile: {
      likely_audience: 'Indian/Pakistani/Sri Lankan aggregator',
      building_hint: 'Karama multiple buildings',
      speaks: ['english', 'hindi', 'urdu'],
      best_window: '09:00-17:00 GULF',
    },
  },
];

module.exports = { DEFAULT_CONTACTS };
