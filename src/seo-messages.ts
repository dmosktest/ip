import { localeNames, localeUrl, type Locale } from "./site-config";

export type SeoCopy = {
  title: string;
  description: string;
  heading: string;
  leadHtml: string;
};

const titles = localeNames({
  en: "What is my IP — see your public IP and country",
  ru: "Узнать мой IP — внешний адрес и страна",
  zh: "我的 IP — 查看公网 IP 与国家/地区",
  es: "Cuál es mi IP — IP pública y país",
  hi: "मेरा IP क्या है — सार्वजनिक IP और देश",
  ar: "ما هو عنوان IP الخاص بي — العنوان العام والدولة",
  bn: "আমার IP কী — পাবলিক IP ও দেশ",
  pt: "Qual é o meu IP — IP público e país",
  fr: "Quelle est mon IP — IP publique et pays",
  de: "Was ist meine IP — öffentliche IP und Land",
  ja: "自分のIPを確認 — グローバルIPと国",
  id: "Apa IP saya — IP publik dan negara",
  pa: "ਮੇਰਾ IP ਕੀ ਹੈ — ਪਬਲਿਕ IP ਅਤੇ ਦੇਸ਼",
  jv: "Apa IP kula — IP publik lan negara",
  te: "నా IP ఏమిటి — పబ్లిక్ IP మరియు దేశం",
  tr: "IP'm nedir — genel IP ve ülke",
  ko: "내 IP 확인 — 공인 IP와 국가",
  mr: "माझा IP काय आहे — सार्वजनिक IP आणि देश",
  vi: "IP của tôi là gì — IP công cộng và quốc gia",
  ta: "என் IP என்ன — பொது IP மற்றும் நாடு",
  it: "Qual è il mio IP — IP pubblico e paese",
  fa: "IP من چیست — آدرس عمومی و کشور",
  tlh: "IP wIj — Hol Sep je",
});

const descriptions = localeNames({
  en: "See your public IP address and country instantly. One click to copy. No signup.",
  ru: "Мгновенно узнайте внешний IP и страну. Скопируйте одним кликом. Без регистрации.",
  zh: "立即查看您的公网 IP 与国家/地区。一键复制，无需注册。",
  es: "Vea al instante su IP pública y el país. Cópiela con un clic. Sin registro.",
  hi: "तुरंत अपना सार्वजनिक IP और देश देखें। एक क्लिक में कॉपी। बिना साइन अप।",
  ar: "اعرض عنوان IP العام وبلدك فوراً. انسخ بنقرة. بدون تسجيل.",
  bn: "তাৎক্ষণিকভাবে আপনার পাবলিক IP ও দেশ দেখুন। এক ক্লিকে কপি। সাইন আপ নেই।",
  pt: "Veja de imediato o seu IP público e o país. Copie com um clique. Sem registo.",
  fr: "Voyez immédiatement votre IP publique et le pays. Copiez en un clic. Sans inscription.",
  de: "Sehen Sie sofort Ihre öffentliche IP und das Land. Mit einem Klick kopieren. Ohne Anmeldung.",
  ja: "グローバルIPと国をすぐに確認。ワンクリックでコピー。登録不要。",
  id: "Lihat IP publik dan negara Anda secara instan. Salin dengan satu klik. Tanpa daftar.",
  pa: "ਤੁਰੰਤ ਆਪਣਾ ਪਬਲਿਕ IP ਅਤੇ ਦੇਸ਼ ਵੇਖੋ। ਇੱਕ ਕਲਿੱਕ ਨਾਲ ਕਾਪੀ। ਬਿਨਾਂ ਸਾਈਨ ਅੱਪ।",
  jv: "Deleng IP publik lan negara sampeyan kanthi cepet. Salin sak klik. Ora perlu ndaftar.",
  te: "మీ పబ్లిక్ IP మరియు దేశాన్ని వెంటనే చూడండి. ఒక్క క్లిక్‌తో కాపీ. సైన్ అప్ లేదు.",
  tr: "Genel IP adresinizi ve ülkenizi anında görün. Tek tıkla kopyalayın. Kayıt yok.",
  ko: "공인 IP와 국가를 바로 확인하세요. 한 번 클릭으로 복사. 가입 불필요.",
  mr: "तुमचा सार्वजनिक IP आणि देश लगेच पहा. एका क्लिकने कॉपी. साइन अप नाही.",
  vi: "Xem ngay IP công cộng và quốc gia. Sao chép một cú nhấp. Không cần đăng ký.",
  ta: "உங்கள் பொது IP மற்றும் நாட்டை உடனடி பாருங்கள். ஒரு கிளிக்கில் நகல். பதிவு இல்லை.",
  it: "Vedi subito il tuo IP pubblico e il paese. Copia con un clic. Senza registrazione.",
  fa: "آدرس IP عمومی و کشور خود را فوری ببینید. با یک کلیک کپی کنید. بدون ثبت‌نام.",
  tlh: "IP Hol Sep je yIlegh. wa' click qaw'.",
});

const headings = localeNames({
  en: "Your IP address",
  ru: "Ваш IP-адрес",
  zh: "您的 IP 地址",
  es: "Su dirección IP",
  hi: "आपका IP पता",
  ar: "عنوان IP الخاص بك",
  bn: "আপনার IP ঠিকানা",
  pt: "O seu endereço IP",
  fr: "Votre adresse IP",
  de: "Ihre IP-Adresse",
  ja: "あなたのIPアドレス",
  id: "Alamat IP Anda",
  pa: "ਤੁਹਾਡਾ IP ਪਤਾ",
  jv: "Alamat IP sampeyan",
  te: "మీ IP చిరునామా",
  tr: "IP adresiniz",
  ko: "내 IP 주소",
  mr: "तुमचा IP पत्ता",
  vi: "Địa chỉ IP của bạn",
  ta: "உங்கள் IP முகவரி",
  it: "Il tuo indirizzo IP",
  fa: "آدرس IP شما",
  tlh: "IP Daj",
});

const leads = localeNames({
  en: "This is the public address your connection shows to websites. Copy it or check the country below.",
  ru: "Это внешний адрес, который видят сайты при вашем подключении. Скопируйте его или посмотрите страну ниже.",
  zh: "这是网站看到的您的公网地址。可复制，或查看下方的国家/地区。",
  es: "Esta es la dirección pública que ven los sitios con su conexión. Cópiela o consulte el país abajo.",
  hi: "यह वह सार्वजनिक पता है जो साइटें आपके कनेक्शन से देखती हैं। कॉपी करें या नीचे देश देखें।",
  ar: "هذا هو العنوان العام الذي تراه المواقع من اتصالك. انسخه أو اطّلع على البلد أدناه.",
  bn: "এটি সেই পাবলিক ঠিকানা যা সাইটগুলো আপনার সংযোগ থেকে দেখে। কপি করুন বা নিচে দেশ দেখুন।",
  pt: "Este é o endereço público que os sites veem na sua ligação. Copie-o ou veja o país abaixo.",
  fr: "Voici l'adresse publique que les sites voient pour votre connexion. Copiez-la ou consultez le pays ci-dessous.",
  de: "Das ist die öffentliche Adresse, die Websites bei Ihrer Verbindung sehen. Kopieren Sie sie oder prüfen Sie das Land unten.",
  ja: "サイト側から見えるグローバルアドレスです。コピーするか、下の国を確認してください。",
  id: "Ini alamat publik yang dilihat situs dari koneksi Anda. Salin atau cek negara di bawah.",
  pa: "ਇਹ ਉਹ ਪਬਲਿਕ ਪਤਾ ਹੈ ਜੋ ਸਾਈਟਾਂ ਤੁਹਾਡੇ ਕਨੈਕਸ਼ਨ ਤੋਂ ਵੇਖਦੀਆਂ ਹਨ। ਕਾਪੀ ਕਰੋ ਜਾਂ ਹੇਠਾਂ ਦੇਸ਼ ਵੇਖੋ।",
  jv: "Iki alamat publik sing dideleng situs saka sambungan sampeyan. Salin utawa deleng negara ing ngisor.",
  te: "మీ కనెక్షన్ నుండి సైట్లు చూసే పబ్లిక్ చిరునామా ఇది. కాపీ చేయండి లేదా కింద దేశం చూడండి.",
  tr: "Bağlantınızın sitelere gösterdiği genel adrestir. Kopyalayın veya aşağıdaki ülkeye bakın.",
  ko: "웹사이트가 보는 공인 주소입니다. 복사하거나 아래 국가를 확인하세요.",
  mr: "ही ती सार्वजनिक पत्ता आहे जी साइट्स तुमच्या कनेक्शनवरून पाहतात. कॉपी करा किंवा खाली देश पहा.",
  vi: "Đây là địa chỉ công cộng mà các trang web thấy từ kết nối của bạn. Sao chép hoặc xem quốc gia bên dưới.",
  ta: "இணைப்பிலிருந்து தளங்கள் காணும் பொது முகவரி இது. நகலெடுக்கவும் அல்லது கீழே நாட்டைப் பார்க்கவும்.",
  it: "Questo è l'indirizzo pubblico che i siti vedono dalla tua connessione. Copialo o controlla il paese sotto.",
  fa: "این آدرس عمومی است که سایت‌ها از اتصال شما می‌بینند. کپی کنید یا کشور را پایین ببینید.",
  tlh: "IP Hol 'oH. yIqaw' pagh Sep yIlegh.",
});

export function getSeoCopy(locale: Locale): SeoCopy {
  return {
    title: titles[locale],
    description: descriptions[locale],
    heading: headings[locale],
    leadHtml: leads[locale],
  };
}

export function buildAppJsonLd(locale: Locale): Record<string, unknown> {
  const copy = getSeoCopy(locale);
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: copy.heading,
    description: copy.description,
    url: localeUrl(locale),
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Any",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  };
}
