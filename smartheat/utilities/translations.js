const translations = {
    french: {        
        'Login': 'Connexion',
        'Sign up': 'Créer un compte',
        'Access the database': 'Accéder aux données',
        'Learn More': 'En savoir plus',
        'Direct access to the planning App': 'Accéder à l application',
        'Welcome to': 'Bienvenue sur',
        'Gallery': 'Gallerie',
        'Hello': 'Bonjour',
        'My data': 'Mes données',
        'Collections': 'Collections',
        'Groups': 'Groupes',
        'Medical data': 'Données médicales',
        'Browse shared project collections.': 'Parcourir les collections partagées du projet.',
        'Access your files and datasets.': 'Accéder à vos fichiers et jeux de données.',
        'Collaborate with research teams.': 'Collaborer avec les équipes de recherche.',
        'Launch interactive visualization tools.': 'Lancer les outils de visualisation interactive.',
        'Project overview': 'Présentation du projet',
        'Key competencies': 'Compétences clés',
        'Consortium & partners': 'Consortium & partenaires',
        'Research workpackages': 'Axes de travail',
        'About the platform': 'À propos de la plateforme',
        'SMART-HEAT is a multidisciplinary project involving teams in Munich and Bordeaux with complementary expertise in interventional radiology, MRI thermometry, and inverse thermal modeling.': 'SMART-HEAT est un projet multidisciplinaire impliquant des équipes à Munich et à Bordeaux, avec des expertises complémentaires en radiologie interventionnelle, thermométrie par IRM et modélisation thermique inverse.',
        'The world’s most advanced, AI-enabled DIGITAL TWIN OF THERMAL ABLATION for image-guided liver ablations.': 'Le JUMEAU NUMÉRIQUE D ABLATION THERMIQUE le plus avancé au monde, propulsé par l IA, pour les ablations hépatiques guidées par imagerie.'
    },
    german: {
        'Login': 'Anmelden',
        'Sign up': 'Konto erstellen',
        'Access the platform': 'Zur Plattform',
        'Learn More': 'Mehr erfahren',
        'Welcome to': 'Willkommen bei',
        'Hello': 'Hallo',
        'My data': 'Meine Daten',
        'Collections': 'Sammlungen',
        'Groups': 'Gruppen',
        'Medical data': 'Medizinische Daten',
        'Browse shared project collections.': 'Freigegebene Projektsammlungen durchsuchen.',
        'Access your files and datasets.': 'Auf Ihre Dateien und Datensätze zugreifen.',
        'Collaborate with research teams.': 'Mit Forschungsteams zusammenarbeiten.',
        'Launch interactive visualization tools.': 'Interaktive Visualisierungswerkzeuge starten.',
        'Project overview': 'Projektübersicht',
        'Key competencies': 'Kernkompetenzen',
        'Consortium & partners': 'Konsortium & Partner',
        'Research workpackages': 'Arbeitspakete',
        'About the platform': 'Über die Plattform',
        'SMART-HEAT is a multidisciplinary project involving teams in Munich and Bordeaux with complementary expertise in interventional radiology, MRI thermometry, and inverse thermal modeling.': 'SMART-HEAT ist ein interdisziplinäres Projekt mit Teams in München und Bordeaux, die über sich ergänzende Expertise in interventioneller Radiologie, MRT-Thermometrie und inverser thermischer Modellierung verfügen.',
        'The world’s most advanced, AI-enabled DIGITAL TWIN OF THERMAL ABLATION for image-guided liver ablations.': 'Der weltweit fortschrittlichste, KI-gestützte DIGITALE ZWILLING DER THERMOABLATION für bildgesteuerte Leberablationen.'
    }
};

let currentLanguage = window.localStorage.getItem('girderLanguage') || 'french';

export function translate(key) {
    if (currentLanguage !== 'english' && translations[currentLanguage] && translations[currentLanguage][key]) {
        return translations[currentLanguage][key];
    }
    return key;
}

export function setLanguage(language) {
    if (language === 'english' || language === 'french' || language === 'german') {
        currentLanguage = language;
        window.localStorage.setItem('girderLanguage', language);
        window.dispatchEvent(new Event('languageChanged'));
    }
}

export function getCurrentLanguage() {
    return currentLanguage;
}

export function getTranslations() {
    if (currentLanguage !== 'english' && translations[currentLanguage]) {
        return translations[currentLanguage];
    }
    return {};
}

export function setTranslation(key, value, language = currentLanguage) {
    if (!translations[language]) {
        translations[language] = {};
    }
    translations[language][key] = value;
}

export default { translate, setLanguage, getCurrentLanguage, getTranslations, setTranslation };
