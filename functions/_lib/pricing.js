const DEFAULT_CURRENCY = 'USD';

const CURRENCY_COUNTRIES = {
  AED: ['AE'],
  SAR: ['SA'],
  QAR: ['QA'],
  OMR: ['OM'],
  KWD: ['KW'],
  BHD: ['BH'],
  USD: ['AS', 'BQ', 'EC', 'FM', 'GU', 'IO', 'MH', 'MP', 'PA', 'PR', 'PW', 'SV', 'TC', 'TL', 'UM', 'US', 'VG', 'VI', 'ZW', 'CU', 'IR', 'KP', 'SY'],
  EUR: ['AD', 'AT', 'AX', 'BE', 'BL', 'CY', 'DE', 'EE', 'ES', 'FI', 'FR', 'GF', 'GP', 'GR', 'HR', 'IE', 'IT', 'LT', 'LU', 'LV', 'MC', 'ME', 'MF', 'MQ', 'MT', 'NL', 'PM', 'PT', 'RE', 'SI', 'SK', 'SM', 'TF', 'VA', 'XK'],
  GBP: ['GB', 'GG', 'IM', 'JE', 'GS'],
  AUD: ['AU', 'CC', 'CX', 'HM', 'KI', 'NR', 'NF', 'TV'],
  NZD: ['CK', 'NU', 'NZ', 'PN', 'TK'],
  CAD: ['CA'],
  CHF: ['CH', 'LI'],
  JPY: ['JP'],
  CNY: ['CN'],
  HKD: ['HK'],
  SGD: ['SG'],
  TWD: ['TW'],
  KRW: ['KR'],
  INR: ['BT', 'IN'],
  IDR: ['ID'],
  MYR: ['MY'],
  THB: ['TH'],
  PHP: ['PH'],
  VND: ['VN'],
  PKR: ['PK'],
  BDT: ['BD'],
  LKR: ['LK'],
  NPR: ['NP'],
  MVR: ['MV'],
  TRY: ['TR'],
  ILS: ['IL', 'PS'],
  JOD: ['JO'],
  EGP: ['EG'],
  MAD: ['MA', 'EH'],
  TND: ['TN'],
  DZD: ['DZ'],
  LYD: ['LY'],
  IQD: ['IQ'],
  YER: ['YE'],
  LBP: ['LB'],
  MXN: ['MX'],
  BRL: ['BR'],
  ARS: ['AR'],
  CLP: ['CL'],
  COP: ['CO'],
  PEN: ['PE'],
  UYU: ['UY'],
  PYG: ['PY'],
  BOB: ['BO'],
  CRC: ['CR'],
  NIO: ['NI'],
  HNL: ['HN'],
  GTQ: ['GT'],
  BZD: ['BZ'],
  DOP: ['DO'],
  JMD: ['JM'],
  TTD: ['TT'],
  BBD: ['BB'],
  BSD: ['BS'],
  XCD: ['AG', 'AI', 'DM', 'GD', 'KN', 'LC', 'MS', 'VC'],
  AWG: ['AW'],
  ANG: ['CW', 'SX'],
  KYD: ['KY'],
  BMD: ['BM'],
  HTG: ['HT'],
  GYD: ['GY'],
  SRD: ['SR'],
  SEK: ['SE'],
  NOK: ['BV', 'NO', 'SJ'],
  DKK: ['DK', 'FO', 'GL'],
  PLN: ['PL'],
  CZK: ['CZ'],
  HUF: ['HU'],
  RON: ['RO'],
  BGN: ['BG'],
  RSD: ['RS'],
  MKD: ['MK'],
  ALL: ['AL'],
  BAM: ['BA'],
  MDL: ['MD'],
  UAH: ['UA'],
  RUB: ['RU'],
  BYN: ['BY'],
  GEL: ['GE'],
  AMD: ['AM'],
  AZN: ['AZ'],
  KZT: ['KZ'],
  KGS: ['KG'],
  UZS: ['UZ'],
  TJS: ['TJ'],
  TMT: ['TM'],
  MNT: ['MN'],
  ZAR: ['ZA'],
  BWP: ['BW'],
  NAD: ['NA'],
  LSL: ['LS'],
  SZL: ['SZ'],
  ZMW: ['ZM'],
  MWK: ['MW'],
  MZN: ['MZ'],
  AOA: ['AO'],
  KES: ['KE'],
  UGX: ['UG'],
  TZS: ['TZ'],
  RWF: ['RW'],
  BIF: ['BI'],
  CDF: ['CD'],
  XAF: ['CF', 'CG', 'CM', 'GA', 'GQ', 'TD'],
  XOF: ['BJ', 'BF', 'CI', 'GW', 'ML', 'NE', 'SN', 'TG'],
  CVE: ['CV'],
  GMD: ['GM'],
  GHS: ['GH'],
  GNF: ['GN'],
  LRD: ['LR'],
  SLL: ['SL'],
  NGN: ['NG'],
  STN: ['ST'],
  ETB: ['ET'],
  ERN: ['ER'],
  DJF: ['DJ'],
  SOS: ['SO'],
  SCR: ['SC'],
  MUR: ['MU'],
  MGA: ['MG'],
  KMF: ['KM'],
  MRU: ['MR'],
  SDG: ['SD'],
  SSP: ['SS'],
  AFN: ['AF'],
  MMK: ['MM'],
  KHR: ['KH'],
  LAK: ['LA'],
  BND: ['BN'],
  FJD: ['FJ'],
  PGK: ['PG'],
  SBD: ['SB'],
  TOP: ['TO'],
  WST: ['WS'],
  VUV: ['VU'],
  XPF: ['NC', 'PF', 'WF'],
  FKP: ['FK'],
  SHP: ['SH'],
  GIP: ['GI'],
  ISK: ['IS'],
  MOP: ['MO'],
};

const COUNTRY_TO_CURRENCY = Object.entries(CURRENCY_COUNTRIES).reduce((acc, [currency, countries]) => {
  countries.forEach((country) => {
    acc[country] = currency;
  });
  return acc;
}, {});

const PRICE_BY_CURRENCY = {
  AED: 39.99, SAR: 39.99, QAR: 39.99, OMR: 3.99, KWD: 2.99, BHD: 3.99,
  USD: 9.99, EUR: 9.99, GBP: 7.99, CAD: 13.99, AUD: 15.99, NZD: 17.99, CHF: 8.99,
  JPY: 1499, CNY: 72.99, HKD: 79.99, SGD: 13.99, TWD: 329.99, KRW: 13900,
  INR: 849.99, IDR: 159000, MYR: 45.99, THB: 359.99, PHP: 579.99, VND: 259000,
  PKR: 2799.99, BDT: 1199.99, LKR: 2999.99, NPR: 1399.99, MVR: 159.99,
  TRY: 399.99, ILS: 36.99, JOD: 6.99, EGP: 499.99, MAD: 99.99, TND: 31.99,
  DZD: 1349.99, LYD: 49.99, IQD: 13000, YER: 2499, LBP: 899000,
  MXN: 199.99, BRL: 54.99, ARS: 11999.99, CLP: 9990, COP: 39999, PEN: 36.99,
  UYU: 399.99, PYG: 79999, BOB: 69.99, CRC: 5199.99, NIO: 369.99, HNL: 249.99,
  GTQ: 79.99, BZD: 19.99, DOP: 599.99, JMD: 1599.99, TTD: 67.99, BBD: 19.99,
  BSD: 9.99, XCD: 26.99, AWG: 17.99, ANG: 17.99, KYD: 8.29, BMD: 9.99,
  HTG: 1299.99, GYD: 2099.99, SRD: 399.99,
  SEK: 109.99, NOK: 109.99, DKK: 74.99, PLN: 42.99, CZK: 249.99, HUF: 3990,
  RON: 49.99, BGN: 19.99, RSD: 1099.99, MKD: 599.99, ALL: 999.99, BAM: 19.99,
  MDL: 179.99, UAH: 399.99, RUB: 999.99, BYN: 32.99, GEL: 27.99, AMD: 3999.99,
  AZN: 16.99, KZT: 4999.99, KGS: 899.99, UZS: 125000, TJS: 109.99, TMT: 34.99,
  MNT: 34999,
  ZAR: 189.99, BWP: 139.99, NAD: 189.99, LSL: 189.99, SZL: 189.99, ZMW: 259.99,
  MWK: 17999, MZN: 639.99, AOA: 8999.99, KES: 1299.99, UGX: 37999, TZS: 25999,
  RWF: 13999, BIF: 29999, CDF: 29999, XAF: 5999, XOF: 5999, CVE: 999.99,
  GMD: 699.99, GHS: 129.99, GNF: 89999, LRD: 1899.99, SLL: 229999, NGN: 15999,
  STN: 229.99, ETB: 1099.99, ERN: 149.99, DJF: 1799, SOS: 5699, SCR: 139.99,
  MUR: 449.99, MGA: 44999, KMF: 4499, MRU: 399.99, SDG: 5999, SSP: 9999,
  AFN: 699.99, MMK: 20999, KHR: 39999, LAK: 219999, BND: 13.99, FJD: 22.99,
  PGK: 39.99, SBD: 83.99, TOP: 23.99, WST: 27.99, VUV: 1199, XPF: 1099,
  FKP: 7.99, SHP: 7.99, GIP: 7.99, ISK: 1399, MOP: 79.99,
};

const ZERO_DECIMAL_CURRENCIES = new Set([
  'BIF', 'CLP', 'DJF', 'GNF', 'IDR', 'JPY', 'KMF', 'KRW', 'MGA', 'PYG',
  'RWF', 'UGX', 'VND', 'VUV', 'XAF', 'XOF', 'XPF',
]);

const THREE_DECIMAL_CURRENCIES = new Set(['BHD', 'IQD', 'JOD', 'KWD', 'LYD', 'OMR', 'TND']);

const ARABIC_CURRENCY_NAMES = {
  AED: 'درهم', SAR: 'ريال', QAR: 'ريال قطري', OMR: 'ريال عماني', KWD: 'دينار كويتي',
  BHD: 'دينار بحريني', USD: 'USD', EUR: 'EUR', GBP: 'GBP',
};

export function getPricingForRequest(request, env) {
  const url = new URL(request.url);
  const country = normalizeCountry(url.searchParams.get('country') || request.cf?.country || request.headers.get('cf-ipcountry') || 'SA');
  const forcedCurrency = normalizeCurrency(url.searchParams.get('currency'));
  const countryCurrency = COUNTRY_TO_CURRENCY[country] || DEFAULT_CURRENCY;
  const currency = PRICE_BY_CURRENCY[forcedCurrency] ? forcedCurrency : PRICE_BY_CURRENCY[countryCurrency] ? countryCurrency : DEFAULT_CURRENCY;
  const majorAmount = PRICE_BY_CURRENCY[currency] || PRICE_BY_CURRENCY[DEFAULT_CURRENCY];
  const amount = toMinorUnits(majorAmount, currency);

  return {
    amount,
    country,
    currency: currency.toLowerCase(),
    currencyCode: currency,
    majorAmount,
    priceLabel: formatPrice(majorAmount, currency),
  };
}

export function toMinorUnits(majorAmount, currency) {
  const exponent = getCurrencyExponent(currency);
  return Math.round(Number(majorAmount) * 10 ** exponent);
}

export function getCurrencyExponent(currency) {
  const code = normalizeCurrency(currency);
  if (ZERO_DECIMAL_CURRENCIES.has(code)) return 0;
  if (THREE_DECIMAL_CURRENCIES.has(code)) return 3;
  return 2;
}

export function formatPrice(majorAmount, currency) {
  const code = normalizeCurrency(currency);
  const exponent = getCurrencyExponent(code);
  const formattedAmount = Number(majorAmount).toLocaleString('en-US', {
    minimumFractionDigits: exponent === 0 ? 0 : 2,
    maximumFractionDigits: exponent === 0 ? 0 : 2,
  });
  return `${formattedAmount} ${ARABIC_CURRENCY_NAMES[code] || code}`;
}

function normalizeCountry(country) {
  return String(country || '').trim().toUpperCase().slice(0, 2);
}

function normalizeCurrency(currency) {
  return String(currency || '').trim().toUpperCase().slice(0, 3);
}
