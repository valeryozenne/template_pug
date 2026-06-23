import $ from 'jquery';

import View from '@girder/core/views/View';
import events from '@girder/core/events';
import { cancelRestRequests } from '@girder/core/rest';
import { getCurrentUser } from '@girder/core/auth';
import {
    translate,
    setLanguage,
    getCurrentLanguage
} from '@girder/core/utilities/translations';

import '@girder/core/stylesheets/body/frontPage.styl';

const PROJECT = {
    "title": "Thermolyse",
    "subtitle": "In vivo mitochondrial thermoregulation by thermal MRI",
    "short": "MRI thermal mapping platform for thermoregulation and heat-stress resilience.",
    "icon": "🌡️",
    "logo": "/project-logos/thermolyse.png",
    "themeClass": "g-thermolyse-theme",
    "anr": "ANR-25-CE19-6299",
    "anrLink": "https://anr.fr/Projet-ANR-25-CE19-6299",
    "grant": "ANR funding: 346,577 €",
    "duration": "January 2026 · 24 months",
    "coordinator": "Valéry Ozenne · CRMSB",
    "about": "THERMOLYSE develops MRI thermal mapping methods to measure weak, slow and diffuse brain temperature changes during long heat-stress periods. The platform supports experimental MRI data organization, thermal map processing, reproducibility workflows and collaborative review.",
    "mission": "Create a collaborative workspace for MRI experiments, thermal mapping, metrology, processing results and visualization workflows.",
    "partners": [
                {
            "name": "Université d’Angers",
            "role": "",
            "logo": "/project-logos/universite_angers.png"
        },
        {
            "name": "Université de Bordeaux",
            "role": "",
            "logo": "/project-logos/universite_bordeaux.png"
        },
        {
            "name": "Prism",
            "role": "Centre de Résonance Magnétique des Systèmes Biologiques",
            "logo": "/project-logos/logo_prism.png"
        },
        {
            "name": "MitoVasc",
            "role": "Centre de Résonance Magnétique des Systèmes Biologiques",
            "logo": "/project-logos/Mitovasc.jpg"
        },
        {
            "name": "CRMSB",
            "role": "Centre de Résonance Magnétique des Systèmes Biologiques",
            "logo": "/project-logos/crmsb.png"
        },
        {
            "name": "CNRS",
            "role": "Centre national de la recherche scientifique",
            "logo": "/project-logos/cnrs.png"
        },
        {
            "name": "ANR",
            "role": "Agence Nationale de la Recherche",
            "logo": "/project-logos/anr.jpg"
        },
        {
            "name": "France 2023",
            "role": "",
            "logo": "/project-logos/Logo_France_2030.png"
        }
    ],
    "competencies": [
        {
            "icon": "🌡️",
            "title": "Thermal MRI",
            "text": "Non-invasive temperature mapping and thermal challenge monitoring."
        },
        {
            "icon": "🧠",
            "title": "Brain thermoregulation",
            "text": "Longitudinal analysis of cerebral temperature responses."
        },
        {
            "icon": "🧪",
            "title": "Metrology",
            "text": "Calibration, reproducibility and experimental control."
        },
        {
            "icon": "🗂️",
            "title": "Data repository",
            "text": "Secure organization of MRI datasets and results."
        },
        {
            "icon": "📊",
            "title": "Visualization",
            "text": "Interactive exploration of thermal maps and measurements."
        },
        {
            "icon": "🤝",
            "title": "Collaboration",
            "text": "Shared workspace for project partners and research teams."
        }
    ],
    "work": [
        {
            "title": "MRI thermal mapping",
            "text": "Develop contactless MRI methods to quantify small and diffuse temperature variations."
        },
        {
            "title": "Heat-stress experiments",
            "text": "Structure controlled environmental challenges and reproducibility workflows."
        },
        {
            "title": "Platform integration",
            "text": "Connect datasets, processing outputs and visualization tools in Girder."
        }
    ]
};

function languageLabel() {
    return getCurrentLanguage() === 'french' ? 'EN' : getCurrentLanguage() === 'english' ? 'DE' : 'FR';
}

function partnerCards() {
    return PROJECT.partners.map((partner) => `
        <div class="g-partner-card">
            <div class="g-partner-logo-wrap">
                <img class="g-partner-logo" src="${partner.logo}" alt="${partner.name} logo" />
            </div>
            <strong>${partner.name}</strong>
            <span>${partner.role}</span>
        </div>
    `).join('');
}

function competencyCards() {
    return PROJECT.competencies.map((item) => `
        <div class="g-feature-card">
            <div class="g-feature-emoji">${item.icon}</div>
            <h3>${item.title}</h3>
            <p>${item.text}</p>
        </div>
    `).join('');
}

function workCards() {
    return PROJECT.work.map((item) => `
        <div class="g-work-card">
            <h3>${item.title}</h3>
            <p>${item.text}</p>
        </div>
    `).join('');
}

const FrontPageView = View.extend({
    events: {
        'click .g-login-link': function () {
            events.trigger('g:loginUi');
        },
        'click .g-register-link': function () {
            events.trigger('g:registerUi');
        },
        'click .g-access-platform-btn': function () {
            events.trigger('g:loginUi');
        },
        'click .g-language-switcher': function (event) {
            event.preventDefault();

            const currentLanguage = getCurrentLanguage();
            let nextLanguage = 'french';

            if (currentLanguage === 'french') {
                nextLanguage = 'english';
            } else if (currentLanguage === 'english') {
                nextLanguage = 'german';
            }

            setLanguage(nextLanguage);
            this.render();
        },
        // --- CAROUSEL ---
        'click .g-carousel-prev': function () {
            this._carouselGoTo(this._carouselIdx - 1);
        },
        'click .g-carousel-next': function () {
            this._carouselGoTo(this._carouselIdx + 1);
        },
        'click .g-carousel-dot': function (e) {
            this._carouselGoTo(parseInt($(e.currentTarget).data('idx')));
        }
    },

    initialize: function () {
        cancelRestRequests('fetch');
        this._carouselIdx = 0;
        $('body').addClass('g-landing-page-active');
        this.render();
    },

    render: function () {
        const currentUser = getCurrentUser();

        if (currentUser) {
            $('body').removeClass('g-landing-page-active');
            return this.renderDashboard(currentUser);
        }

        this.$el.html(`
            <div class="g-project-shell ${PROJECT.themeClass}">
                <div class="g-project-container">
                    <header class="g-topbar">
                        <div class="g-brand">
                            <img class="g-brand-logo" src="${PROJECT.logo}" alt="${PROJECT.title} logo" />
                            <div>
                                <h1 class="g-brand-title">${PROJECT.title}</h1>
                                <p class="g-brand-subtitle">${PROJECT.short}</p>
                            </div>
                        </div>

                        <div class="g-actions">
                            <button class="g-btn g-language-switcher">${languageLabel()}</button>
                            <button class="g-btn g-login-link">${translate('Login')}</button>
                            <button class="g-btn g-btn-secondary g-register-link">${translate('Sign up')}</button>
                        </div>
                    </header>

                    <section class="g-hero">
                        <div>
                             <!-- <span class="g-hero-kicker">${PROJECT.icon} ${PROJECT.anr}</span> -->
                            <h1>${PROJECT.title}</h1>
                            <p>${PROJECT.subtitle}</p>
                            <div class="g-hero-buttons">
                                <a class="g-hero-button g-hero-button-alt" href="${PROJECT.anrLink}" target="_blank" rel="noreferrer">${translate('Learn More')}</a>
                                <button class="g-hero-button g-access-platform-btn">${translate('Direct access to the platform')}</button>
                            </div>
                        </div>

                        <aside class="g-hero-card">
                            <img class="g-hero-project-logo" src="${PROJECT.logo}" alt="${PROJECT.title} logo" />
                            <!-- <div class="g-meta-line">🏷️ <span>${PROJECT.anr}</span></div> -->
                            <div class="g-meta-line">👤 <span>${PROJECT.coordinator}</span></div>
                            <div class="g-meta-line">📅 <span>${PROJECT.duration}</span></div>
                            <div class="g-meta-line">💶 <span>${PROJECT.anr}</span></div>
                        </aside>
                    </section>

                    <section class="g-section g-section-carousel">
                    <div class="g-section-header">
                        <div class="g-section-icon">🖼️</div>
                        <h2>${translate('Gallery')}</h2>
                    </div>
                    <div class="g-carousel">
                        <button class="g-carousel-btn g-carousel-prev">&#8249;</button>
                        <div class="g-carousel-track-wrap">
                            <div class="g-carousel-track">
                                <div class="g-carousel-slide"><img src="/project-images/image0.png" alt="image 0" /></div>
                                <div class="g-carousel-slide"><img src="/project-images/image1.png" alt="image 1" /></div>
                                <div class="g-carousel-slide"><img src="/project-images/image2.png" alt="image 2" /></div>
                                <div class="g-carousel-slide"><img src="/project-images/image3.png" alt="image 3" /></div>
                                <div class="g-carousel-slide"><img src="/project-images/image4.png" alt="image 4" /></div>
                                <div class="g-carousel-slide"><img src="/project-images/image5.png" alt="image 5" /></div>
                                <div class="g-carousel-slide"><img src="/project-images/image6.png" alt="image 6" /></div>
                            </div>
                        </div>
                        <button class="g-carousel-btn g-carousel-next">&#8250;</button>
                        <div class="g-carousel-dots">
                            <span class="g-carousel-dot g-dot-active" data-idx="0"></span>
                            <span class="g-carousel-dot" data-idx="1"></span>
                            <span class="g-carousel-dot" data-idx="2"></span>
                            <span class="g-carousel-dot" data-idx="3"></span>
                            <span class="g-carousel-dot" data-idx="4"></span>
                            <span class="g-carousel-dot" data-idx="5"></span>
                            <span class="g-carousel-dot" data-idx="6"></span>
                        </div>
                    </div>
                    </section>

                    
                    <section class="g-section">
                        <div class="g-section-header">
                            <div class="g-section-icon">📌</div>
                            <h2>${translate('Project overview')}</h2>
                        </div>
                        <p class="g-section-lead">${PROJECT.about}</p>
                        <div class="g-info-grid">
                            <div class="g-info-pill"><strong>Mission</strong><span>${PROJECT.mission}</span></div>
                            <div class="g-info-pill"><strong>Platform</strong><span>Girder-based repository for project datasets, collaborative work and visualization tools.</span></div>
                            <div class="g-info-pill"><strong>Access</strong><span>Authentication, groups and collections are kept from the official Girder workflow.</span></div>
                        </div>
                    </section>

                     <!-- NOUVELLE SECTION AVEC PHOTOS -->
                    <section class="g-dashboard-section">
                    <h2>Contacts</h2>
                    <div class="g-contact-alert">For any questions about the ${PROJECT.title} platform, please contact the project team. </div>
                    <div class="g-contact-grid-v2">
                        ${[
                        { name: "Florence Franconi", role: "Project partner in Angers at Prism", email: "@", photo: "default.png" },
                        { name: "Cesar Mattei", role: "Project partner in Angers at MitoVasc", email: "@", photo: "default.png" },
                        { name: "Valéry Ozenne", role: "Project coordinator in Bordeaux at CRMSB", email: "@u-bordeaux.fr", photo: "default.png" },
                        { name: "Guy Lenaers", role: "Researcher in Angers at MitoVasc", email: "@u-bordeaux.fr", photo: "default.png" },
                        { name: "Laurent Lemaire", role: "Researcher in Angers at MitoVasc", email: "@u-bordeaux.fr", photo: "default.png" },
                        { name: "Gwendal Durand-Chatton", role: "PhD in Angers at CRMSB", email: "@u-bordeaux.fr", photo: "default.png" },
                        { name: "Malory Couchaud", role: "Post-doc in Angers at CRMSB", email: "@u-bordeaux.fr", photo: "default.png" },
                        { name: "Jennifer Bourreau", role: "PhD in Angers at CRMSB", email: "@u-bordeaux.fr", photo: "default.png" },
                        { name: "Mélanie Lagadec", role: "Post-doc in Bordeaux at CRMSB", email: "@u-bordeaux.fr", photo: "default.png" },
                        { name: "Aurélien Trotier", role: "Engineer in Bordeaux at CRMSB", email: "@u-bordeaux.fr", photo: "default.png" },
                        { name: "Emeline Ribot", role: "Researcher in Bordeaux at CRMSB", email: "@u-bordeaux.fr", photo: "default.png" },
                        { name: "Eya Ben Amor", role: "Intern in Bordeaux", email: "@u-bordeaux.fr", photo: "default.png" },
                        

                        ].map(contact => `
                        <div class="g-contact-card-v2">
                            <div class="g-contact-photo-v2">
                            <img src="/project-photo/${contact.photo}" alt="${contact.name} photo" onerror="this.src='/project-photo/default.png';">
                            </div>
                            <strong>${contact.name}</strong>
                            ${contact.role ? `<span class="g-contact-role-v2">${contact.role}</span>` : ''}
                            <a href="mailto:${contact.email}" class="g-contact-email-v2">${contact.email}</a>
                        </div>
                        `).join('')}
                    </div>
                    </section>

                    <section class="g-section">
                        <div class="g-section-header">
                            <div class="g-section-icon">🧩</div>
                            <h2>${translate('Key competencies')}</h2>
                        </div>
                        <div class="g-card-grid">${competencyCards()}</div>
                    </section>

                    <section class="g-section">
                        <div class="g-section-header">
                            <div class="g-section-icon">🤝</div>
                            <h2>${translate('Consortium & partners')}</h2>
                        </div>
                        <div class="g-partners">${partnerCards()}</div>
                    </section>

                    <section class="g-section">
                        <div class="g-section-header">
                            <div class="g-section-icon">🧪</div>
                            <h2>${translate('Research workpackages')}</h2>
                        </div>
                        <div class="g-work-grid">${workCards()}</div>
                    </section>

                    <section class="g-section">
                        <div class="g-section-header">
                            <div class="g-section-icon">🏢</div>
                            <h2>${translate('About the platform')}</h2>
                        </div>
                        <p class="g-section-lead">We would like to thanks all co-workers from IHU-Liryc and CRMSB that help us to make the online service available: Maxime Sermesant, Julien Castelneau, Andony Arriela,  Vigneshwar Gurunathan as well as the Kitware team in Lyon. The current version has been developed by Eya Ben Amor, Henri Valeins and Valéry Ozenne and is based on Girder, a free and open source web-based data management platform, developed by Kitware.</p>
                    </section>
                </div>
            </div>
        `);

        return this;
    },

    renderDashboard: function (currentUser) {
        this.$el.html(`
            <div class="g-dashboard-shell ${PROJECT.themeClass}">
                <div class="g-project-container">
                    <section class="g-dashboard-hero">
                        <div class="g-dashboard-topbar">
                            <div class="g-dashboard-brand">
                                <img src="${PROJECT.logo}" alt="${PROJECT.title} logo" />
                                <span>${PROJECT.title}</span>
                            </div>
                            <button class="g-btn g-language-switcher">${languageLabel()}</button>
                        </div>

                        <h1>${translate('Welcome to')} ${PROJECT.title}</h1>
                        <p>${translate('Hello')}, <strong>${currentUser.get('firstName') || currentUser.get('login')}</strong>. ${PROJECT.mission}</p>
                    </section>

                    <section class="g-dashboard-grid">
                        <a class="g-dashboard-card" href="#user/${currentUser.id}">
                            <span>📁</span>
                            <h3>${translate('My data')}</h3>
                            <p>${translate('Access your files and datasets.')}</p>
                        </a>

                        <a class="g-dashboard-card" href="#collections">
                            <span>🗂️</span>
                            <h3>${translate('Collections')}</h3>
                            <p>${translate('Browse shared project collections.')}</p>
                        </a>

                        <a class="g-dashboard-card" href="#groups">
                            <span>👥</span>
                            <h3>${translate('Collaborations')}</h3>
                            <p>${translate('Collaborate with research teams.')}</p>
                        </a>

                        <a class="g-dashboard-card" href="/trame" target="_blank">
                            <span>🛠️</span>
                            <h3>Account settings</h3>
                            <p>${translate('Launch interactive visualization tools.')}</p>
                        </a>
                    </section>
                   

                    <section class="g-dashboard-section">
                        <h2>Quick Stats</h2>
                        <div class="g-stats-grid">
                            <div class="g-stat-card"><strong>--</strong><span>Files Uploaded</span></div>
                            <div class="g-stat-card"><strong>--</strong><span>Collections</span></div>
                            <div class="g-stat-card"><strong>--</strong><span>Groups Joined</span></div>
                        </div>
                    </section>

                    <section class="g-dashboard-section">
                        <h2>Quick Actions</h2>
                        <div class="g-quick-actions">
                            <a class="g-action-btn" href="#collections">📁 Browse Collections</a>
                            <a class="g-action-btn" href="#user/${currentUser.id}">👤 My Data Space</a>
                            <a class="g-action-btn" href="#groups">👥 Manage Groups</a>
                        </div>
                    </section>

                </div>
            </div>
        `);

        return this;
    },

    _carouselGoTo: function (idx) {
    const total = 7;
    this._carouselIdx = ((idx % total) + total) % total;
    this.$('.g-carousel-track').css('transform', `translateX(-${this._carouselIdx * 100}%)`);
    this.$('.g-carousel-dot').removeClass('g-dot-active');
    this.$('.g-carousel-dot[data-idx="' + this._carouselIdx + '"]').addClass('g-dot-active');
    },

    destroy: function () {
        $('body').removeClass('g-landing-page-active');
        View.prototype.destroy.call(this);
    }
});

export default FrontPageView;
