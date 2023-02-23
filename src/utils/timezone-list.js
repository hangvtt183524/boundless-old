// import moment from 'moment-timezone'

// const timeZones = moment.tz.names()
// const timezoneListRaw = []
// const timezoneList = []

// timeZones.map(item => {
//   const element = {}
//   element.display_name = `(GMT${moment.tz(item).format('Z')}) ${item}`
//   element.value = item.toString().indexOf('Etc/') !== -1 ? item.substring(4) : item
//   timezoneListRaw.push(element)
// })

// const minusTimeZones = timezoneListRaw.filter(ele => ele.display_name.includes('(GMT-'))
// const plusTimeZones = timezoneListRaw.filter(ele => ele.display_name.includes('(GMT+'))
// minusTimeZones.sort((a, b) => b.display_name.substring(5, 7) - a.display_name.substring(5, 7))
// plusTimeZones.sort((a, b) => a.display_name.substring(5, 7) - b.display_name.substring(5, 7))

// timezoneList.push(...minusTimeZones)
// timezoneList.push(...plusTimeZones)

// export default timezoneList

const timeZoneList = [
  {
    'value': 'Pacific/Midway',
    'display_name': '(GMT-11:00) Pacific/Midway'
  },
  {
    'value': 'Pacific/Niue',
    'display_name': '(GMT-11:00) Pacific/Niue'
  },
  {
    'value': 'Pacific/Pago_Pago',
    'display_name': '(GMT-11:00) Pacific/Pago_Pago'
  },
  {
    'value': 'Pacific/Honolulu',
    'display_name': '(GMT-10:00) Pacific/Honolulu'
  },
  {
    'value': 'Pacific/Rarotonga',
    'display_name': '(GMT-10:00) Pacific/Rarotonga'
  },
  {
    'value': 'Pacific/Tahiti',
    'display_name': '(GMT-10:00) Pacific/Tahiti'
  },
  {
    'value': 'US/Hawaii',
    'display_name': '(GMT-10:00) US/Hawaii'
  },
  {
    'value': 'Pacific/Marquesas',
    'display_name': '(GMT-09:30) Pacific/Marquesas'
  },
  {
    'value': 'America/Adak',
    'display_name': '(GMT-09:00) America/Adak'
  },
  {
    'value': 'Pacific/Gambier',
    'display_name': '(GMT-09:00) Pacific/Gambier'
  },
  {
    'value': 'America/Anchorage',
    'display_name': '(GMT-08:00) America/Anchorage'
  },
  {
    'value': 'America/Juneau',
    'display_name': '(GMT-08:00) America/Juneau'
  },
  {
    'value': 'America/Metlakatla',
    'display_name': '(GMT-08:00) America/Metlakatla'
  },
  {
    'value': 'America/Nome',
    'display_name': '(GMT-08:00) America/Nome'
  },
  {
    'value': 'America/Sitka',
    'display_name': '(GMT-08:00) America/Sitka'
  },
  {
    'value': 'America/Yakutat',
    'display_name': '(GMT-08:00) America/Yakutat'
  },
  {
    'value': 'Pacific/Pitcairn',
    'display_name': '(GMT-08:00) Pacific/Pitcairn'
  },
  {
    'value': 'US/Alaska',
    'display_name': '(GMT-08:00) US/Alaska'
  },
  {
    'value': 'America/Creston',
    'display_name': '(GMT-07:00) America/Creston'
  },
  {
    'value': 'America/Dawson',
    'display_name': '(GMT-07:00) America/Dawson'
  },
  {
    'value': 'America/Dawson_Creek',
    'display_name': '(GMT-07:00) America/Dawson_Creek'
  },
  {
    'value': 'America/Fort_Nelson',
    'display_name': '(GMT-07:00) America/Fort_Nelson'
  },
  {
    'value': 'America/Hermosillo',
    'display_name': '(GMT-07:00) America/Hermosillo'
  },
  {
    'value': 'America/Los_Angeles',
    'display_name': '(GMT-07:00) America/Los_Angeles'
  },
  {
    'value': 'America/Phoenix',
    'display_name': '(GMT-07:00) America/Phoenix'
  },
  {
    'value': 'America/Tijuana',
    'display_name': '(GMT-07:00) America/Tijuana'
  },
  {
    'value': 'America/Vancouver',
    'display_name': '(GMT-07:00) America/Vancouver'
  },
  {
    'value': 'America/Whitehorse',
    'display_name': '(GMT-07:00) America/Whitehorse'
  },
  {
    'value': 'Canada/Pacific',
    'display_name': '(GMT-07:00) Canada/Pacific'
  },
  {
    'value': 'US/Arizona',
    'display_name': '(GMT-07:00) US/Arizona'
  },
  {
    'value': 'US/Pacific',
    'display_name': '(GMT-07:00) US/Pacific'
  },
  {
    'value': 'America/Belize',
    'display_name': '(GMT-06:00) America/Belize'
  },
  {
    'value': 'America/Boise',
    'display_name': '(GMT-06:00) America/Boise'
  },
  {
    'value': 'America/Cambridge_Bay',
    'display_name': '(GMT-06:00) America/Cambridge_Bay'
  },
  {
    'value': 'America/Chihuahua',
    'display_name': '(GMT-06:00) America/Chihuahua'
  },
  {
    'value': 'America/Costa_Rica',
    'display_name': '(GMT-06:00) America/Costa_Rica'
  },
  {
    'value': 'America/Denver',
    'display_name': '(GMT-06:00) America/Denver'
  },
  {
    'value': 'America/Edmonton',
    'display_name': '(GMT-06:00) America/Edmonton'
  },
  {
    'value': 'America/El_Salvador',
    'display_name': '(GMT-06:00) America/El_Salvador'
  },
  {
    'value': 'America/Guatemala',
    'display_name': '(GMT-06:00) America/Guatemala'
  },
  {
    'value': 'America/Inuvik',
    'display_name': '(GMT-06:00) America/Inuvik'
  },
  {
    'value': 'America/Managua',
    'display_name': '(GMT-06:00) America/Managua'
  },
  {
    'value': 'America/Mazatlan',
    'display_name': '(GMT-06:00) America/Mazatlan'
  },
  {
    'value': 'America/Ojinaga',
    'display_name': '(GMT-06:00) America/Ojinaga'
  },
  {
    'value': 'America/Regina',
    'display_name': '(GMT-06:00) America/Regina'
  },
  {
    'value': 'America/Swift_Current',
    'display_name': '(GMT-06:00) America/Swift_Current'
  },
  {
    'value': 'America/Tegucigalpa',
    'display_name': '(GMT-06:00) America/Tegucigalpa'
  },
  {
    'value': 'America/Yellowknife',
    'display_name': '(GMT-06:00) America/Yellowknife'
  },
  {
    'value': 'Canada/Mountain',
    'display_name': '(GMT-06:00) Canada/Mountain'
  },
  {
    'value': 'Pacific/Easter',
    'display_name': '(GMT-06:00) Pacific/Easter'
  },
  {
    'value': 'Pacific/Galapagos',
    'display_name': '(GMT-06:00) Pacific/Galapagos'
  },
  {
    'value': 'US/Mountain',
    'display_name': '(GMT-06:00) US/Mountain'
  },
  {
    'value': 'America/Atikokan',
    'display_name': '(GMT-05:00) America/Atikokan'
  },
  {
    'value': 'America/Bahia_Banderas',
    'display_name': '(GMT-05:00) America/Bahia_Banderas'
  },
  {
    'value': 'America/Bogota',
    'display_name': '(GMT-05:00) America/Bogota'
  },
  {
    'value': 'America/Cancun',
    'display_name': '(GMT-05:00) America/Cancun'
  },
  {
    'value': 'America/Cayman',
    'display_name': '(GMT-05:00) America/Cayman'
  },
  {
    'value': 'America/Chicago',
    'display_name': '(GMT-05:00) America/Chicago'
  },
  {
    'value': 'America/Eirunepe',
    'display_name': '(GMT-05:00) America/Eirunepe'
  },
  {
    'value': 'America/Guayaquil',
    'display_name': '(GMT-05:00) America/Guayaquil'
  },
  {
    'value': 'America/Indiana/Knox',
    'display_name': '(GMT-05:00) America/Indiana/Knox'
  },
  {
    'value': 'America/Indiana/Tell_City',
    'display_name': '(GMT-05:00) America/Indiana/Tell_City'
  },
  {
    'value': 'America/Jamaica',
    'display_name': '(GMT-05:00) America/Jamaica'
  },
  {
    'value': 'America/Lima',
    'display_name': '(GMT-05:00) America/Lima'
  },
  {
    'value': 'America/Matamoros',
    'display_name': '(GMT-05:00) America/Matamoros'
  },
  {
    'value': 'America/Menominee',
    'display_name': '(GMT-05:00) America/Menominee'
  },
  {
    'value': 'America/Merida',
    'display_name': '(GMT-05:00) America/Merida'
  },
  {
    'value': 'America/Mexico_City',
    'display_name': '(GMT-05:00) America/Mexico_City'
  },
  {
    'value': 'America/Monterrey',
    'display_name': '(GMT-05:00) America/Monterrey'
  },
  {
    'value': 'America/North_Dakota/Beulah',
    'display_name': '(GMT-05:00) America/North_Dakota/Beulah'
  },
  {
    'value': 'America/North_Dakota/Center',
    'display_name': '(GMT-05:00) America/North_Dakota/Center'
  },
  {
    'value': 'America/North_Dakota/New_Salem',
    'display_name': '(GMT-05:00) America/North_Dakota/New_Salem'
  },
  {
    'value': 'America/Panama',
    'display_name': '(GMT-05:00) America/Panama'
  },
  {
    'value': 'America/Rainy_River',
    'display_name': '(GMT-05:00) America/Rainy_River'
  },
  {
    'value': 'America/Rankin_Inlet',
    'display_name': '(GMT-05:00) America/Rankin_Inlet'
  },
  {
    'value': 'America/Resolute',
    'display_name': '(GMT-05:00) America/Resolute'
  },
  {
    'value': 'America/Rio_Branco',
    'display_name': '(GMT-05:00) America/Rio_Branco'
  },
  {
    'value': 'America/Winnipeg',
    'display_name': '(GMT-05:00) America/Winnipeg'
  },
  {
    'value': 'Canada/Central',
    'display_name': '(GMT-05:00) Canada/Central'
  },
  {
    'value': 'US/Central',
    'display_name': '(GMT-05:00) US/Central'
  },
  {
    'value': 'America/Anguilla',
    'display_name': '(GMT-04:00) America/Anguilla'
  },
  {
    'value': 'America/Antigua',
    'display_name': '(GMT-04:00) America/Antigua'
  },
  {
    'value': 'America/Aruba',
    'display_name': '(GMT-04:00) America/Aruba'
  },
  {
    'value': 'America/Asuncion',
    'display_name': '(GMT-04:00) America/Asuncion'
  },
  {
    'value': 'America/Barbados',
    'display_name': '(GMT-04:00) America/Barbados'
  },
  {
    'value': 'America/Blanc-Sablon',
    'display_name': '(GMT-04:00) America/Blanc-Sablon'
  },
  {
    'value': 'America/Boa_Vista',
    'display_name': '(GMT-04:00) America/Boa_Vista'
  },
  {
    'value': 'America/Campo_Grande',
    'display_name': '(GMT-04:00) America/Campo_Grande'
  },
  {
    'value': 'America/Caracas',
    'display_name': '(GMT-04:00) America/Caracas'
  },
  {
    'value': 'America/Cuiaba',
    'display_name': '(GMT-04:00) America/Cuiaba'
  },
  {
    'value': 'America/Curacao',
    'display_name': '(GMT-04:00) America/Curacao'
  },
  {
    'value': 'America/Detroit',
    'display_name': '(GMT-04:00) America/Detroit'
  },
  {
    'value': 'America/Dominica',
    'display_name': '(GMT-04:00) America/Dominica'
  },
  {
    'value': 'America/Grand_Turk',
    'display_name': '(GMT-04:00) America/Grand_Turk'
  },
  {
    'value': 'America/Grenada',
    'display_name': '(GMT-04:00) America/Grenada'
  },
  {
    'value': 'America/Guadeloupe',
    'display_name': '(GMT-04:00) America/Guadeloupe'
  },
  {
    'value': 'America/Guyana',
    'display_name': '(GMT-04:00) America/Guyana'
  },
  {
    'value': 'America/Havana',
    'display_name': '(GMT-04:00) America/Havana'
  },
  {
    'value': 'America/Indiana/Indianapolis',
    'display_name': '(GMT-04:00) America/Indiana/Indianapolis'
  },
  {
    'value': 'America/Indiana/Marengo',
    'display_name': '(GMT-04:00) America/Indiana/Marengo'
  },
  {
    'value': 'America/Indiana/Petersburg',
    'display_name': '(GMT-04:00) America/Indiana/Petersburg'
  },
  {
    'value': 'America/Indiana/Vevay',
    'display_name': '(GMT-04:00) America/Indiana/Vevay'
  },
  {
    'value': 'America/Indiana/Vincennes',
    'display_name': '(GMT-04:00) America/Indiana/Vincennes'
  },
  {
    'value': 'America/Indiana/Winamac',
    'display_name': '(GMT-04:00) America/Indiana/Winamac'
  },
  {
    'value': 'America/Iqaluit',
    'display_name': '(GMT-04:00) America/Iqaluit'
  },
  {
    'value': 'America/Kentucky/Louisville',
    'display_name': '(GMT-04:00) America/Kentucky/Louisville'
  },
  {
    'value': 'America/Kentucky/Monticello',
    'display_name': '(GMT-04:00) America/Kentucky/Monticello'
  },
  {
    'value': 'America/Kralendijk',
    'display_name': '(GMT-04:00) America/Kralendijk'
  },
  {
    'value': 'America/La_Paz',
    'display_name': '(GMT-04:00) America/La_Paz'
  },
  {
    'value': 'America/Lower_Princes',
    'display_name': '(GMT-04:00) America/Lower_Princes'
  },
  {
    'value': 'America/Manaus',
    'display_name': '(GMT-04:00) America/Manaus'
  },
  {
    'value': 'America/Marigot',
    'display_name': '(GMT-04:00) America/Marigot'
  },
  {
    'value': 'America/Martinique',
    'display_name': '(GMT-04:00) America/Martinique'
  },
  {
    'value': 'America/Montserrat',
    'display_name': '(GMT-04:00) America/Montserrat'
  },
  {
    'value': 'America/Nassau',
    'display_name': '(GMT-04:00) America/Nassau'
  },
  {
    'value': 'America/New_York',
    'display_name': '(GMT-04:00) America/New_York'
  },
  {
    'value': 'America/Nipigon',
    'display_name': '(GMT-04:00) America/Nipigon'
  },
  {
    'value': 'America/Pangnirtung',
    'display_name': '(GMT-04:00) America/Pangnirtung'
  },
  {
    'value': 'America/Port-au-Prince',
    'display_name': '(GMT-04:00) America/Port-au-Prince'
  },
  {
    'value': 'America/Port_of_Spain',
    'display_name': '(GMT-04:00) America/Port_of_Spain'
  },
  {
    'value': 'America/Porto_Velho',
    'display_name': '(GMT-04:00) America/Porto_Velho'
  },
  {
    'value': 'America/Puerto_Rico',
    'display_name': '(GMT-04:00) America/Puerto_Rico'
  },
  {
    'value': 'America/Santiago',
    'display_name': '(GMT-04:00) America/Santiago'
  },
  {
    'value': 'America/Santo_Domingo',
    'display_name': '(GMT-04:00) America/Santo_Domingo'
  },
  {
    'value': 'America/St_Barthelemy',
    'display_name': '(GMT-04:00) America/St_Barthelemy'
  },
  {
    'value': 'America/St_Kitts',
    'display_name': '(GMT-04:00) America/St_Kitts'
  },
  {
    'value': 'America/St_Lucia',
    'display_name': '(GMT-04:00) America/St_Lucia'
  },
  {
    'value': 'America/St_Thomas',
    'display_name': '(GMT-04:00) America/St_Thomas'
  },
  {
    'value': 'America/St_Vincent',
    'display_name': '(GMT-04:00) America/St_Vincent'
  },
  {
    'value': 'America/Thunder_Bay',
    'display_name': '(GMT-04:00) America/Thunder_Bay'
  },
  {
    'value': 'America/Toronto',
    'display_name': '(GMT-04:00) America/Toronto'
  },
  {
    'value': 'America/Tortola',
    'display_name': '(GMT-04:00) America/Tortola'
  },
  {
    'value': 'Canada/Eastern',
    'display_name': '(GMT-04:00) Canada/Eastern'
  },
  {
    'value': 'US/Eastern',
    'display_name': '(GMT-04:00) US/Eastern'
  },
  {
    'value': 'America/Araguaina',
    'display_name': '(GMT-03:00) America/Araguaina'
  },
  {
    'value': 'America/Argentina/Buenos_Aires',
    'display_name': '(GMT-03:00) America/Argentina/Buenos_Aires'
  },
  {
    'value': 'America/Argentina/Catamarca',
    'display_name': '(GMT-03:00) America/Argentina/Catamarca'
  },
  {
    'value': 'America/Argentina/Cordoba',
    'display_name': '(GMT-03:00) America/Argentina/Cordoba'
  },
  {
    'value': 'America/Argentina/Jujuy',
    'display_name': '(GMT-03:00) America/Argentina/Jujuy'
  },
  {
    'value': 'America/Argentina/La_Rioja',
    'display_name': '(GMT-03:00) America/Argentina/La_Rioja'
  },
  {
    'value': 'America/Argentina/Mendoza',
    'display_name': '(GMT-03:00) America/Argentina/Mendoza'
  },
  {
    'value': 'America/Argentina/Rio_Gallegos',
    'display_name': '(GMT-03:00) America/Argentina/Rio_Gallegos'
  },
  {
    'value': 'America/Argentina/Salta',
    'display_name': '(GMT-03:00) America/Argentina/Salta'
  },
  {
    'value': 'America/Argentina/San_Juan',
    'display_name': '(GMT-03:00) America/Argentina/San_Juan'
  },
  {
    'value': 'America/Argentina/San_Luis',
    'display_name': '(GMT-03:00) America/Argentina/San_Luis'
  },
  {
    'value': 'America/Argentina/Tucuman',
    'display_name': '(GMT-03:00) America/Argentina/Tucuman'
  },
  {
    'value': 'America/Argentina/Ushuaia',
    'display_name': '(GMT-03:00) America/Argentina/Ushuaia'
  },
  {
    'value': 'America/Bahia',
    'display_name': '(GMT-03:00) America/Bahia'
  },
  {
    'value': 'America/Belem',
    'display_name': '(GMT-03:00) America/Belem'
  },
  {
    'value': 'America/Cayenne',
    'display_name': '(GMT-03:00) America/Cayenne'
  },
  {
    'value': 'America/Fortaleza',
    'display_name': '(GMT-03:00) America/Fortaleza'
  },
  {
    'value': 'America/Glace_Bay',
    'display_name': '(GMT-03:00) America/Glace_Bay'
  },
  {
    'value': 'America/Goose_Bay',
    'display_name': '(GMT-03:00) America/Goose_Bay'
  },
  {
    'value': 'America/Halifax',
    'display_name': '(GMT-03:00) America/Halifax'
  },
  {
    'value': 'America/Maceio',
    'display_name': '(GMT-03:00) America/Maceio'
  },
  {
    'value': 'America/Moncton',
    'display_name': '(GMT-03:00) America/Moncton'
  },
  {
    'value': 'America/Montevideo',
    'display_name': '(GMT-03:00) America/Montevideo'
  },
  {
    'value': 'America/Paramaribo',
    'display_name': '(GMT-03:00) America/Paramaribo'
  },
  {
    'value': 'America/Punta_Arenas',
    'display_name': '(GMT-03:00) America/Punta_Arenas'
  },
  {
    'value': 'America/Recife',
    'display_name': '(GMT-03:00) America/Recife'
  },
  {
    'value': 'America/Santarem',
    'display_name': '(GMT-03:00) America/Santarem'
  },
  {
    'value': 'America/Sao_Paulo',
    'display_name': '(GMT-03:00) America/Sao_Paulo'
  },
  {
    'value': 'America/Thule',
    'display_name': '(GMT-03:00) America/Thule'
  },
  {
    'value': 'Antarctica/Palmer',
    'display_name': '(GMT-03:00) Antarctica/Palmer'
  },
  {
    'value': 'Antarctica/Rothera',
    'display_name': '(GMT-03:00) Antarctica/Rothera'
  },
  {
    'value': 'Atlantic/Bermuda',
    'display_name': '(GMT-03:00) Atlantic/Bermuda'
  },
  {
    'value': 'Atlantic/Stanley',
    'display_name': '(GMT-03:00) Atlantic/Stanley'
  },
  {
    'value': 'Canada/Atlantic',
    'display_name': '(GMT-03:00) Canada/Atlantic'
  },
  {
    'value': 'America/St_Johns',
    'display_name': '(GMT-02:30) America/St_Johns'
  },
  {
    'value': 'Canada/Newfoundland',
    'display_name': '(GMT-02:30) Canada/Newfoundland'
  },
  {
    'value': 'America/Godthab',
    'display_name': '(GMT-02:00) America/Godthab'
  },
  {
    'value': 'America/Miquelon',
    'display_name': '(GMT-02:00) America/Miquelon'
  },
  {
    'value': 'America/Noronha',
    'display_name': '(GMT-02:00) America/Noronha'
  },
  {
    'value': 'Atlantic/South_Georgia',
    'display_name': '(GMT-02:00) Atlantic/South_Georgia'
  },
  {
    'value': 'Atlantic/Cape_Verde',
    'display_name': '(GMT-01:00) Atlantic/Cape_Verde'
  },
  {
    'value': 'Africa/Abidjan',
    'display_name': '(GMT+00:00) Africa/Abidjan'
  },
  {
    'value': 'Africa/Accra',
    'display_name': '(GMT+00:00) Africa/Accra'
  },
  {
    'value': 'Africa/Bamako',
    'display_name': '(GMT+00:00) Africa/Bamako'
  },
  {
    'value': 'Africa/Banjul',
    'display_name': '(GMT+00:00) Africa/Banjul'
  },
  {
    'value': 'Africa/Bissau',
    'display_name': '(GMT+00:00) Africa/Bissau'
  },
  {
    'value': 'Africa/Casablanca',
    'display_name': '(GMT+00:00) Africa/Casablanca'
  },
  {
    'value': 'Africa/Conakry',
    'display_name': '(GMT+00:00) Africa/Conakry'
  },
  {
    'value': 'Africa/Dakar',
    'display_name': '(GMT+00:00) Africa/Dakar'
  },
  {
    'value': 'Africa/El_Aaiun',
    'display_name': '(GMT+00:00) Africa/El_Aaiun'
  },
  {
    'value': 'Africa/Freetown',
    'display_name': '(GMT+00:00) Africa/Freetown'
  },
  {
    'value': 'Africa/Lome',
    'display_name': '(GMT+00:00) Africa/Lome'
  },
  {
    'value': 'Africa/Monrovia',
    'display_name': '(GMT+00:00) Africa/Monrovia'
  },
  {
    'value': 'Africa/Nouakchott',
    'display_name': '(GMT+00:00) Africa/Nouakchott'
  },
  {
    'value': 'Africa/Ouagadougou',
    'display_name': '(GMT+00:00) Africa/Ouagadougou'
  },
  {
    'value': 'Africa/Sao_Tome',
    'display_name': '(GMT+00:00) Africa/Sao_Tome'
  },
  {
    'value': 'America/Danmarkshavn',
    'display_name': '(GMT+00:00) America/Danmarkshavn'
  },
  {
    'value': 'America/Scoresbysund',
    'display_name': '(GMT+00:00) America/Scoresbysund'
  },
  {
    'value': 'Atlantic/Azores',
    'display_name': '(GMT+00:00) Atlantic/Azores'
  },
  {
    'value': 'Atlantic/Reykjavik',
    'display_name': '(GMT+00:00) Atlantic/Reykjavik'
  },
  {
    'value': 'Atlantic/St_Helena',
    'display_name': '(GMT+00:00) Atlantic/St_Helena'
  },
  {
    'value': 'GMT',
    'display_name': '(GMT+00:00) GMT'
  },
  {
    'value': 'UTC',
    'display_name': '(GMT+00:00) UTC'
  },
  {
    'value': 'Africa/Algiers',
    'display_name': '(GMT+01:00) Africa/Algiers'
  },
  {
    'value': 'Africa/Bangui',
    'display_name': '(GMT+01:00) Africa/Bangui'
  },
  {
    'value': 'Africa/Brazzaville',
    'display_name': '(GMT+01:00) Africa/Brazzaville'
  },
  {
    'value': 'Africa/Douala',
    'display_name': '(GMT+01:00) Africa/Douala'
  },
  {
    'value': 'Africa/Kinshasa',
    'display_name': '(GMT+01:00) Africa/Kinshasa'
  },
  {
    'value': 'Africa/Lagos',
    'display_name': '(GMT+01:00) Africa/Lagos'
  },
  {
    'value': 'Africa/Libreville',
    'display_name': '(GMT+01:00) Africa/Libreville'
  },
  {
    'value': 'Africa/Luanda',
    'display_name': '(GMT+01:00) Africa/Luanda'
  },
  {
    'value': 'Africa/Malabo',
    'display_name': '(GMT+01:00) Africa/Malabo'
  },
  {
    'value': 'Africa/Ndjamena',
    'display_name': '(GMT+01:00) Africa/Ndjamena'
  },
  {
    'value': 'Africa/Niamey',
    'display_name': '(GMT+01:00) Africa/Niamey'
  },
  {
    'value': 'Africa/Porto-Novo',
    'display_name': '(GMT+01:00) Africa/Porto-Novo'
  },
  {
    'value': 'Africa/Tunis',
    'display_name': '(GMT+01:00) Africa/Tunis'
  },
  {
    'value': 'Atlantic/Canary',
    'display_name': '(GMT+01:00) Atlantic/Canary'
  },
  {
    'value': 'Atlantic/Faroe',
    'display_name': '(GMT+01:00) Atlantic/Faroe'
  },
  {
    'value': 'Atlantic/Madeira',
    'display_name': '(GMT+01:00) Atlantic/Madeira'
  },
  {
    'value': 'Europe/Dublin',
    'display_name': '(GMT+01:00) Europe/Dublin'
  },
  {
    'value': 'Europe/Guernsey',
    'display_name': '(GMT+01:00) Europe/Guernsey'
  },
  {
    'value': 'Europe/Isle_of_Man',
    'display_name': '(GMT+01:00) Europe/Isle_of_Man'
  },
  {
    'value': 'Europe/Jersey',
    'display_name': '(GMT+01:00) Europe/Jersey'
  },
  {
    'value': 'Europe/Lisbon',
    'display_name': '(GMT+01:00) Europe/Lisbon'
  },
  {
    'value': 'Europe/London',
    'display_name': '(GMT+01:00) Europe/London'
  },
  {
    'value': 'Africa/Blantyre',
    'display_name': '(GMT+02:00) Africa/Blantyre'
  },
  {
    'value': 'Africa/Bujumbura',
    'display_name': '(GMT+02:00) Africa/Bujumbura'
  },
  {
    'value': 'Africa/Cairo',
    'display_name': '(GMT+02:00) Africa/Cairo'
  },
  {
    'value': 'Africa/Ceuta',
    'display_name': '(GMT+02:00) Africa/Ceuta'
  },
  {
    'value': 'Africa/Gaborone',
    'display_name': '(GMT+02:00) Africa/Gaborone'
  },
  {
    'value': 'Africa/Harare',
    'display_name': '(GMT+02:00) Africa/Harare'
  },
  {
    'value': 'Africa/Johannesburg',
    'display_name': '(GMT+02:00) Africa/Johannesburg'
  },
  {
    'value': 'Africa/Khartoum',
    'display_name': '(GMT+02:00) Africa/Khartoum'
  },
  {
    'value': 'Africa/Kigali',
    'display_name': '(GMT+02:00) Africa/Kigali'
  },
  {
    'value': 'Africa/Lubumbashi',
    'display_name': '(GMT+02:00) Africa/Lubumbashi'
  },
  {
    'value': 'Africa/Lusaka',
    'display_name': '(GMT+02:00) Africa/Lusaka'
  },
  {
    'value': 'Africa/Maputo',
    'display_name': '(GMT+02:00) Africa/Maputo'
  },
  {
    'value': 'Africa/Maseru',
    'display_name': '(GMT+02:00) Africa/Maseru'
  },
  {
    'value': 'Africa/Mbabane',
    'display_name': '(GMT+02:00) Africa/Mbabane'
  },
  {
    'value': 'Africa/Tripoli',
    'display_name': '(GMT+02:00) Africa/Tripoli'
  },
  {
    'value': 'Africa/Windhoek',
    'display_name': '(GMT+02:00) Africa/Windhoek'
  },
  {
    'value': 'Antarctica/Troll',
    'display_name': '(GMT+02:00) Antarctica/Troll'
  },
  {
    'value': 'Arctic/Longyearbyen',
    'display_name': '(GMT+02:00) Arctic/Longyearbyen'
  },
  {
    'value': 'Europe/Amsterdam',
    'display_name': '(GMT+02:00) Europe/Amsterdam'
  },
  {
    'value': 'Europe/Andorra',
    'display_name': '(GMT+02:00) Europe/Andorra'
  },
  {
    'value': 'Europe/Belgrade',
    'display_name': '(GMT+02:00) Europe/Belgrade'
  },
  {
    'value': 'Europe/Berlin',
    'display_name': '(GMT+02:00) Europe/Berlin'
  },
  {
    'value': 'Europe/Bratislava',
    'display_name': '(GMT+02:00) Europe/Bratislava'
  },
  {
    'value': 'Europe/Brussels',
    'display_name': '(GMT+02:00) Europe/Brussels'
  },
  {
    'value': 'Europe/Budapest',
    'display_name': '(GMT+02:00) Europe/Budapest'
  },
  {
    'value': 'Europe/Busingen',
    'display_name': '(GMT+02:00) Europe/Busingen'
  },
  {
    'value': 'Europe/Copenhagen',
    'display_name': '(GMT+02:00) Europe/Copenhagen'
  },
  {
    'value': 'Europe/Gibraltar',
    'display_name': '(GMT+02:00) Europe/Gibraltar'
  },
  {
    'value': 'Europe/Kaliningrad',
    'display_name': '(GMT+02:00) Europe/Kaliningrad'
  },
  {
    'value': 'Europe/Ljubljana',
    'display_name': '(GMT+02:00) Europe/Ljubljana'
  },
  {
    'value': 'Europe/Luxembourg',
    'display_name': '(GMT+02:00) Europe/Luxembourg'
  },
  {
    'value': 'Europe/Madrid',
    'display_name': '(GMT+02:00) Europe/Madrid'
  },
  {
    'value': 'Europe/Malta',
    'display_name': '(GMT+02:00) Europe/Malta'
  },
  {
    'value': 'Europe/Monaco',
    'display_name': '(GMT+02:00) Europe/Monaco'
  },
  {
    'value': 'Europe/Oslo',
    'display_name': '(GMT+02:00) Europe/Oslo'
  },
  {
    'value': 'Europe/Paris',
    'display_name': '(GMT+02:00) Europe/Paris'
  },
  {
    'value': 'Europe/Podgorica',
    'display_name': '(GMT+02:00) Europe/Podgorica'
  },
  {
    'value': 'Europe/Prague',
    'display_name': '(GMT+02:00) Europe/Prague'
  },
  {
    'value': 'Europe/Rome',
    'display_name': '(GMT+02:00) Europe/Rome'
  },
  {
    'value': 'Europe/San_Marino',
    'display_name': '(GMT+02:00) Europe/San_Marino'
  },
  {
    'value': 'Europe/Sarajevo',
    'display_name': '(GMT+02:00) Europe/Sarajevo'
  },
  {
    'value': 'Europe/Skopje',
    'display_name': '(GMT+02:00) Europe/Skopje'
  },
  {
    'value': 'Europe/Stockholm',
    'display_name': '(GMT+02:00) Europe/Stockholm'
  },
  {
    'value': 'Europe/Tirane',
    'display_name': '(GMT+02:00) Europe/Tirane'
  },
  {
    'value': 'Europe/Vaduz',
    'display_name': '(GMT+02:00) Europe/Vaduz'
  },
  {
    'value': 'Europe/Vatican',
    'display_name': '(GMT+02:00) Europe/Vatican'
  },
  {
    'value': 'Europe/Vienna',
    'display_name': '(GMT+02:00) Europe/Vienna'
  },
  {
    'value': 'Europe/Warsaw',
    'display_name': '(GMT+02:00) Europe/Warsaw'
  },
  {
    'value': 'Europe/Zagreb',
    'display_name': '(GMT+02:00) Europe/Zagreb'
  },
  {
    'value': 'Europe/Zurich',
    'display_name': '(GMT+02:00) Europe/Zurich'
  },
  {
    'value': 'Africa/Addis_Ababa',
    'display_name': '(GMT+03:00) Africa/Addis_Ababa'
  },
  {
    'value': 'Africa/Asmara',
    'display_name': '(GMT+03:00) Africa/Asmara'
  },
  {
    'value': 'Africa/Dar_es_Salaam',
    'display_name': '(GMT+03:00) Africa/Dar_es_Salaam'
  },
  {
    'value': 'Africa/Djibouti',
    'display_name': '(GMT+03:00) Africa/Djibouti'
  },
  {
    'value': 'Africa/Juba',
    'display_name': '(GMT+03:00) Africa/Juba'
  },
  {
    'value': 'Africa/Kampala',
    'display_name': '(GMT+03:00) Africa/Kampala'
  },
  {
    'value': 'Africa/Mogadishu',
    'display_name': '(GMT+03:00) Africa/Mogadishu'
  },
  {
    'value': 'Africa/Nairobi',
    'display_name': '(GMT+03:00) Africa/Nairobi'
  },
  {
    'value': 'Antarctica/Syowa',
    'display_name': '(GMT+03:00) Antarctica/Syowa'
  },
  {
    'value': 'Asia/Aden',
    'display_name': '(GMT+03:00) Asia/Aden'
  },
  {
    'value': 'Asia/Amman',
    'display_name': '(GMT+03:00) Asia/Amman'
  },
  {
    'value': 'Asia/Baghdad',
    'display_name': '(GMT+03:00) Asia/Baghdad'
  },
  {
    'value': 'Asia/Bahrain',
    'display_name': '(GMT+03:00) Asia/Bahrain'
  },
  {
    'value': 'Asia/Beirut',
    'display_name': '(GMT+03:00) Asia/Beirut'
  },
  {
    'value': 'Asia/Damascus',
    'display_name': '(GMT+03:00) Asia/Damascus'
  },
  {
    'value': 'Asia/Famagusta',
    'display_name': '(GMT+03:00) Asia/Famagusta'
  },
  {
    'value': 'Asia/Gaza',
    'display_name': '(GMT+03:00) Asia/Gaza'
  },
  {
    'value': 'Asia/Hebron',
    'display_name': '(GMT+03:00) Asia/Hebron'
  },
  {
    'value': 'Asia/Jerusalem',
    'display_name': '(GMT+03:00) Asia/Jerusalem'
  },
  {
    'value': 'Asia/Kuwait',
    'display_name': '(GMT+03:00) Asia/Kuwait'
  },
  {
    'value': 'Asia/Nicosia',
    'display_name': '(GMT+03:00) Asia/Nicosia'
  },
  {
    'value': 'Asia/Qatar',
    'display_name': '(GMT+03:00) Asia/Qatar'
  },
  {
    'value': 'Asia/Riyadh',
    'display_name': '(GMT+03:00) Asia/Riyadh'
  },
  {
    'value': 'Europe/Athens',
    'display_name': '(GMT+03:00) Europe/Athens'
  },
  {
    'value': 'Europe/Bucharest',
    'display_name': '(GMT+03:00) Europe/Bucharest'
  },
  {
    'value': 'Europe/Chisinau',
    'display_name': '(GMT+03:00) Europe/Chisinau'
  },
  {
    'value': 'Europe/Helsinki',
    'display_name': '(GMT+03:00) Europe/Helsinki'
  },
  {
    'value': 'Europe/Istanbul',
    'display_name': '(GMT+03:00) Europe/Istanbul'
  },
  {
    'value': 'Europe/Kiev',
    'display_name': '(GMT+03:00) Europe/Kiev'
  },
  {
    'value': 'Europe/Kirov',
    'display_name': '(GMT+03:00) Europe/Kirov'
  },
  {
    'value': 'Europe/Mariehamn',
    'display_name': '(GMT+03:00) Europe/Mariehamn'
  },
  {
    'value': 'Europe/Minsk',
    'display_name': '(GMT+03:00) Europe/Minsk'
  },
  {
    'value': 'Europe/Moscow',
    'display_name': '(GMT+03:00) Europe/Moscow'
  },
  {
    'value': 'Europe/Riga',
    'display_name': '(GMT+03:00) Europe/Riga'
  },
  {
    'value': 'Europe/Simferopol',
    'display_name': '(GMT+03:00) Europe/Simferopol'
  },
  {
    'value': 'Europe/Sofia',
    'display_name': '(GMT+03:00) Europe/Sofia'
  },
  {
    'value': 'Europe/Tallinn',
    'display_name': '(GMT+03:00) Europe/Tallinn'
  },
  {
    'value': 'Europe/Uzhgorod',
    'display_name': '(GMT+03:00) Europe/Uzhgorod'
  },
  {
    'value': 'Europe/Vilnius',
    'display_name': '(GMT+03:00) Europe/Vilnius'
  },
  {
    'value': 'Europe/Zaporozhye',
    'display_name': '(GMT+03:00) Europe/Zaporozhye'
  },
  {
    'value': 'Indian/Antananarivo',
    'display_name': '(GMT+03:00) Indian/Antananarivo'
  },
  {
    'value': 'Indian/Comoro',
    'display_name': '(GMT+03:00) Indian/Comoro'
  },
  {
    'value': 'Indian/Mayotte',
    'display_name': '(GMT+03:00) Indian/Mayotte'
  },
  {
    'value': 'Asia/Baku',
    'display_name': '(GMT+04:00) Asia/Baku'
  },
  {
    'value': 'Asia/Dubai',
    'display_name': '(GMT+04:00) Asia/Dubai'
  },
  {
    'value': 'Asia/Muscat',
    'display_name': '(GMT+04:00) Asia/Muscat'
  },
  {
    'value': 'Asia/Tbilisi',
    'display_name': '(GMT+04:00) Asia/Tbilisi'
  },
  {
    'value': 'Asia/Yerevan',
    'display_name': '(GMT+04:00) Asia/Yerevan'
  },
  {
    'value': 'Europe/Astrakhan',
    'display_name': '(GMT+04:00) Europe/Astrakhan'
  },
  {
    'value': 'Europe/Samara',
    'display_name': '(GMT+04:00) Europe/Samara'
  },
  {
    'value': 'Europe/Saratov',
    'display_name': '(GMT+04:00) Europe/Saratov'
  },
  {
    'value': 'Europe/Ulyanovsk',
    'display_name': '(GMT+04:00) Europe/Ulyanovsk'
  },
  {
    'value': 'Europe/Volgograd',
    'display_name': '(GMT+04:00) Europe/Volgograd'
  },
  {
    'value': 'Indian/Mahe',
    'display_name': '(GMT+04:00) Indian/Mahe'
  },
  {
    'value': 'Indian/Mauritius',
    'display_name': '(GMT+04:00) Indian/Mauritius'
  },
  {
    'value': 'Indian/Reunion',
    'display_name': '(GMT+04:00) Indian/Reunion'
  },
  {
    'value': 'Asia/Kabul',
    'display_name': '(GMT+04:30) Asia/Kabul'
  },
  {
    'value': 'Asia/Tehran',
    'display_name': '(GMT+04:30) Asia/Tehran'
  },
  {
    'value': 'Antarctica/Mawson',
    'display_name': '(GMT+05:00) Antarctica/Mawson'
  },
  {
    'value': 'Asia/Aqtau',
    'display_name': '(GMT+05:00) Asia/Aqtau'
  },
  {
    'value': 'Asia/Aqtobe',
    'display_name': '(GMT+05:00) Asia/Aqtobe'
  },
  {
    'value': 'Asia/Ashgabat',
    'display_name': '(GMT+05:00) Asia/Ashgabat'
  },
  {
    'value': 'Asia/Atyrau',
    'display_name': '(GMT+05:00) Asia/Atyrau'
  },
  {
    'value': 'Asia/Dushanbe',
    'display_name': '(GMT+05:00) Asia/Dushanbe'
  },
  {
    'value': 'Asia/Karachi',
    'display_name': '(GMT+05:00) Asia/Karachi'
  },
  {
    'value': 'Asia/Oral',
    'display_name': '(GMT+05:00) Asia/Oral'
  },
  {
    'value': 'Asia/Qyzylorda',
    'display_name': '(GMT+05:00) Asia/Qyzylorda'
  },
  {
    'value': 'Asia/Samarkand',
    'display_name': '(GMT+05:00) Asia/Samarkand'
  },
  {
    'value': 'Asia/Tashkent',
    'display_name': '(GMT+05:00) Asia/Tashkent'
  },
  {
    'value': 'Asia/Yekaterinburg',
    'display_name': '(GMT+05:00) Asia/Yekaterinburg'
  },
  {
    'value': 'Indian/Kerguelen',
    'display_name': '(GMT+05:00) Indian/Kerguelen'
  },
  {
    'value': 'Indian/Maldives',
    'display_name': '(GMT+05:00) Indian/Maldives'
  },
  {
    'value': 'Asia/Colombo',
    'display_name': '(GMT+05:30) Asia/Colombo'
  },
  {
    'value': 'Asia/Kolkata',
    'display_name': '(GMT+05:30) Asia/Kolkata'
  },
  {
    'value': 'Asia/Kathmandu',
    'display_name': '(GMT+05:45) Asia/Kathmandu'
  },
  {
    'value': 'Antarctica/Vostok',
    'display_name': '(GMT+06:00) Antarctica/Vostok'
  },
  {
    'value': 'Asia/Almaty',
    'display_name': '(GMT+06:00) Asia/Almaty'
  },
  {
    'value': 'Asia/Bishkek',
    'display_name': '(GMT+06:00) Asia/Bishkek'
  },
  {
    'value': 'Asia/Dhaka',
    'display_name': '(GMT+06:00) Asia/Dhaka'
  },
  {
    'value': 'Asia/Omsk',
    'display_name': '(GMT+06:00) Asia/Omsk'
  },
  {
    'value': 'Asia/Qostanay',
    'display_name': '(GMT+06:00) Asia/Qostanay'
  },
  {
    'value': 'Asia/Thimphu',
    'display_name': '(GMT+06:00) Asia/Thimphu'
  },
  {
    'value': 'Asia/Urumqi',
    'display_name': '(GMT+06:00) Asia/Urumqi'
  },
  {
    'value': 'Indian/Chagos',
    'display_name': '(GMT+06:00) Indian/Chagos'
  },
  {
    'value': 'Asia/Yangon',
    'display_name': '(GMT+06:30) Asia/Yangon'
  },
  {
    'value': 'Indian/Cocos',
    'display_name': '(GMT+06:30) Indian/Cocos'
  },
  {
    'value': 'Antarctica/Davis',
    'display_name': '(GMT+07:00) Antarctica/Davis'
  },
  {
    'value': 'Asia/Bangkok',
    'display_name': '(GMT+07:00) Asia/Bangkok'
  },
  {
    'value': 'Asia/Barnaul',
    'display_name': '(GMT+07:00) Asia/Barnaul'
  },
  {
    'value': 'Asia/Ho_Chi_Minh',
    'display_name': '(GMT+07:00) Asia/Ho_Chi_Minh'
  },
  {
    'value': 'Asia/Hovd',
    'display_name': '(GMT+07:00) Asia/Hovd'
  },
  {
    'value': 'Asia/Jakarta',
    'display_name': '(GMT+07:00) Asia/Jakarta'
  },
  {
    'value': 'Asia/Krasnoyarsk',
    'display_name': '(GMT+07:00) Asia/Krasnoyarsk'
  },
  {
    'value': 'Asia/Novokuznetsk',
    'display_name': '(GMT+07:00) Asia/Novokuznetsk'
  },
  {
    'value': 'Asia/Novosibirsk',
    'display_name': '(GMT+07:00) Asia/Novosibirsk'
  },
  {
    'value': 'Asia/Phnom_Penh',
    'display_name': '(GMT+07:00) Asia/Phnom_Penh'
  },
  {
    'value': 'Asia/Pontianak',
    'display_name': '(GMT+07:00) Asia/Pontianak'
  },
  {
    'value': 'Asia/Tomsk',
    'display_name': '(GMT+07:00) Asia/Tomsk'
  },
  {
    'value': 'Asia/Vientiane',
    'display_name': '(GMT+07:00) Asia/Vientiane'
  },
  {
    'value': 'Indian/Christmas',
    'display_name': '(GMT+07:00) Indian/Christmas'
  },
  {
    'value': 'Antarctica/Casey',
    'display_name': '(GMT+08:00) Antarctica/Casey'
  },
  {
    'value': 'Asia/Brunei',
    'display_name': '(GMT+08:00) Asia/Brunei'
  },
  {
    'value': 'Asia/Choibalsan',
    'display_name': '(GMT+08:00) Asia/Choibalsan'
  },
  {
    'value': 'Asia/Hong_Kong',
    'display_name': '(GMT+08:00) Asia/Hong_Kong'
  },
  {
    'value': 'Asia/Irkutsk',
    'display_name': '(GMT+08:00) Asia/Irkutsk'
  },
  {
    'value': 'Asia/Kuala_Lumpur',
    'display_name': '(GMT+08:00) Asia/Kuala_Lumpur'
  },
  {
    'value': 'Asia/Kuching',
    'display_name': '(GMT+08:00) Asia/Kuching'
  },
  {
    'value': 'Asia/Macau',
    'display_name': '(GMT+08:00) Asia/Macau'
  },
  {
    'value': 'Asia/Makassar',
    'display_name': '(GMT+08:00) Asia/Makassar'
  },
  {
    'value': 'Asia/Manila',
    'display_name': '(GMT+08:00) Asia/Manila'
  },
  {
    'value': 'Asia/Shanghai',
    'display_name': '(GMT+08:00) Asia/Shanghai'
  },
  {
    'value': 'Asia/Singapore',
    'display_name': '(GMT+08:00) Asia/Singapore'
  },
  {
    'value': 'Asia/Taipei',
    'display_name': '(GMT+08:00) Asia/Taipei'
  },
  {
    'value': 'Asia/Ulaanbaatar',
    'display_name': '(GMT+08:00) Asia/Ulaanbaatar'
  },
  {
    'value': 'Australia/Perth',
    'display_name': '(GMT+08:00) Australia/Perth'
  },
  {
    'value': 'Australia/Eucla',
    'display_name': '(GMT+08:45) Australia/Eucla'
  },
  {
    'value': 'Asia/Chita',
    'display_name': '(GMT+09:00) Asia/Chita'
  },
  {
    'value': 'Asia/Dili',
    'display_name': '(GMT+09:00) Asia/Dili'
  },
  {
    'value': 'Asia/Jayapura',
    'display_name': '(GMT+09:00) Asia/Jayapura'
  },
  {
    'value': 'Asia/Khandyga',
    'display_name': '(GMT+09:00) Asia/Khandyga'
  },
  {
    'value': 'Asia/Pyongyang',
    'display_name': '(GMT+09:00) Asia/Pyongyang'
  },
  {
    'value': 'Asia/Seoul',
    'display_name': '(GMT+09:00) Asia/Seoul'
  },
  {
    'value': 'Asia/Tokyo',
    'display_name': '(GMT+09:00) Asia/Tokyo'
  },
  {
    'value': 'Asia/Yakutsk',
    'display_name': '(GMT+09:00) Asia/Yakutsk'
  },
  {
    'value': 'Pacific/Palau',
    'display_name': '(GMT+09:00) Pacific/Palau'
  },
  {
    'value': 'Australia/Adelaide',
    'display_name': '(GMT+09:30) Australia/Adelaide'
  },
  {
    'value': 'Australia/Broken_Hill',
    'display_name': '(GMT+09:30) Australia/Broken_Hill'
  },
  {
    'value': 'Australia/Darwin',
    'display_name': '(GMT+09:30) Australia/Darwin'
  },
  {
    'value': 'Antarctica/DumontDUrville',
    'display_name': '(GMT+10:00) Antarctica/DumontDUrville'
  },
  {
    'value': 'Asia/Ust-Nera',
    'display_name': '(GMT+10:00) Asia/Ust-Nera'
  },
  {
    'value': 'Asia/Vladivostok',
    'display_name': '(GMT+10:00) Asia/Vladivostok'
  },
  {
    'value': 'Australia/Brisbane',
    'display_name': '(GMT+10:00) Australia/Brisbane'
  },
  {
    'value': 'Australia/Currie',
    'display_name': '(GMT+10:00) Australia/Currie'
  },
  {
    'value': 'Australia/Hobart',
    'display_name': '(GMT+10:00) Australia/Hobart'
  },
  {
    'value': 'Australia/Lindeman',
    'display_name': '(GMT+10:00) Australia/Lindeman'
  },
  {
    'value': 'Australia/Melbourne',
    'display_name': '(GMT+10:00) Australia/Melbourne'
  },
  {
    'value': 'Australia/Sydney',
    'display_name': '(GMT+10:00) Australia/Sydney'
  },
  {
    'value': 'Pacific/Chuuk',
    'display_name': '(GMT+10:00) Pacific/Chuuk'
  },
  {
    'value': 'Pacific/Guam',
    'display_name': '(GMT+10:00) Pacific/Guam'
  },
  {
    'value': 'Pacific/Port_Moresby',
    'display_name': '(GMT+10:00) Pacific/Port_Moresby'
  },
  {
    'value': 'Pacific/Saipan',
    'display_name': '(GMT+10:00) Pacific/Saipan'
  },
  {
    'value': 'Australia/Lord_Howe',
    'display_name': '(GMT+10:30) Australia/Lord_Howe'
  },
  {
    'value': 'Antarctica/Macquarie',
    'display_name': '(GMT+11:00) Antarctica/Macquarie'
  },
  {
    'value': 'Asia/Magadan',
    'display_name': '(GMT+11:00) Asia/Magadan'
  },
  {
    'value': 'Asia/Sakhalin',
    'display_name': '(GMT+11:00) Asia/Sakhalin'
  },
  {
    'value': 'Asia/Srednekolymsk',
    'display_name': '(GMT+11:00) Asia/Srednekolymsk'
  },
  {
    'value': 'Pacific/Bougainville',
    'display_name': '(GMT+11:00) Pacific/Bougainville'
  },
  {
    'value': 'Pacific/Efate',
    'display_name': '(GMT+11:00) Pacific/Efate'
  },
  {
    'value': 'Pacific/Guadalcanal',
    'display_name': '(GMT+11:00) Pacific/Guadalcanal'
  },
  {
    'value': 'Pacific/Kosrae',
    'display_name': '(GMT+11:00) Pacific/Kosrae'
  },
  {
    'value': 'Pacific/Norfolk',
    'display_name': '(GMT+11:00) Pacific/Norfolk'
  },
  {
    'value': 'Pacific/Noumea',
    'display_name': '(GMT+11:00) Pacific/Noumea'
  },
  {
    'value': 'Pacific/Pohnpei',
    'display_name': '(GMT+11:00) Pacific/Pohnpei'
  },
  {
    'value': 'Antarctica/McMurdo',
    'display_name': '(GMT+12:00) Antarctica/McMurdo'
  },
  {
    'value': 'Asia/Anadyr',
    'display_name': '(GMT+12:00) Asia/Anadyr'
  },
  {
    'value': 'Asia/Kamchatka',
    'display_name': '(GMT+12:00) Asia/Kamchatka'
  },
  {
    'value': 'Pacific/Auckland',
    'display_name': '(GMT+12:00) Pacific/Auckland'
  },
  {
    'value': 'Pacific/Fiji',
    'display_name': '(GMT+12:00) Pacific/Fiji'
  },
  {
    'value': 'Pacific/Funafuti',
    'display_name': '(GMT+12:00) Pacific/Funafuti'
  },
  {
    'value': 'Pacific/Kwajalein',
    'display_name': '(GMT+12:00) Pacific/Kwajalein'
  },
  {
    'value': 'Pacific/Majuro',
    'display_name': '(GMT+12:00) Pacific/Majuro'
  },
  {
    'value': 'Pacific/Nauru',
    'display_name': '(GMT+12:00) Pacific/Nauru'
  },
  {
    'value': 'Pacific/Tarawa',
    'display_name': '(GMT+12:00) Pacific/Tarawa'
  },
  {
    'value': 'Pacific/Wake',
    'display_name': '(GMT+12:00) Pacific/Wake'
  },
  {
    'value': 'Pacific/Wallis',
    'display_name': '(GMT+12:00) Pacific/Wallis'
  },
  {
    'value': 'Pacific/Chatham',
    'display_name': '(GMT+12:45) Pacific/Chatham'
  },
  {
    'value': 'Pacific/Apia',
    'display_name': '(GMT+13:00) Pacific/Apia'
  },
  {
    'value': 'Pacific/Enderbury',
    'display_name': '(GMT+13:00) Pacific/Enderbury'
  },
  {
    'value': 'Pacific/Fakaofo',
    'display_name': '(GMT+13:00) Pacific/Fakaofo'
  },
  {
    'value': 'Pacific/Tongatapu',
    'display_name': '(GMT+13:00) Pacific/Tongatapu'
  },
  {
    'value': 'Pacific/Kiritimati',
    'display_name': '(GMT+14:00) Pacific/Kiritimati'
  }
]

export default timeZoneList
