import fs from 'fs';
import path from 'path';
import nunjucks from 'nunjucks';
import fetch from 'node-fetch';
//const viewsPath = path.join(__dirname, 'views');
const viewsPath = './views';



// Configure Nunjucks environment
const env = new nunjucks.Environment(new nunjucks.FileSystemLoader(viewsPath), {
  autoescape: true
});
env.addFilter('tojson', function (obj) {
  return JSON.stringify(obj);
});
// Function to compile templates
const compileTemplate = (filename, dataToAdd) => {
  const templateContent = fs.readFileSync(path.join(viewsPath, filename), 'utf-8');

  // Create a Nunjucks Template object
  const template = new nunjucks.Template(templateContent, env);

  // Render the template with placeholders for dynamic data
  const renderedTemplate = template.render(dataToAdd);

  // Replace Nunjucks tags with JavaScript template literals for placeholders
  const dynamicTemplate = renderedTemplate
    .replace(/&quot;/g, '"')
    .replace(/{{\s*(\w+)\s*}}/g, '${data.$1}')
    .replace(/{%\s*block\s*(\w+)\s*%}/g, '${data.$1}') // Adjust block replacement if needed
    .replace(/{%\s*extends\s*"(\w+)"\s*%}/g, '') // Remove extends directive, not needed in client-side
    .replace(/{%\s*import\s*"(\w+)"\s*as\s*(\w+)\s*%}/g, ''); // Remove imports, handle macros separately

  // Return a function that takes `data` and renders the template
  return `function(data) {
    return \`${dynamicTemplate}\`;
  }`;
};
const templates = {
  header: compileTemplate('header.html', await loadHeaderContent()),
  home: compileTemplate('home.html', await renderHomePage()),
  studentHome: compileTemplate('studentHome.html', await renderStudentHomePage()),
  contact: compileTemplate('contact.html', {}),
  about: compileTemplate('about.html', {}),
  mission: compileTemplate('missions.html', await renderMissionPage()),
  council: compileTemplate('council.html', await rendercouncilPage()),
  manpowerRequest: compileTemplate('manpowerRequest.html', await renderManpowerRequest()),
  missionHospitalUser: compileTemplate('missionHospitalUsersPage.html', await renderMissionHospitalUser()),
  missionHospitalDetails: compileTemplate('missionHospitalDetails.html', await renderMissionHospitalDetails()),
  learningResources: compileTemplate('learningResources.html'),
  mentor: compileTemplate('mentor.html', await renderMentor()),
  mentee: compileTemplate('mentee.html', await renderMentee()),
  footer: compileTemplate('footer.html', { version: '${data}' }),
  modal: compileTemplate('modal.html', await renderModalPage()),
  popup: compileTemplate('popup.html'),
  detailedNews: compileTemplate('allNews.html'),
  detailedResources: compileTemplate('allLearningResources.html'),
  legalHelp: compileTemplate('legalHelp.html', await renderLegalHelp()),
  equipment: compileTemplate('equipments.html'),
  weeklyManna: compileTemplate('weeklyManna.html'),
  finance: compileTemplate('finance.html', await renderFinance()),
  libraryAccess: compileTemplate('libraryAccess.html'),
  research: compileTemplate('research.html'),
  academicConclave: compileTemplate('academic_conclave.html'),
  secondOpinionModule: compileTemplate('secondOpinionModule.html'),
  researchGrant: compileTemplate('Research/researchGrants.html'),
  grandRounds: compileTemplate('Research/grandRounds.html'),
  publications: compileTemplate('Research/publications.html'),
  mmService: compileTemplate('MMService/mmService.html'),
  shiloh: compileTemplate('shiloh.html'),
  preMmsVisits: compileTemplate('MMService/preMmsVisits.html'),
  grandRoundsVideos: compileTemplate('Research/grandRoundsVideo.html'),
  networkConslt: compileTemplate('NetworkConslt/networkConslt.html'),
  msnEngagement: compileTemplate('msnEngagement.html'),
  missionVisits: compileTemplate('missionVisits.html'),
  msnSabbatical: compileTemplate('msnSabbatical.html'),
  patientWorkspace: compileTemplate('NetworkConslt/patientWorkspace.html'),
  ncConsltPage: compileTemplate('NetworkConslt/ncConsltPage.html'),
  ncNodalPage: compileTemplate('NetworkConslt/ncNodalPage.html'),
  guestHome: compileTemplate('guestHome.html'),
  clinicalSnip: compileTemplate('clinicalSnip.html'),
  chat: compileTemplate('chat.html'),
  serviceCommitment: compileTemplate('serviceCommitment.html'),
  connectNewsletter: compileTemplate('connectNewsletter.html'),
  fovGrants: compileTemplate('FOV Grants/fovGrants.html'),
  fovAppDashboard: compileTemplate('FOV Grants/fovAppDashboard.html'),
  fovAdminDashboard: compileTemplate('FOV Grants/fovAdminDashboard.html'),
  grants: compileTemplate('grants.html'),
  samGrants: compileTemplate('SAM Grants/samGrants.html'),
  samAppDashboard: compileTemplate('SAM Grants/samAppDashboard.html'),
  samAdminDashboard: compileTemplate('SAM Grants/samAdminDashboard.html'),
  guidePage: compileTemplate('guidePage.html')
};

// Output the precompiled templates to a JavaScript file
const output = `
  window.precompiledTemplates = {
    ${Object.keys(templates).map(key => `${JSON.stringify(key)}: ${templates[key]}`).join(',\n')}
  };
  `;

const outputFilePath = './templates.js';
fs.writeFileSync(outputFilePath, output);
console.log('Precompiled templates have been saved.');

async function loadHeaderContent() {
  return new Promise(async (resolve, reject) => {
    try {
      const roles = ['Missions', 'Council Member'] || '${data.roles}';
      let headerContent = {
        title: '${data.title}',
        userImg: '${data.userImg}',
        name: '${data.name}' || '',
        email: '${data.email}' || '',
        loginType: '${data.loginType}' || '',
        missionBtn: '${data.missionBtn}',
        councilBtn: '${data.councilBtn}',
      }
      resolve(headerContent)
    } catch (err) {
      console.error('Error rendering header:', err);
      reject(err);
    }
  })
}
async function renderHomePage() {
  return new Promise(async (resolve, reject) => {
    try {
      const context = {

      }

      resolve(context);

    } catch (error) {
      console.error('Error rendering home.html:', error);
      reject(error);
    }
  })
}
async function renderStudentHomePage() {
  return new Promise(async (resolve, reject) => {
    try {
      // var now = Date.now();
      // var oneDay = 1000 * 60 * 60 * 24;
      // var today = new Date(now - (now % oneDay));
      // var tomorrow = new Date(today.valueOf() + oneDay);
      // today.setHours(0, 0, 0, 0);
      // tomorrow.setHours(0, 0, 0, 0);
      var homeCards = ['learningResources', 'doddLibrary', 'manpowerRequest', 'dls', 'missionHospitalVisits', 'trainingOrObservership', 'research', 'shiloh'];
      const collections = [
        { "collection": "CardBuilder", "query": { cardKeyName: { $in: homeCards } } }
      ];
      const results = await fetchCollectionData('fetchCollectionData', collections[0]);
      const context = {
        homeCards: [
          {
            type: 'singleData',
            cardName: 'Thought',
            icon: "./images/dove.svg",
            heading: "Thought of the day",
            cardWidth: '',
            row: '1',
            column: '1',
            data: { textData: '${data.thoughtOfDay || "“Whenever GOD determines to do a great work, HE first sets HIS people to pray.” - Charles Spurgeon" }' }
          },
          {
            type: 'grandRounds',
            icon: "../images/icons/grandRounds.png",
            row: 1,
            column: 1,
            heading: "Grand Rounds",
            cardName: "grandrounds",
            data: {
              grandRoundsCards: '${data.grandRounds}'
            }
          },
          {
            type: 'weeklyManna',
            icon: "./images/prayer-hands.png",
            cardName: "weeklyManna",
            heading: "Weekly Manna",
            row: '1',
            column: '3',
            data: {
              weeklyMannaCards: '${data.weeklyManna}',
            }

          },
          {
            type: 'ticker',
            cardName: 'NewsData',
            icon: "./images/file.svg",
            heading: "News",
            row: '1',
            column: '3',
            data: {
              query: "student",
              currPage: 'renderStudentHomePage()',
              rNews: '${data.renderedNews}'
            }
          },
          {
  type: 'cmcOrg',
  row: '2',
  column: '3',
  cardClass: 'border-0 pe-pointer p-0',
  data: await getLatestNewsletterCard(),
},
          {
            type: 'cmcOrg',
            row: '1',
            column: '2',
            data: {
              icon: './images/icons/india-icon1.png',
              councilMemberOrganizationName: 'Mission Hospitals',
              onclick: `navigateTo('contact',{postLogin: true,currPage: 'renderPostHomePage()', role: 'Missions'}, ['loadHospitalIdsAndMap',[]]);`,
            }
          },
          {
            type: 'cmcOrg',
            row: '1',
            column: '2',
            cardClass: 'border-0 pe-pointer p-0',
            data: {
              heading: 'Clinical Snippets',
              cardClass: 'flex-lg-row d-flex flex-column align-items-center px-5',
              cardClass2: 'p-0',
              icon: '../images/icons/Open_Book.png',
              iconWidth: 120,
              councilMemberOrganizationName: 'Take a quiz!!',
              date: '',
              textSize: 'larger',
              onclick: `navigateTo('clinicalSnip', {}, ['loadClinicalSnip',[]]);`
            },
          },
          {
            type: 'cmcOrg',
            row: '1',
            column: '2',
            cardClass: 'border-0 pe-pointer p-0',
            data: {
              cardClass: 'flex-lg-row d-flex flex-column',
              cardClass2: 'align-content-center p-0',
              icon: 'https://s3.amazonaws.com/img.studenthub.in/CMCVConnect_Portal/Pictures/_95ba291d20881589e4a4c4e099df0af6_Pictures.png',
              iconWidth: 150,
              councilMemberOrganizationName: 'Medical Colleges Conclave',
              date: 'Bringing together Christian institutions to strengthen Education, Service, Research & Outreach in our nation.',
              textSize: 'larger',
              btnText: 'Register',
              onclick: `navigateTo('academicConclave', {}, ['conclaveParticipants', []]);`
            },
          },
          {
            type: 'cmcOrg',
            row: '1',
            column: '2',
            cardClass: 'border-0 pe-pointer p-0',
            data: {
              cardClass: 'flex-lg-row d-flex flex-column',
              cardClass2: 'align-content-center p-0',
              icon: 'https://s3.amazonaws.com/img.studenthub.in/CMCVConnect_Portal/Pictures/_28bee5a70144b41a2f693999122af07b_Pictures.png',
              iconWidth: 210,
              councilMemberOrganizationName: '"THIS SHILOH.. WOULD YOU LIKE TO CONNECT WITH US?"',
              date: 'Sharing Your Struggles With Someone Who Has Walked The Path - In An Atmosphere Of Love, Trust, And Openness - Can Open The Door To Your Breakthrough.',
              textSize: 'medium',
              url: `window.open('https://docs.google.com/forms/d/e/1FAIpQLSf0Hdz-vvsCtxw0ZBDnGhgdxnV5SpygYOyscPzk1yPCm7KwmA/viewform', '_blank')`,
              btnText: 'Register',
              onclick: `openModal('connectOneOnOne', null, '')`
            },
          },
          {
            type: 'subCards',
            row: '1',
            column: '1',
            cardName: 'CardBuilder',
            heading: "cardbuilder",
            cardWidth: 'd-flex ',
            data: []
          },

        ]
      }
      context.homeCards[9].data = results.data.map(item => ({
        ...item,
        currPage: 'renderPostHomePage()'
      }));
      resolve(context);

    } catch (error) {
      console.error('Error rendering home.html:', error);
      reject(error);
    }
  })
}

async function renderMissionPage() {
  return new Promise(async (resolve, reject) => {

    try {
      const context = {
        missionsCards: [

          {
            type: 'whatsNew',
            row: '1',
            column: '1',
            data: {
              whatsNew: '${data.whatsNew}',
            }
          },
          {
            type: 'singleData',
            cardName: 'Thought',
            icon: "./images/dove.svg",
            heading: "Thought for the day",
            cardWidth: '',
            row: '2',
            column: '1',
            data: { textData: '${data.thoughtOfDay || "“Whenever GOD determines to do a great work, HE first sets HIS people to pray.” - Charles Spurgeon" }' }
          },
          {
            type: 'dualCards',
            row: '2',
            column: '1',
            data: {
              cards: [
                {
                  cardWidth: 'col-md-5-5',
                  icon: './images/icons/india-icon1.png',
                  cardName: 'Mission Hospitals',
                  hoverMessage: 'View our mission hospitals',
                  onclick: `navigateTo('contact', { postLogin: true, currPage: 'renderMissionsPage()', role: 'Missions' }, ['loadHospitalIdsAndMap', []]);`
                },

                {
                  cardWidth: 'col-md-5-5',
                  subCards: [
                    {
                      icon: './images/icons/opinionIcon.png',
                      cardName: 'Second-Opinion Connect',
                      onclick: `navigateTo('secondOpinionModule', {}, []);`
                    },
                    {
                      icon: 'https://s3.amazonaws.com/img.studenthub.in/CMCVConnect_Portal/Pictures/_0fbb4d606fae3f3c4387747ef92ad750_Pictures.png',
                      cardName: 'Network Consults',
                      cardKeyName: 'networkConslt',
                      onclick: `navigateTo('networkConslt', {}, ['enableNetConsltRolesPage', []]);`
                    }
                  ]
                }
              ]
            }
          },
          {
            type: 'grandRounds',
            icon: "../images/icons/grandRounds.png",
            row: 2,
            column: 1,
            heading: "Grand Rounds",
            cardName: "grandrounds",
            data: {
              grandRoundsCards: '${data.grandRounds}'
            }
          },
          {
            type: 'subCards',
            row: '2',
            column: '1',
            cardName: 'CardBuilder',
            heading: "cardbuilder",
            cardWidth: 'd-flex ',
            data: []
          },
          {
            type: 'cardList',
            icon: "./images/feather-solid.svg",
            heading: "Hospitals",
            row: '2',
            column: '2',
            data: {
              readMoreCards: '${data.allottedHospitals}'
            }
          },
          {
            type: 'weeklyManna',
            icon: "./images/prayer-hands.png",
            cardName: "weeklyManna",
            heading: "Weekly Manna",
            row: 2,
            column: 3,
            data: {
              weeklyMannaCards: '${data.weeklyManna}',
            }

          },
          // {
          //   type: 'cmcOrg',
          //   row: '2',
          //   column: '3',
          //   cardClass: 'border-0 pe-pointer p-0',
          //   data: {
          //     cardClass: 'flex-lg-row d-flex flex-column',
          //     cardClass2: 'align-content-center p-0',
          //     icon: 'https://s3.amazonaws.com/img.studenthub.in/CMCVConnect_Portal/Pictures/_28bee5a70144b41a2f693999122af07b_Pictures.png',
          //     iconWidth: 210,
          //     councilMemberOrganizationName: 'THIS SHILOH.. WOULD YOU LIKE TO CONNECT WITH US',
          //     date: 'Sharing Your Struggles With Someone Who Has Walked The Path - In An Atmosphere Of Love, Trust, And Openness - Can Open The Door To Your Breakthrough.',
          //     textSize: 'medium',
          //     url: `window.open('https://docs.google.com/forms/d/e/1FAIpQLSf0Hdz-vvsCtxw0ZBDnGhgdxnV5SpygYOyscPzk1yPCm7KwmA/viewform', '_blank')`,
          //     btnText: 'Register',
          //     onclick: `openModal('connectOneOnOne', null, '')`
          //   },
          // },
          {
            type: 'cmcOrg',
            row: '2',
            column: '3',
            cardClass: 'border-0 pe-pointer p-0',
            data: {
              heading: 'Medical Colleges Conclave',
              cardClass: 'flex-lg-row d-flex flex-column align-items-center',
              cardClass2: 'p-0',
              icon: 'https://s3.amazonaws.com/img.studenthub.in/CMCVConnect_Portal/Pictures/_95ba291d20881589e4a4c4e099df0af6_Pictures.png',
              iconWidth: 150,
              councilMemberOrganizationName: 'Bringing together Christian institutions to strengthen Education, Service, Research & Outreach in our nation.',
              textSize: 'medium',
              btnText: 'Register',
              onclick: `navigateTo('academicConclave', {}, ['loadMap', ['conclaveHsptlMap']]);`
            },
          },
          {
  type: 'cmcOrg',
  row: '2',
  column: '3',
  cardClass: 'border-0 pe-pointer p-0',
  data: await getLatestNewsletterCard(),
},
          {
            type: 'cmcOrg',
            row: '2',
            column: '3',
            cardClass: 'border-0 pe-pointer p-0',
            data: {
              heading: 'Feedback',
              icon: 'https://s3.amazonaws.com/img.studenthub.in/CMCVConnect_Portal/Pictures/_dede857b58548dae8724c6d04fda3737_Pictures.png',
              iconWidth: 120,
              councilMemberOrganizationName: 'Please take a moment to share your feedback.',
              textSize: 'medium',
              onclick: `openModal('formIO', null, ''), connectFeedbackForm()`
            }
          },
          {
            type: 'cmcOrg',
            row: '2',
            column: '2',
            cardClass: 'border-0 pe-pointer p-0',
            data: {
              heading: 'Clinical Snippets',
              cardClass: 'flex-lg-row d-flex flex-column align-items-center px-5',
              cardClass2: 'p-0',
              icon: '../images/icons/Open_Book.png',
              iconWidth: 120,
              councilMemberOrganizationName: 'Take a quiz!!',
              date: '',
              textSize: 'larger',
              onclick: `navigateTo('clinicalSnip', {}, ['loadClinicalSnip',[]]);`
            },
          },
          {
            type: 'ticker',
            cardName: 'NewsData',
            icon: "./images/file.svg",
            heading: "News",
            row: '2',
            column: '2',
            data: {
              query: 'faculty',
              currPage: 'renderMissionsPage()',
              rNews: '${data.renderedNews}'
            }
          }
        ]
      }
      var missionCards = ['connectNewsletter', 'learningResources', 'manpowerRequest', 'dls', 'nabhEntryLevel', 'legalHelp', 'missionHospitalVisits', 'equipment', 'missionDesk', 'libraryAccess', 'research', 'shiloh'];
      const collections = [
        { "collection": "CardBuilder", "query": { cardKeyName: { $in: missionCards } } },
      ];
      const results = await fetchedDataAPI('fetchCollectionData', collections);
      context.missionsCards[4].data = results.CardBuilder?.data.map(item => ({
        ...item,
        currPage: 'renderMissionsPage()'
      }));
      resolve(context);
    } catch (error) {
      console.error('Error rendering home.html:', error);
      reject(error);
    }
  })
}

async function rendercouncilPage() {
  return new Promise(async (resolve, reject) => {
    try {
      const welcomeNote = `Welcome to the Council Member's Section of CMCVConnect.
      This is a confidential section accessible only to Council members of the CMC Vellore
      Association.
      Data on this page is from the records in the Council Office.
      If there are any discrepancies in the data displayed, kindly contact us at
      <span class="triangle"></span><span class="secondary-color text-end">
          councilsecretary@cmcvellore.ac.in</span>`
      const docText = `<sup>*</sup>Please click on the Council Documents
                            icon to access the agenda and minutes of the Council Meetings`
      const context = {
        userData: {
          'userId': '${data.userData.userId}' || '',
          "profile": "${data.profile}" || {},
          "roles": "${data.roles}" || []
        },
        profileCards: [
          {
            type: 'singleData',
            icon: "./images/feather-solid.svg",
            heading: "Welcome Note",
            row: '1',
            column: '1',
            data: { noteContent: welcomeNote, noteHeading: 'Welcome to CMCVConnect!' }
          },
          {
            type: 'headOfOrgInfo',
            icon: "./images/feather-solid.svg",
            heading: "head of Organisation",
            row: '2',
            column: '1',
            cardWidth: 'col-md-4',
            data: {
              headOfOrganizationName: '${data.headOfOrg.headOfOrganizationName}',
              imageData: '${data.avatar}',
              subTitle: 'Head of Organization'
            }
          },
          {
            type: 'cmcDocs',
            heading: "cmc docs",
            row: '2',
            column: '2',
            cardWidth: 'col-md-2-5',
            data: {
              noteContent: docText, cardName: '${data.councilDoc.cardName}', chooseAnIcon: '${data.councilDoc.chooseAnIcon}',
              // redirectUrl: '${data.councilDoc.pathUrl}'+'?email='+'${data.email}'  
              redirectUrl: 'https://cmcv.sharepoint.com/sites/TheCMCVelloreAssociation'
            }
          },
          {
            type: 'cmcOrg',
            icon: "./images/feather-solid.svg",
            heading: "Organization",
            row: '2',
            column: '3',
            cardWidth: 'col-md-2-5',
            data: {
              // chooseAnIcon:'fa-5x ion-ios-flower-outline rounded-circle bg-dark',
              chooseAnIcon: './images/flower1.svg',
              cardName: 'Organization',
              councilMemberOrganizationName: '${data.headOfOrg.councilMemberOrganizationName}'
            }
          },
          {
            type: 'cmcDocs',
            icon: "./images/feather-solid.svg",
            heading: "Consultation 2025",
            row: '2',
            column: '3',
            cardWidth: 'col-md-2-5',
            data: {
              consultIcon: './images/icons/consult.png',
              cardName: 'Consultation 2025',
              redirectUrl: `https://cmcv.sharepoint.com/sites/CMCConsultations`,
            }
          },

          {
            type: 'cardTable',
            icon: "./images/feather-solid.svg",
            heading: "Hospital",
            row: '3',
            column: '2',
            data: {
              councilMemberOrganizationName: '',
              councilMemberHospitals: [
                {
                  index: 1,
                  missionHospitalName: 'hospital name 1',
                },
                {
                  index: 2,
                  missionHospitalName: 'hospital name 2',
                },
              ],
            }
          },
          {
            type: 'cardList',
            icon: "./images/feather-solid.svg",
            heading: "Organization Members",
            row: '4',
            column: '1',
            data: {
              memberCard: '${data.councilCardData}',
              councilMembers: '${data.cnMembers}'
            }
          },
        ],
      };
      resolve(context);
    } catch (error) {
      console.error('Error rendering council.html:', error);
      reject(error);
    }
  });
}
//Private Mission hospital page
async function renderMissionHospitalUser() {
  return new Promise(async (resolve, reject) => {
    try {
      var missionHospUsrCards = ['Best Matching Program']
      var collections = [
        { "collection": "CardBuilder", "query": { cardName: { $in: missionHospUsrCards } } },
        { "collection": "FormIO", "query": { formKey: "externalMissionRequest" } },
      ]
      const staticData = await fetchedDataAPI('fetchCollectionData', collections)

      const statusCards = ["Submitted", "In Progress", "Completed"]
      const results = await fetchCollectionData('fetchCollectionData', { collection: "InformationCardBuilder", query: { cardName: { $in: statusCards } } });

      let context = {
        missionHospital: '${data.missionHospital}',
        homeCards: [
          {
            type: 'singleData',
            cardName: 'About',
            icon: "./images/feather-solid.svg",
            heading: 'About ' + '${data.msnHosp.missionHospitalName}',
            cardWidth: '',
            row: '1',
            column: '1',
            data: { textData: '${data.msnHosp.aboutHospital}' }
          },
          {
            type: 'subCards',
            icon: "",
            heading: "",
            row: '1',
            column: '2',
            data: {
              readMoreCards: '${data.statusCardsData}'
            }
          },
          {
            type: 'cardTable',
            cardName: 'Departments',
            icon: "",
            heading: '',
            row: '1',
            column: '1',
            data: {
              heading: '${data.msnHosp.missionHospitalName}' + ' Departments',
              tableHeader: 'Departments',
              tableData: '${data.specializationsTable}'
              // tableData:JSON.parse('${data.specialization}')|| []
            }
          },
          {
            type: 'cardList',
            icon: "./images/feather-solid.svg",
            heading: "Location",
            row: '1',
            column: '2',
            data: {
              map: {
                locationPin: '${data.msnHosp.hospitalPincode}'
              },
            }
          },
          {
            type: 'cardList',
            icon: "./images/feather-solid.svg",
            heading: "Contact Us",
            row: '1',
            column: '2',
            data: {

              listData: [
                {
                  iconImage: 'fa-address-book',
                  detail: '${data.msnHosp.hospitalAddress}',
                },
                {
                  iconImage: 'fa-envelope',
                  detail: '${data.msnHosp.hospitalEmail}',
                },
                {
                  iconImage: 'fa-globe',
                  detail: '${data.msnHosp.hospitalWebsite}',
                },
              ]
            }
          },


        ],
        statusCards: [
          {
            type: 'infoCards',
            heading: "",
            data: []
          }
        ],

        galleryTable: '${data.galleryTable}'
      }
      context.statusCards[0].data = results.data.map(item => ({
        ...item,
      }));
      // console.log(context.homeCards[1].data.tableData)
      // context.homeCards[1].data.tableData='${data.specialization}'
      resolve(context);
    } catch (error) {
      console.error("Error rendering modal:", error);
      reject(error); // Catch synchronous errors and reject the Promise
    }
  });

}
//Public Mission hospital page
async function renderMissionHospitalDetails() {
  return new Promise(async (resolve, reject) => {
    try {
      var missionHospUsrCards = ['Best Matching Program']
      var collections = [
        { "collection": "CardBuilder", "query": { cardName: { $in: missionHospUsrCards } } },
        { "collection": "FormIO", "query": { formKey: "externalMissionRequest" } },
      ]
      const staticData = await fetchedDataAPI('fetchCollectionData', collections)

      let context = {
        missionHospital: '${data.missionHospital}',
        redirect: '${data.currPage}',
        homeCards: [
          {
            type: 'singleData',
            cardName: 'About',
            icon: "./images/feather-solid.svg",
            heading: 'About ${data.msnHosp?.missionHospitalName || data.msnHosp?.hospitalName || "Hospital"}',
            cardWidth: '',
            row: '1',
            column: '1',
            data: { textData: '${data.msnHosp?.aboutHospital ? data.msnHosp?.aboutHospital: "Details Awaited"}' }
          },
          {
            type: 'subCards',
            icon: "",
            heading: "",
            row: '1',
            column: '2',
            data: {
              readMoreCards: '${data.statusCardsData}'
            }
          },
          {
            type: 'cardTable',
            cardName: 'Departments',
            icon: "",
            heading: '',
            cardWidth: '',
            row: '1',
            column: '1',
            data: {
              heading: '${data.msnHosp?.missionHospitalName || data.msnHosp?.hospitalName || "Hospital"} Departments',
              tableHeader: 'Departments',
              tableData: '${data.specializationsTable ? data.specializationsTable : "Details Awaited"}'
              // tableData:JSON.parse('${data.specialization}')|| []
            }
          },
          {
            type: 'cardList',
            heading: "Gallery",
            icon: "./images/feather-solid.svg",
            row: '1',
            column: '2',
            data: {
              gallery: '${data.galleryTable}'

            }
          },
          {
            type: 'cardList',
            icon: "./images/feather-solid.svg",
            heading: "Location",
            row: '1',
            column: '2',
            data: {
              map: {
                locationPin: '${data.msnHosp.hospitalPincode}'
              },
            }
          },
          {
            type: 'cardList',
            icon: "./images/feather-solid.svg",
            heading: "Contact Us",
            row: '1',
            column: '2',
            data: {

              listData: [
                {
                  iconImage: 'fa-address-book',
                  detail: '${data.msnHosp.hospitalAddress ? data.msnHosp.hospitalAddress : "Details Awaited"}',
                },
                {
                  iconImage: 'fa-envelope',
                  detail: '${data.msnHosp.hospitalEmail ? data.msnHosp.hospitalEmail : "Details Awaited"}',
                },
                {
                  iconImage: 'fa-globe',
                  msg: 'Website not available',
                  detail: '${data.msnHosp.hospitalWebsite ? data.msnHosp.hospitalWebsite : "Details Awaited"}',
                },
              ]
            }
          },


        ],

        galleryTable: '${data.galleryTable}'
      }
      // console.log(context.homeCards[1].data.tableData)
      // context.homeCards[1].data.tableData='${data.specialization}'
      resolve(context);
    } catch (error) {
      console.error("Error rendering modal:", error);
      reject(error); // Catch synchronous errors and reject the Promise
    }
  });

}

async function renderMentee() {
  return new Promise(async (resolve, reject) => {
    try {
      let context = {
        menteeCards: [
          {
            type: 'headOfOrgInfo',
            row: '1',
            column: '1',
            cardWidth: 'col-12',
            data: {
              userType: '${data.userType}',
              userId: '${data.menteeId}',
              imageData: '${data.cardData.menteeAvatar}',
              headOfOrganizationName: '${data.cardData.menteeName}',
              subTitle: '${data.cardData.menteeCourse}'
            }
          },
          {
            type: 'cardList',
            cardName: '',
            icon: "./images/feather-solid.svg",
            heading: 'My Mentors',
            cardWidth: '',
            row: '2',
            column: '1',
            data: {
              memberCard: '${data.cardData.mentorList}',
            }
          },
          {
            type: 'singleData',
            redirect: true,
            readMore: true,
            icon: "./images/feather-solid.svg",
            heading: "Mentee Instructions",
            cardWidth: '',
            row: '1',
            column: '2',
            data: { textData: '${data.cardData.menteeInstruction}', userType: '${data.userType}' }
          },
          {
            type: 'cardList',
            icon: "./images/feather-solid.svg",
            heading: "Mentee Meetings",
            cardWidth: '',
            row: '2',
            column: '2',
            data: { location: 'allMeetings' }
          },
        ]
      }
      resolve(context);
    }
    catch (err) {
      console.log('error in rendering mentee', err);
      reject(error);
    }
  });
}

async function renderMentor() {
  return new Promise(async (resolve, reject) => {
    try {
      let context = {
        mentorCards: [
          {
            type: 'headOfOrgInfo',
            row: '1',
            column: '1',
            cardWidth: 'col-12',
            data: {
              userType: '${data.userType}',
              userId: '${data.mentorId}',
              imageData: '${data.cardData.mentorAvatar}',
              headOfOrganizationName: '${data.cardData.mentorName}',
              subTitle: '${data.cardData.mentorCourse}'
            }
          },
          {
            type: 'cardList',
            cardName: '',
            icon: "./images/feather-solid.svg",
            heading: 'My Mentees',
            cardWidth: '',
            row: '2',
            column: '1',
            data: {
              memberCard: '${data.cardData.menteeList}',
            }
          },
          {
            type: 'singleData',
            redirect: true,
            readMore: true,
            icon: "./images/feather-solid.svg",
            heading: "Mentor Instructions",
            cardWidth: '',
            row: '1',
            column: '2',
            data: { textData: '${data.cardData.mentorInstruction}', userType: '${data.userType}' }
          },
          {
            type: 'cardList',
            icon: "./images/feather-solid.svg",
            heading: "Mentor Meetings",
            cardWidth: '',
            row: '2',
            column: '2',
            data: { location: 'allMeetings' }
          },
        ]
      }
      resolve(context);
    }
    catch (err) {
      console.log('error in rendering mentee', err);
      reject(error);
    }
  });
}

async function learningResources() {
  return new Promise(async (resolve, reject) => {
    try {
      // let context={
      //   audioData :[
      //     {
      //       title: "Willingness to Accept Nursing Profession",
      //       url: "https://api.soundcloud.com/tracks/1711512444?secret_token=s-rUtd51DjJNz",
      //       author: "Arun Zechariah",
      //       authorUrl: "https://soundcloud.com/arun-zechariah",
      //       trackTitle: "WILLINGNESS TO ACCEPT NURSING PROFESSION",
      //       trackUrl: "https://soundcloud.com/arun-zechariah/willingness-to-accept-nursing-profession/s-rUtd51DjJNz",
      //     },
      //     {
      //       title: "Balance Between Studies and Work Life",
      //       url: "https://api.soundcloud.com/tracks/1711512360?secret_token=s-fLAjZzjaZPJ",
      //       author: "Arun Zechariah",
      //       authorUrl: "https://soundcloud.com/arun-zechariah",
      //       trackTitle: "BALANCE BETWEEN STUDIES & WORK LIFE",
      //       trackUrl: "https://soundcloud.com/arun-zechariah/balance-between-studies-work-life/s-fLAjZzjaZPJ",
      //     },
      //     {
      //       title: "Home Sickness",
      //       url: "https://api.soundcloud.com/tracks/1711512306?secret_token=s-en2zi7w3txa",
      //       author: "Arun Zechariah",
      //       authorUrl: "https://soundcloud.com/arun-zechariah",
      //       trackTitle: "HOME SICKNESS",
      //       trackUrl: "https://soundcloud.com/arun-zechariah/home-sickness/s-en2zi7w3txa",
      //     },
      //   ],
      //   videoData : [
      //     {
      //       title: "High-quality Accessible Healthcare in Low-Resource Settings",
      //       url: "https://www.youtube.com/embed/LLwjuyMhBhM?si=cHzpTfSm8tT3URwY",
      //       author: "Arun Zechariah",
      //       authorUrl: "https://www.youtube.com",
      //       videoTitle: "High-quality Accessible Healthcare in Low-Resource Settings",
      //       videoUrl: "https://www.youtube.com/embed/LLwjuyMhBhM?si=cHzpTfSm8tT3URwY",
      //     },
      //   ],
      // };
      // resolve(context);
    }
    catch (error) {
      console.error("Error rendering modal:", error);
      reject(error); // Catch synchronous errors and reject the Promise
    }
  });
}

async function renderModalPage() {
  return new Promise(async (resolve, reject) => {
    try {
      const values = {
        category: '${data.category}' || '',
        content: '${data.content}' || {},
        data: {
          memberCard: '${data.content.cardData.data.memberCardTable}' || ''
        },
      }
      resolve(values);
    } catch (error) {
      console.error("Error rendering modal:", error);
      reject(error); // Catch synchronous errors and reject the Promise
    }
  });

}

async function fetchedDataAPI(collectionRequestType, collections) {
  const results = {};

  await Promise.all(collections.map(async (coll) => {
    try {
      const data = await fetchCollectionData(collectionRequestType, coll);
      results[coll.collection] = data;
    } catch (error) {
      console.error(`Error fetching data for collection ${coll.collection}:`, error);
      results[coll.collection] = { error: error.message };
    }
  }));

  return results;
}

async function fetchCollectionData(collectionRequestType, collectionData) {
  const response = await fetch(`https://academics.cmcvellore.edu.in/api/connectApp/${collectionRequestType}`, {
    // const response = await fetch(`http://localhost:3000/methods/${collectionRequestType}`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(collectionData)
  });

  if (!response.ok) {
    throw new Error(`Error fetching data for ${collectionRequestType}: ${response.statusText}`);
  }

  return response.json();
}

function renderLegalHelp() {
  return new Promise(async (resolve, reject) => {
    const legalcards = ["Submitted", "In Progress", "Completed"]
    const results = await fetchCollectionData('fetchCollectionData', { collection: "InformationCardBuilder", query: { cardName: { $in: legalcards } } });
    try {
      const context = {
        legalHelpCards: [
          {
            type: 'infoCards',
            heading: "",
            data: []
          }
        ]
      }
      context.legalHelpCards[0].data = results.data.map(item => ({
        ...item,
      }));
      resolve(context);
    }
    catch (error) {
      console.log('error in rendering mentee', error);
      reject(error);
    }
  })
}

async function renderManpowerRequest() {
  return new Promise(async (resolve, reject) => {
    const legalcards = ["Submitted", "In Progress"]
    const results = await fetchCollectionData('fetchCollectionData', { collection: "InformationCardBuilder", query: { cardName: { $in: legalcards } } });
    try {
      const context = {
        ManReqCards: [
          {
            type: 'infoCards',
            heading: "",
            data: []
          }
        ]
      }
      context.ManReqCards[0].data = results.data.map(item => ({
        ...item,
      }));
      resolve(context);
    }
    catch (error) {
      console.log('error in rendering mentee', error);
      reject(error);
    }
  })
}


function renderFinance() {
  return new Promise(async (resolve, reject) => {
    const statusCards = ["Submitted", "In Progress", "Completed"]
    const results = await fetchCollectionData('fetchCollectionData', { collection: "InformationCardBuilder", query: { cardName: { $in: statusCards } } });
    try {
      const context = {
        financeCards: [
          {
            type: 'infoCards',
            heading: "",
            data: []
          }
        ]
      }
      context.financeCards[0].data = results.data.map(item => ({
        ...item,
      }));
      resolve(context);
    }
    catch (error) {
      console.log('error in rendering mentee', error);
      reject(error);
    }
  })
}

async function getLatestNewsletterCard() {
  const fallback = {
    heading: 'Missions Connect Newsletter',
    cardClass: 'flex-lg-row d-flex flex-column',
    cardClass2: 'align-content-center',
    icon: 'https://s3.amazonaws.com/img.studenthub.in/CMCVConnect_Portal/Pictures/_53841622cdbeb07dc31398aa3346b1f6_Pictures.png',
    iconWidth: 150,
    councilMemberOrganizationName: 'Do you have a story to share?',
    date: 'We would love to hear from you. Please write to us @ missionconnect@cmcvellore.ac.in',
    textSize: 'larger',
    url: ` `,
    btnText: 'Click here to read Vol 1 issue 2',
    flipbook: 'https://online.fliphtml5.com/cmcvellore/Mission-Connect---NL-2026-Vol1-Iss-2/',
    onclick: 'openNewsletter(this)'
  };
  try {
    const results = await fetchCollectionData('fetchCollectionData', {
      collection: 'ConnectNewsletter',
      query: { isDeleted: false },
      options: { sort: { stDate: -1 } },
      projection: { title: 1, flipbookUrl: 1 }
    });
    const latest = results?.data?.[0];
    if (!latest) return fallback;
    return {
      ...fallback,
      btnText: `Click here to read the ${latest.title || 'the latest issue'}`,
      flipbook: latest.flipbookUrl || fallback.flipbook
    };
  } catch (error) {
    console.error('Error fetching latest newsletter for home/missions card:', error);
    return fallback;
  }
}