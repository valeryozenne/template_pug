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
    "subtitle": "The world’s most advanced, AI-enabled DIGITAL TWIN OF THERMAL ABLATION for image-guided liver ablations.",
    "short": "Spatial Mapping and Analysis of Real-time MRI Thermometry for Highly Efficient liver tumor Ablation using inverse Thermal modelling. Combining experimental MR-based temperature mapping and an inverse modeling approach for visualizing the thermal response.",
    "icon": "🔥",
    "logo": "/project-logos/smartheat.png",
    "themeClass": "g-smartheat-theme",
    "anr": "ANR-24-CE92-0073",
    "anrLink": "https://anr.fr/Projet-ANR-24-CE92-0073",
    "appLink": "https://incredible-App-For-Thermoablation-Planning",
    "grant": "Projet-ANR-24-CE92-0073",
    "duration": "January 2024 - 36 months",
    "coordinator": "Max Seidensticker - Jean-Luc Battaglia",
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
            "name": "ANR",
            "role": "Agence Nationale de la Recherche",
            "logo": "/project-logos/anr.jpg"
        },
        {
            "name": "DFG",
            "role": "Deutsche Forschungsgemeinschaft",
            "logo": "/project-logos/DFG.png"
        },
        {
            "name": "France 2023",
            "role": "",
            "logo": "/project-logos/Logo_France_2030.png"
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
            "icon": "🎯",
            "title": "Personalised data integration",
            "text": "Unprecedented anatomical details of tissue and structural characteristics from numerical rendered 3D liver models built with dedicated segmentation algorithm that analyzes CT and MR images."
        },
        {
            "icon": "💻 + 🌡️",
            "title": "Numerical thermal simulation",
            "text": "An in-depth understanding of thermal properties for unrivalled precisionOne base system adapted to multiple research projects."
        },             
        {
            "icon": "🗂️",
            "title": "Data organization",
            "text": "Manage files, collections and project workspaces."
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
            "title": "",
            "text": ""
        },
        {
            "title": "Pre-planning thermal modeling",
            "text": "Get ready for your next ablation."
        },
        {
            "title": "Real-time thermal modeling for surgical procedure ",
            "text": "An augmented visualisation of your procedure."
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
                            <!-- <span class="g-hero-kicker">${PROJECT.icon} ${PROJECT.anr} </span> -->
                            <h1>${PROJECT.title}</h1>
                            <p>${PROJECT.subtitle}</p>
                            <div class="g-hero-buttons">
                                <a class="g-hero-button g-hero-button-alt" href="${PROJECT.anrLink}" target="_blank" rel="noreferrer">${translate('Learn More')}</a>
                                <button class="g-hero-button g-access-platform-btn">${translate('Access the database ')}</button>
                                <a class="g-hero-button g-hero-button-alt" href="${PROJECT.appLink}" target="_blank" rel="noreferrer">${translate('Direct access to the planning App ')}</a>
                            </div>
                        </div>

                        <aside class="g-hero-card">
                            <img class="g-hero-project-logo" src="${PROJECT.logo}" alt="${PROJECT.title} logo" />
                            <div class="g-meta-line">🤝 <span>${PROJECT.coordinator}</span></div>
                            <div class="g-meta-line">📅 <span>${PROJECT.duration}</span></div>
                            <div class="g-meta-line">💶 <span>${PROJECT.anr }</span></div>
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
                            <div class="g-info-pill"><strong>Objective 1</strong><span>Improve the planning of thermal ablation therapy and the optimization and personalization of device settings by providing personalized modeling of the temperature field prior to ablation.</span></div>
                            <div class="g-info-pill"><strong>Objective 2</strong><span>Improve the safety of online monitoring and the prediction of the lesion size through improved real-time sub-voxel visualization of the treatment response.</span></div>
                        </div>
                    </section>


                    <!-- NOUVELLE SECTION AVEC PHOTOS -->
                    <section class="g-dashboard-section">
                    <h2>Contacts</h2>
                    <div class="g-contact-alert">For any questions about the ${PROJECT.title} platform, please contact the project team. </div>
                    <div class="g-contact-grid-v2">
                        ${[
                        { name: "Max Seidensticker", role: "Project Coordinator in Munich", email: "@med.uni-muenchen.de", photo: "max-seidensticker.png" },
                        { name: "Jean-Luc Battaglia", role: "Project Coordinator in Bordeaux at I2M", email: "@u-bordeaux.fr", photo: "default.png" },
                        { name: "Olaf Dietrich", role: "Partner in Munich", email: "@med.uni-muenchen.de", photo: "default.png" },
                        { name: "Valéry Ozenne", role: "Partner in Bordeaux at CRMSB", email: "@u-bordeaux.fr", photo: "default.png" },
                         
                        
                        { name: "Luigi Nardone", role: " in Munich", email: "@med.uni-muenchen.de", photo: "default.png" },
                        { name: "Vanessa Schmidt", role: " in Munich", email: "@med.uni-muenchen.de", photo: "default.png" },
                        { name: "Matthias Philipp Fabritius", role: " in Munich", email: "@med.uni-muenchen.de", photo: "default.png" },
                        { name: "Mingming Wu", role: " in Munich", email: "@med.uni-muenchen.de", photo: "default.png" },
                        { name: "Laura Bauer", role: "PhD in Munich", email: "@med.uni-muenchen.de", photo: "default.png" },
                        
                       
                        
                        

                        { name: "Manon Desclides", role: "Post-Doc in Bordeaux", email: "@u-bordeaux.fr", photo: "default.png" },
                        { name: "Nino Avetikovi", role: "PhD in Bordeaux", email: "@u-bordeaux.fr", photo: "default.png" },
                        { name: "Ida Burgers", role: "PhD in Bordeaux", email: "@u-bordeaux.fr", photo: "default.png" },
                        { name: "Mariana De Melo Antunes", role: "PhD in Bordeaux", email: "@u-bordeaux.fr", photo: "default.png" },
                       
                        { name: "Eya Ben Amor", role: "Intern in Bordeaux", email: "@u-bordeaux.fr", photo: "default.png" },
                        { name: "Hippolyte Salles", role: "Intern in Bordeaux", email: "@u-bordeaux.fr", photo: "default.png" },
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
                    
                    <!--
                    <section class="g-dashboard-section">
                        <h2>Contacts</h2>
                        <div class="g-contact-alert">
                            For any questions about the ${PROJECT.title} platform, please contact the project team.
                        </div>

                        <div class="g-contact-grid">
                            
                           <div class="g-contact-card">
                                <strong>Mariana Burgers</strong>
                                <span></span>
                                <a href=PhD Student>PhD Student</a>
                            </div>
                        </div>
                    </section>
                   -->   

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
                        <p class="g-section-lead">We would like to thanks all co-workers from IHU-Liryc and CRMSB that help us to make the online service available: Maxime Sermesant, Julien Castelneau, Andony Arriela and Vigneshwar Gurunathan as well as the Kitware team in Lyon. The current version has been developed by Eya Ben Amor, Henri Valeins and Valéry Ozenne and is based on Girder, a free and open source web-based data management platform, developed by Kitware.</p>
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

                        <a class="g-dashboard-card" href="/viewer/girdermedviewer.html" target="_blank">
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
