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
    "title": "SMART-HEAT",
    "subtitle": "Spatial Mapping and Analysis of Real-time MRI Thermometry for Highly Efficient liver tumor Ablation using inverse Thermal modelling",
    "short": "Combining experimental MR-based temperature mapping and an inverse modeling approach for visualizing the thermal response.",
    "icon": "🔥",
    "logo": "/project-logos/smart_it.png",
    "themeClass": "g-smartit-theme",
    "anr": "ANR-24-CE92-0073",
    "anrLink": "https://anr.fr/Projet-ANR-24-CE92-0073",
    "grant": "Projet-ANR-24-CE92-0073",
    "duration": "2025-2027",
    "coordinator": "Jean-Luc Battaglia / Max Seidensticker",
    "about": "SMART-HEAT is a multidisciplinary project involving teams in Munich and Bordeaux with complementary expertise in interventional radiology, MRI thermometry, and inverse thermal modeling.",
    "mission": "SMART-HEAT aims at providing an objective therapeutic end-point based on quantitative, rapid, and spatially resolved thermal imaging.",
    "partners": [        
        {
            "name": "Université de Munich",
            "role": "",
            "logo": "/project-logos/lmu.png"
        },
        {
            "name": "Université de Bordeaux",
            "role": "",
            "logo": "/project-logos/universite_bordeaux.png"
        },
        {
            "name": "CRMSB",
            "role": "Centre de Résonance Magnétique des Systèmes Biologiques",
            "logo": "/project-logos/crmsb.png"
        },
        {
            "name": "I2M",
            "role": "Institut de mécanique et d'ingénierie",
            "logo": "/project-logos/I2M.jpg"
        },
        {
            "name": "CNRS",
            "role": "Centre national de la recherche scientifique",
            "logo": "/project-logos/cnrs.png"
        },
        {
            "name": "ANR / France 2030",
            "role": "Agence nationale de la recherche",
            "logo": "/project-logos/france2030.jpg"
        },
        {
            "name": "DFG",
            "role": "Deutsche Forschungsgemeinschaft",
            "logo": "/project-logos/DFG.png"
        }

    ],
    "competencies": [  
        {
            "icon": "🏥",
            "title": "Therapy and thermoablation procedure ",
            "text": "   "
        }, 
        {
            "icon": "🧲",
            "title": "MRI workflow ",
            "text": "  "
        },
             
        {
            "icon": "🗂️",
            "title": "Data organization",
            "text": "Manage files, collections and project workspaces."
        },
        {
            "icon": "🤖",
            "title": "Personalized data integration ",
            "text": "Prepare data and workflows using advanced processing tools."
        },
        {
            "icon": "💻",
            "title": "Numerical thermal simulation",
            "text": "One base system adapted to multiple research projects."
        },
        {
            "icon": "🛠️",
            "title": "Tools",
            "text": "Connect viewers, processing services and analysis interfaces."
        },
        {
            "icon": "🔐",
            "title": "Security",
            "text": "Support authenticated access and controlled collaboration."
        },
        {
            "icon": "📊",
            "title": "Dashboards",
            "text": "Provide project-level views of data and activities."
        }
    ],
    "work": [
        {
            "title": "Frontend templating",
            "text": "Select a project interface with PROJECT_TEMPLATE."
        },
        {
            "title": "Visualization integration",
            "text": "Prepare entry points for Trame, ParaView and analysis tools."
        },
        {
            "title": "Shared foundation",
            "text": "Keep one Girder base with project-specific UI layers."
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
                            <span class="g-hero-kicker">${PROJECT.icon} ${PROJECT.anr}</span>
                            <h1>${PROJECT.title}</h1>
                            <p>${PROJECT.subtitle}</p>
                            <div class="g-hero-buttons">
                                <button class="g-hero-button g-access-platform-btn">${translate('Access the platform')}</button>
                                <a class="g-hero-button g-hero-button-alt" href="${PROJECT.anrLink}" target="_blank" rel="noreferrer">${translate('Learn More')}</a>
                            </div>
                        </div>

                        <aside class="g-hero-card">
                            <img class="g-hero-project-logo" src="${PROJECT.logo}" alt="${PROJECT.title} logo" />
                            <div class="g-meta-line">🏷️ <span>${PROJECT.anr}</span></div>
                            <div class="g-meta-line">👤 <span>${PROJECT.coordinator}</span></div>
                            <div class="g-meta-line">📅 <span>${PROJECT.duration}</span></div>
                            <div class="g-meta-line">💶 <span>${PROJECT.grant}</span></div>
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
                                <div class="g-carousel-slide"><img src="/project-images/image1.png" alt="image 1" /></div>
                                <div class="g-carousel-slide"><img src="/project-images/image2.png" alt="image 2" /></div>
                                <div class="g-carousel-slide"><img src="/project-images/image3.png" alt="image 3" /></div>
                            </div>
                        </div>
                        <button class="g-carousel-btn g-carousel-next">&#8250;</button>
                        <div class="g-carousel-dots">
                            <span class="g-carousel-dot g-dot-active" data-idx="0"></span>
                            <span class="g-carousel-dot" data-idx="1"></span>
                            <span class="g-carousel-dot" data-idx="2"></span>
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
                            <div class="g-info-pill"><strong>Objective 1</strong><span>Improve the planning of thermal ablation therapy and the optimization and personalization of device settings by providing personalized modeling of the temperature field prior to ablation.</span></div>
                            <div class="g-info-pill"><strong>Objective 2</strong><span>Improve the safety of online monitoring and the prediction of the lesion size through improved real-time sub-voxel visualization of the treatment response.</span></div>
                        </div>
                    </section>

                    <section class="g-dashboard-section">
                        <h2>Contacts</h2>
                        <div class="g-contact-alert">
                            For any questions about the ${PROJECT.title} platform, please contact the project team.
                        </div>

                        <div class="g-contact-grid">
                            <div class="g-contact-card">
                                <strong>Valéry Ozenne</strong>
                                <span>Project Coordinator</span>
                                <a href="mailto:valery.ozenne@u-bordeaux.fr">valery.ozenne@u-bordeaux.fr</a>
                            </div>

                            <div class="g-contact-card">
                                <strong>Support Team</strong>
                                <span>Technical Support</span>
                                <a href="mailto:support@u-bordeaux.fr">support@u-bordeaux.fr</a>
                            </div>

                            <div class="g-contact-card">
                                <strong>Support Team</strong>
                                <span>Technical Support</span>
                                <a href="mailto:support@u-bordeaux.fr">support@u-bordeaux.fr</a>
                            </div>

                            <div class="g-contact-card">
                                <strong>Support Team</strong>
                                <span>Technical Support</span>
                                <a href="mailto:support@u-bordeaux.fr">support@u-bordeaux.fr</a>
                            </div>
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
                        <p class="g-section-lead">Girder is a free and open source web-based data management platform, developed by Kitware. We would like to thanks all co-workers from IHU-Liryc and CRMSB that help us to improve the design and tools including: Julien Castelneau, Andony Arriela, Vigneshwar Gurunathan, Eya Ben Amor and the Kitware team in Lyon.</p>
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
                            <h3>${translate('Groups')}</h3>
                            <p>${translate('Collaborate with research teams.')}</p>
                        </a>

                        <a class="g-dashboard-card" href="/trame" target="_blank">
                            <span>🛠️</span>
                            <h3>Tools</h3>
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
    const total = 3;
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
