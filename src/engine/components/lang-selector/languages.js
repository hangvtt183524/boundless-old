
const allLanguages = [
  ['za', 'Afrikaans', 'AF', 'South Africa'],
  ['al', 'Albanian', 'SQ', 'Albania'],
  // ['dz', 'Arabic', 'AR', 'Algeria'],
  // ['bh', 'Arabic', 'AR', 'Bahrain'],
  // ['eg', 'Arabic', 'AR', 'Egypt'],
  // ['iq', 'Arabic', 'AR', 'Iraq'],
  // ['jo', 'Arabic', 'AR', 'Jordan'],
  // ['kw', 'Arabic', 'AR', 'Kuwait'],
  // ['lb', 'Arabic', 'AR', 'Lebanon'],
  // ['ly', 'Arabic', 'AR', 'Libya'],
  // ['ma', 'Arabic', 'AR', 'Morocco'],
  // ['om', 'Arabic', 'AR', 'Oman'],
  // ['qa', 'Arabic', 'AR', 'Qatar'],
  // ['sa', 'Arabic', 'AR', 'Saudi Arabia'],
  // ['sy', 'Arabic', 'AR', 'Syria'],
  // ['tn', 'Arabic', 'AR', 'Tunisia'],
  ['ae', 'Arabic', 'AR', 'United Arab Emirates'],
  // ['ye', 'Arabic', 'AR', 'Yemen'],
  ['am', 'Armenian', 'HY', 'Armenia'],
  ['az', 'Azeri', 'az-AZ', 'Azerbaijan'],
  ['es-pv', 'Basque', 'EU', 'Basque'],
  ['by', 'Belarusian', 'be_BY', 'Belarus'],
  ['bg', 'Bulgarian', 'BG', 'Bulgaria'],
  ['cn', 'Chinese', 'ZH', 'China'],
  // ['hk', 'Chinese', 'ZH', 'Hong Kong SAR'],
  // ['mo', 'Chinese', 'ZH', 'Macau SAR'],
  // ['sg', 'Chinese', 'ZH', 'Singapore'],
  // ['tw', 'Chinese', 'ZH', 'Taiwan'],
  ['hr', 'Croatian', 'HR', 'Croatia'],
  ['cz', 'Czech', 'CS', 'Czech Republic'],
  ['dk', 'Danish', 'DA', 'Denmark'],
  // ['be', 'Dutch', 'NL', 'Belgium'],
  ['nl', 'Dutch', 'NL', 'The Netherlands'],
  // ['au', 'English', 'EN', 'Australia'],
  // ['bz', 'English', 'EN', 'Belize'],
  // ['ca', 'English', 'EN', 'Canada'],
  // ['cb', 'English', 'EN', 'Caribbean'],
  // ['ie', 'English', 'EN', 'Ireland'],
  // ['jm', 'English', 'EN', 'Jamaica'],
  // ['nz', 'English', 'EN', 'New Zealand'],
  // ['ph', 'English', 'EN', 'Philippines'],
  // ['za', 'English', 'EN', 'South Africa'],
  // ['tt', 'English', 'EN', 'Trinidad and Tobago'],
  // ['gb', 'English', 'EN', 'United Kingdom'],
  ['us', 'English', 'EN', 'United States'],
  // ['zw', 'English', 'EN', 'Zimbabwe'],
  ['ee', 'Estonian', 'ET', 'Estonia'],
  ['fo', 'Faroese', 'FO', 'Faroe Islands'],
  ['fi', 'Finnish', 'FI', 'Finland'],
  // ['be', 'French', 'FR', 'Belgium'],
  // ['ca', 'French', 'FR', 'Canada'],
  ['fr', 'French', 'FR', 'France'],
  // ['lu', 'French', 'FR', 'Luxembourg'],
  // ['mc', 'French', 'FR', 'Monaco'],
  // ['ch', 'French', 'FR', 'Switzerland'],
  ['es', 'Galician', 'GL', 'Galician'],
  ['ge', 'Georgian', 'KA', 'Georgia'],
  // ['at', 'German', 'DE', 'Austria'],
  ['de', 'German', 'DE', 'Germany'],
  // ['li', 'German', 'DE', 'Liechtenstein'],
  // ['lu', 'German', 'DE', 'Luxembourg'],
  // ['ch', 'German', 'DE', 'Switzerland'],
  ['gr', 'Greek', 'EL', 'Greece'],
  ['in', 'Gujarati', 'GU', 'India'],
  ['il', 'Hebrew', 'IW', 'Israel'],
  ['in', 'Hindi', 'HI', 'India'],
  ['hu', 'Hungarian', 'HU', 'Hungary'],
  ['is', 'Icelandic', 'IS', 'Iceland'],
  ['id', 'Indonesian', 'IN', 'Indonesia'],
  ['it', 'Italian', 'IT', 'Italy'],
  // ['ch', 'Italian', 'IT', 'Switzerland'],
  ['jp', 'Japanese', 'JA', 'Japan'],
  ['in', 'Kannada', 'KN', 'India'],
  ['kz', 'Kazakh', 'KK', 'Kazakhstan'],
  ['kr', 'Korean', 'KO', 'Korea'],
  ['lv', 'Latvian', 'LV', 'Latvia'],
  ['lt', 'Lithuanian', 'LT', 'Lithuania'],
  ['mk', 'Macedonian', 'MK', 'Macedonia'],
  // ['bn', 'Malay', 'MS', 'Brunei'],
  ['my', 'Malay', 'MS', 'Malaysia'],
  ['in', 'Marathi', 'MR', 'India'],
  ['mn', 'Mongolian', 'MN', 'Mongolia'],
  ['mm', 'Burmese', 'MY', 'Myanmar'],
  // ['no', 'Norwegian', 'NO', 'Norway'],
  ['no', 'Norwegian', 'NO', 'Norway'],
  ['pl', 'Polish', 'PL', 'Poland'],
  // ['br', 'Portuguese', 'PT', 'Brazil'],
  ['pt', 'Portuguese', 'PT', 'Portugal'],
  ['in', 'Punjabi', 'PA', 'India'],
  ['ro', 'Romanian', 'RO', 'Romania'],
  ['ru', 'Russian', 'RU', 'Russia'],
  ['in', 'Sanskrit', 'SA', 'India'],
  ['rs', 'Serbian', 'SR', 'Serbia'],
  ['sk', 'Slovak', 'SK', 'Slovakia'],
  ['si', 'Slovenian', 'SL', 'Slovenia'],
  // ['ar', 'Spanish', 'ES', 'Argentina'],
  // ['bo', 'Spanish', 'ES', 'Bolivia'],
  // ['cl', 'Spanish', 'ES', 'Chile'],
  // ['co', 'Spanish', 'ES', 'Colombia'],
  // ['cr', 'Spanish', 'ES', 'Costa Rica'],
  // ['do', 'Spanish', 'ES', 'Dominican Republic'],
  // ['ec', 'Spanish', 'ES', 'Ecuador'],
  // ['sv', 'Spanish', 'ES', 'El Salvador'],
  // ['gt', 'Spanish', 'ES', 'Guatemala'],
  // ['hn', 'Spanish', 'ES', 'Honduras'],
  // ['mx', 'Spanish', 'ES', 'Mexico'],
  // ['ni', 'Spanish', 'ES', 'Nicaragua'],
  // ['pa', 'Spanish', 'ES', 'Panama'],
  // ['py', 'Spanish', 'ES', 'Paraguay'],
  // ['pe', 'Spanish', 'ES', 'Peru'],
  // ['pr', 'Spanish', 'ES', 'Puerto Rico'],
  ['es', 'Spanish', 'ES', 'Spain'],
  // ['uy', 'Spanish', 'ES', 'Uruguay'],
  // ['ve', 'Spanish', 'ES', 'Venezuela'],
  ['ke', 'Swahili', 'SW', 'Kenya'],
  // ['fi', 'Swedish', 'SV', 'Finland'],
  ['se', 'Swedish', 'SV', 'Sweden'],
  ['in', 'Tamil', 'TA', 'India'],
  ['ru', 'Tatar', 'TT', 'Russia'],
  ['in', 'Telugu', 'TE', 'India'],
  ['th', 'Thai', 'TH', 'Thailand'],
  ['tr', 'Turkish', 'TR', 'Turkey'],
  ['ua', 'Ukrainian', 'UK', 'Ukraine'],
  ['pk', 'Urdu', 'UR', 'Pakistan'],
  ['uz', 'Uzbek', 'UZ', 'Uzbekistan'],
  ['vn', 'Vietnamese', 'VI', 'Vietnam'],
  ['gb', 'Welsh', 'CY', 'United Kingdom']
]

// loop over all of the countries above
for (let i = 0; i < allLanguages.length; i += 1) {
  const langInfo = allLanguages[i]
  allLanguages[i] = {
    language: langInfo[1],
    country: langInfo[3],
    iso2: langInfo[0].toUpperCase(),
    locale: langInfo[2].toLowerCase(),
    localeCountry: langInfo[2].toLowerCase() + '_' + langInfo[0].toUpperCase(),
    vtelClass: `flag iti-flag ${langInfo[0]}`
  }
}

export default allLanguages
