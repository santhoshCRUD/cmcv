// Request Notification Permission
function requestNotificationPermission() {
  if ('Notification' in window) {
    Notification.requestPermission().then(permission => {
      if (permission === 'granted') {
        console.log('Notification permission granted.');
      } else {
        console.log('Notification permission denied.');
      }
    });
  } else {
    console.log('Notifications are not supported by this browser.');
  }
}

requestNotificationPermission();

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./service-worker.js')
      .then(async (registration) => {
        console.log("Service Worker is registered", registration.scope);
        // subscribeUserToPush(registration);
      }
      )
      .catch(error => console.error('Service Worker registration failed:', error));
  })
}

//Function to trigger background sync
function triggerBackgroundSync() {
  //if ('serviceWorker' in navigator && 'SyncManager' in window) {
  navigator.serviceWorker.ready.then(async function (registration) {
    if ('sync' in registration) {
      return registration.sync.register('mySyncTag').then(() => {
        console.log('Sync registered');
      }).catch((err) => {
        console.log('Sync registration failed:', err);
      });
    }
    // Register Periodic Background Sync
    if ('periodicSync' in registration) {
      registration.periodicSync.register({
        tag: 'periodic-sync',
        minInterval: 5 * 60 * 1000 // 5 minutes

      }).then(() => {
        console.log('Periodic Sync registered');
      }).catch(err => {
        console.log('Periodic Sync registration failed:', err);
      });
    }
    if ('backgroundFetch' in registration) {
      const bgFetch = await registration.backgroundFetch.fetch('my-fetch', ['icon.png'], {
        title: 'My Background Fetch',
        icons: [{
          sizes: '192x192',
          src: 'icon.png',
          type: 'image/png',
        }],
        downloadTotal: 1000
      });

      console.log('Background Fetch started:', bgFetch);
    } else {
      console.log('Background Fetch is not supported.');
    }
  });
  //}
}
triggerBackgroundSync();

function sendMessageToSW(message) {
  return new Promise((resolve, reject) => {
    if (!('serviceWorker' in navigator)) {
      return reject('Service Worker not supported');
    }
    navigator.serviceWorker.ready.then(registration => {
      const messageChannel = new MessageChannel();
      messageChannel.port1.onmessage = event => {
        if (event.data.success) {
          resolve(event.data);
        } else {
          reject(event.data);
        }
      };
      registration.active.postMessage(message, [messageChannel.port2]);
    }).catch(error => {
      console.error('Service Worker ready error:', error);
      reject(error);
    });
  });
}

let usrDetails;//login userdetails
async function signIn(username, type) {
  loginType = type
  sessionStorage.setItem('loginType', loginType);
  if (!navigator.onLine) {
    console.warn('User is offline. Cannot perform login.');
    return;
  }
  try {
    const response = await fetch('https://academics.cmcvellore.edu.in/api/connectApp/appConnectUserLogin', {
      method: 'POST',
      headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify({ "email": username })
      // body: JSON.stringify({ "email": "testconnect@cmc.edu.in" })
      //body: JSON.stringify({ "email": "ztest2019@cmcvellore.edu.in" })
      //body: JSON.stringify({ "email": "vinayoommen@cmcvellore.ac.in" })
    });
    const resp = await response.json();
    if (!resp.success) {
      console.error('Login failed:', resp.message);
      return;
    }
    usrDetails = resp
    console.log('Login successful:', usrDetails);
    sessionStorage.setItem('usrDetails', JSON.stringify(usrDetails));
    renderPostHomePage();

  } catch (error) {
    console.error('Error during login:', error.message);
  }
};

let userIsLoggedIn = false;
let version = ''
document.addEventListener("DOMContentLoaded", async function () {
  console.log('DOMContentLoaded');
  try {
    // Attempt to fetch the manifest
    try {
      const response = await fetch('./manifest.webmanifest');
      if (response.ok) {
        const manifest = await response.json();
        version = manifest.version || "loading...";
      } else {
        console.warn("Manifest not found. Using default version value.");
        version = "loading...";
      }
    } catch (error) {
      version = "loading...";
      console.warn("Failed to fetch manifest:", error);
    }

    // Pass the version to header and footer
    const context = { preLogin: true, version }; // Explicit context declaration

    const savedGoogleEmail = sessionStorage.getItem('googleUserEmail');
    const savedMSAccount = sessionStorage.getItem('msUserEmail');

    if (!savedGoogleEmail && !savedMSAccount) {
      console.log('No saved email found, loading home page');
      loadHeaderContent(context);
      loadPage('home');
      googleSignIn();
    }
    loadFooterContent(version);
    setTimeout(() => {
      const storedTabId = sessionStorage.getItem('activeTabId') || 'home';
      activateTab(storedTabId);
    }, 200); // Delay to ensure content is loaded before activating tab
    setTimeout(() => initWhatsNewCarousel(), 500);

  } catch (error) {
    console.error('Error rendering template:', error);
  }

  window.addEventListener('offline', () => {
    console.log("you are offline now")
  })
  window.addEventListener('online', () => {
    console.log("you are back online now")
  })
  const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
  [...tooltipTriggerList].forEach(el => new bootstrap.Tooltip(el));

})

function loadHeaderContent(context) {
  var headerElement = document.getElementById('header-content');
  if (window.precompiledTemplates && typeof window.precompiledTemplates['header'] === 'function') {
    var templateFunction = window.precompiledTemplates['header'];
    try {
      var renderedHtml = templateFunction(context);
      headerElement.innerHTML = renderedHtml;

    } catch (e) {
      console.error('Error rendering head template:', e);
    }
  } else {
    console.error('Head Template not found or not a function:', templateName);
  }
}


function loadPage(page, context = {}, callbacks = null, pushToHistory = true) {
  removeInfiniteScroll();
  return new Promise((resolve, reject) => {
    const contentElement = document.getElementById('content');
    const templateName = page;

    if (window.precompiledTemplates && typeof window.precompiledTemplates[templateName] === 'function') {
      try {
        const renderedHtml = window.precompiledTemplates[templateName](context);
        contentElement.innerHTML = renderedHtml;
        contentElement.scrollTop = 0;
        const btn = document.getElementById('backToTopBtn');
        if (btn) btn.style.display = 'none';

        initBackToTop();
        resolve(true);
        // Handle one or more callbacks
        if (Array.isArray(callbacks) && Array.isArray(callbacks[0])) {
          for (const [fnName, args = []] of callbacks) {
            if (typeof window[fnName] === 'function') {
              window[fnName](...args);
            }
          }
        } else if (Array.isArray(callbacks)) {
          const [fnName, args = []] = callbacks;
          if (typeof window[fnName] === 'function') {
            window[fnName](...args);
          }
        } else if (typeof callbacks === 'function') {
          callbacks();
        }

        // Push to history
        if (pushToHistory) {
          history.pushState({ page, context, callbacks }, '', window.location.pathname);
        }

        resolve(true);
      } catch (e) {
        console.error('Error rendering template:', e);
        reject(e);
      }
    } else {
      console.error('Template not found or not a function:', templateName);
    }
  });
}

function loadFooterContent(context) {
  // fetch('/manifest.webmanifest').then(response => response.json()).then(manifest => {    
  //   const version = manifest.version;    
  var footerElement = document.getElementById('footer-content');
  if (window.precompiledTemplates && typeof window.precompiledTemplates['footer'] === 'function') {
    var templateFunction = window.precompiledTemplates['footer'];
    try {
      var renderedHtml = templateFunction(context);
      footerElement.innerHTML = renderedHtml;

    } catch (e) {
      console.error('Error rendering footer template:', e);
    }
  } else {
    console.error('Footer Template not found or not a function');
  }
  // })  
  // .catch(error => { console.error("Error fetching manifest:", error); });
}

async function loadHospitalIdsAndMap() {
  try {
    const collections = {
      collection: "MissionHospital",
      query: { isDeleted: "false" },
      options: { projection: { _id: 1, missionHospitalName: 1 } }
    };

    const response = await fetchCollectionData('fetchCollectionData', collections);

    // Validate response structure
    if (!response || !response.data || !Array.isArray(response.data)) {
      throw new Error("Invalid response format or empty data.");
    }

    // Extract hospital IDs
    const hospitalIds = response.data.map(hospital => hospital._id);
    // console.log("Extracted Hospital IDs:", hospitalIds);

    // Load Map with the retrieved IDs
    loadMap('contactMap', hospitalIds);
  } catch (error) {
    console.error("Error fetching hospital IDs:", error);
  }
}

usrDetails = JSON.parse(sessionStorage.getItem('usrDetails'));
loginType = sessionStorage.getItem('loginType') || '';

async function renderPostHomePage() {

  const context = {
    postLogin: true,
    title: "CMCVConnect page",
    userImg: usrDetails.data.profile.avatar || '',
    name: usrDetails.data.profile.name,
    email: usrDetails.data.emails[0].address,
    roles: usrDetails.data.roles || [],
    loginType: loginType,
    // missionBtn: usrDetails.data.roles.includes("Missions") ?
    //   `<a class="nav-link text-white btn" id="missions" data-tab='missions' data-target='${JSON.stringify({ userId: usrDetails.data._id, })}' onclick="activateTab('missions');renderMissionsPage(this)">Missions</a>`
    //   : '',
    // missionBtnmb: usrDetails.data.roles.includes("Missions") ?
    //   `<li class="list-group-item border-bottom border-top-0 border-start-0 border-end-0" data-bs-toggle="tab" data-tab='missions'
    //                 onclick="activateTab('missions');renderMissionsPage()" data-bs-dismiss="offcanvas">
    //                 <a class="nav-link  btn" >Missions</a> </li>` : '',
    councilBtn: usrDetails.data.roles.includes('Council Member') ?
      `<a class="nav-link text-white btn" id="council" data-tab='council' data-target='${JSON.stringify({
        userId: usrDetails.data._id,
        email: usrDetails.data.emails[0].address
      })}' onclick="activateTab('council');renderCouncilPage()">Council</a>`
      : '',
    councilBtnmb: usrDetails.data.roles.includes('Council Member') ?
      `<li class="list-group-item border-bottom border-top-0 border-start-0 border-end-0" data-bs-toggle="tab" data-tab='council' onclick="activateTab('council');renderCouncilPage()" data-bs-dismiss="offcanvas"
                  data-target='${JSON.stringify({
        userId: usrDetails.data._id, email: usrDetails.data.emails[0].address
      })}'>
                  <a class="nav-link btn" >Council</a> </li>` : '',
    mentorBtn: usrDetails.data.roles.includes('Missions Mentor') ?
      `<a class="nav-link text-white btn" id="mentor" data-tab='mentor'
      onclick="activateTab('mentor');renderMentorPage()">Mission Mentors</a>`
      : '',
    mentorBtnmb: usrDetails.data.roles.includes('Missions Mentor') ?
      `<li class="list-group-item border-bottom border-top-0 border-start-0 border-end-0" data-tab='mentor' data-bs-toggle="tab" onclick="activateTab('mentor');renderMentorPage()" data-bs-dismiss="offcanvas">
    <a class="nav-link btn" >Mission Mentors</a> </li>`: '',
    menteeBtn: usrDetails.data.roles.includes('Missions Mentee') ?
      `<a class="nav-link text-white btn" id="mentee" data-tab='mentee'
    onclick="activateTab('mentee');renderMenteePage()">Mission Mentees</a>`
      : "",
    menteeBtnmb: usrDetails.data.roles.includes("Missions Mentee")
      ? `<li class="list-group-item border-bottom border-top-0 border-start-0 border-end-0" data-bs-toggle="tab" data-tab='mentee' onclick="activateTab('mentee');renderMenteePage()" data-bs-dismiss="offcanvas">
    <a class="nav-link btn" >Mission Mentees</a> </li>`
      : "",

    serviceCommitmentBtn: usrDetails.data.profile.userType.includes("student")
      ? `<a class="nav-link text-white btn" id="serviceCommitment" data-tab='serviceCommitment'
    onclick="activateTab('serviceCommitment'); loadServiceCommitPage();">Service Commitment</a>`
      : "",
    serviceCommitmentBtnmb: usrDetails.data.profile.userType.includes("student")
      ? `<li class="list-group-item border-bottom border-top-0 border-start-0 border-end-0" data-bs-toggle="tab" data-tab='serviceCommitment' onclick="activateTab('serviceCommitment'); loadServiceCommitPage();" data-bs-dismiss="offcanvas">
    <a class="nav-link btn" >Service Commitment</a> </li>`
      : "",
    fovGrantsBtn: usrDetails.data.profile.userType.includes("external user") && usrDetails.data.roles.includes("Missions")
      ? `<li class="nav-item dropdown">
        <a class="nav-link dropdown-toggle text-white btn" href="#" role="button" data-bs-toggle="dropdown" data-tab='grants' onclick="activateTab('grants'); navigateTo('grants', ' ', []);">
          Grants
        </a>
        <ul class="dropdown-menu">
          <li>
            <a class="dropdown-item" style="font-size: 16px;"
              onclick="activateTab('grants'); navigateTo('fovGrants', ' ', ['loadFovGrantsPage']);">
              FOV Grant
            </a>
          </li>
          <li>
            <a class="dropdown-item" style="font-size: 16px;"
              onclick="activateTab('grants'); navigateTo('samGrants', ' ', ['loadSamGrantsPage']);">
              SAM Project
            </a>
          </li>

          <li>
            <a class="dropdown-item" style="font-size: 16px;"
              onclick="activateTab('grants'); navigateTo('research', {}, ['loadResearchCards', []]);">
              Research Grant
            </a>
          </li>
        </ul>
      </li>`
      : "",
    fovGrantsBtnmb: usrDetails.data.profile.userType.includes("external user") && usrDetails.data.roles.includes("Missions")
      ? `<li class="list-group-item border-bottom border-top-0 border-start-0 border-end-0">
        <div class="dropdown">
          <button class="btn nav-link w-100 dropdown-toggle" data-bs-toggle="dropdown" data-tab='grants'>
            Grants
          </button>
          <ul class="dropdown-menu w-100">
            <li>
              <a class="dropdown-item" data-bs-dismiss="offcanvas" 
                onclick="activateTab('grants'); navigateTo('fovGrants', ' ', ['loadFovGrantsPage']);">
                FOV Grant
              </a>
            </li>
            <li>
              <a class="dropdown-item" data-bs-dismiss="offcanvas"
                onclick="activateTab('grants'); navigateTo('samGrants', ' ', ['loadSamGrantsPage']);">
                SAM Project
              </a>
            </li>

            <li>
              <a class="dropdown-item" data-bs-dismiss="offcanvas"
                onclick="activateTab('grants'); navigateTo('research', {}, ['loadResearchCards', []]);">
                Research Grant
              </a>
            </li>
          </ul>
        </div>
      </li>
      `
      : "",

    msnVisitBtn: usrDetails.data.profile.userType.includes("faculty")
      ? `<li class="nav-item dropdown">
        <a class="nav-link dropdown-toggle text-white btn" href="#" role="button" data-bs-toggle="dropdown" data-tab='missionEngagement' onclick="activateTab('missionEngagement'); navigateTo('msnEngagement', ' ', []);">
          Mission Engagement
        </a>
        <ul class="dropdown-menu">
          <li>
            <a class="dropdown-item" style="font-size: 16px;"
              onclick="activateTab('missionEngagement'); navigateTo('mmService', ' ', ['loadMmServicePage']);">
              MMS
            </a>
          </li>
          <li>
            <a class="dropdown-item" style="font-size: 16px;"
              onclick="activateTab('missionEngagement'); navigateTo('missionVisits', ' ',[['msnVisitManPowerTable'], ['loadNotesFromJourney']]);">
              Mission Visits
            </a>
          </li>

          <li>
            <a class="dropdown-item" style="font-size: 16px;"
              onclick="activateTab('missionEngagement'); navigateTo('msnSabbatical', ' ', ['loadMsnSabbaticalPage']);">
              Mission Sabbatical
            </a>
          </li>
        </ul>
      </li>`
      : "",

    msnVisitBtnmb: usrDetails.data.profile.userType.includes("faculty")
      ? `<li class="list-group-item border-bottom border-top-0 border-start-0 border-end-0">
        <div class="dropdown">
          <button class="btn nav-link w-100 dropdown-toggle" data-bs-toggle="dropdown" data-tab='missionEngagement'>
            Mission Engagement
          </button>
          <ul class="dropdown-menu w-100">
            <li>
              <a class="dropdown-item" data-bs-dismiss="offcanvas" 
                onclick="activateTab('missionEngagement'); navigateTo('mmService', ' ', ['loadMmServicePage']);">
                MMS
              </a>
            </li>
            <li>
              <a class="dropdown-item" data-bs-dismiss="offcanvas"
                onclick="activateTab('missionEngagement'); navigateTo('missionVisits', ' ',[['msnVisitManPowerTable'], ['loadNotesFromJourney']]);">
                Mission Visits
              </a>
            </li>

            <li>
              <a class="dropdown-item" data-bs-dismiss="offcanvas"
                onclick="activateTab('missionEngagement'); navigateTo('msnSabbatical', ' ', ['loadMsnSabbaticalPage']);">
                Mission Sabbatical
              </a>
            </li>
          </ul>
        </div>
      </li>
      `: '',

    guideBtn: `<a class="nav-link text-white btn" href="#" id="guide" data-tab='guide'
      onclick="activateTab('guide'); navigateTo('guidePage', {}, ['loadGuidePage']);">
      <i class="fa-regular fa-circle-question me-1"></i>Guide</a>`,
    guideBtnmb: `<li class="list-group-item border-bottom border-top-0 border-start-0 border-end-0" data-tab='guide'
      onclick="activateTab('guide'); navigateTo('guidePage', {}, ['loadGuidePage']);" data-bs-dismiss="offcanvas">
      <a class="nav-link btn"><i class="fa-regular fa-circle-question me-1"></i>Guide</a>
    </li>`,

    // renderedNews: arrayDataRenderInCard('news', cardData['NewsData'].data),

    version: version
  };

  loadHeaderContent(context);
  sessionStorage.setItem('headerContent', JSON.stringify(context));

  document.getElementById('content').classList.replace('preLog', 'postLog');

  const { userType } = usrDetails.data.profile;
  const roles = usrDetails.data.roles || [];

  const directRoutes = {
    faculty: renderMissionsPage,
    postgraduate: renderMissionsPage,
    student: renderStudentHomePage,
  };

  // Execute routing
  if (directRoutes[userType]) {
    directRoutes[userType]();
  } else if (userType === 'external user') {
    const isMissions = roles.includes('Missions');
    const isStudent = roles.includes('student');

    if (isStudent && isMissions) {
      renderStudentHomePage();
    } else if (isMissions) {
      renderMissionsPage();
    } else if (roles.includes('VConnect Guest')) {
      renderGuestHomePage();
    }
  }
  //loadNewsTicker();
  loadFooterContent();
  loadFooterContent(version);
  activateTab('home');
}

async function renderStudentHomePage() {
  var now = Date.now();
  var oneDay = 1000 * 60 * 60 * 24;
  var today = new Date(now - (now % oneDay));
  var tomorrow = new Date(today.valueOf() + oneDay);
  today.setHours(0, 0, 0, 0);
  tomorrow.setHours(0, 0, 0, 0);
  const collections = [
    { "collection": "Thought", "query": { "tdate": { "$gte": { "$date": today.toISOString() }, "$lt": { "$date": tomorrow.toISOString() } }, "isDeleted": "false" }, "sort": { "tdate": -1 } },
    { "collection": "WeeklyManna", "query": { isDeleted: false }, "options": { "sort": { "devotionalDate": -1 }, "limit": 1 } },
    { "collection": "GrandRounds", "query": { isDeleted: false }, "options": { "sort": { "startDate": -1 } } }
  ];
  if (usrDetails.data.profile.userType === 'student') {
    collections.push({ "collection": "NewsData", "query": { "newsDate": { "$gt": { "$date": new Date().toISOString() } }, 'newsEditorStatus': 'approved', 'newsTags.newsTagId': 'MSN', 'newsUserType.newsUserTypeName': "student", isDeleted: 'false' }, projection: { _id: 1, newsDate: 1, newsTitle: 1, newsSubTitle: 1, newsImage: 1 }, "options": { "sort": { "newsDate": 1 } } })
  } else if (usrDetails.data.profile.userType === 'external user' && usrDetails.data.roles.includes('student')) {
    collections.push({ "collection": "NewsData", "query": { "newsDate": { "$gt": { "$date": new Date().toISOString() } }, 'newsEditorStatus': 'approved', 'newsTags.newsTagId': 'MSN', 'newsUserType.newsUserTypeName': { "$in": ["external user", "student"] }, isDeleted: 'false' }, projection: { _id: 1, newsDate: 1, newsTitle: 1, newsSubTitle: 1, newsImage: 1 }, "options": { "sort": { "newsDate": 1 } } })
  }

  const cardData = await fetchedDataAPI('fetchCollectionData', collections);
  var context = {
    home: {
      msnbtn: usrDetails.data.roles.includes("Council Member") ?
        `<span class="btn bg-white text-center pe-pointer border p-2" onclick="renderMissionsPage()">Go to Missions <i class="bg-opacity-10 fa-arrow-right fas rounded ms-1"></i></span>`
        : '',
      thoughtOfDay: cardData['Thought'].data[0].thoughts,
      weeklyManna: renderFunctions['weeklyMannaCard'](cardData['WeeklyManna'].data[0]),
      renderedNews: renderFunctions['news'](cardData['NewsData'].data),
      grandRounds: renderFunctions['grandRoundsCard'](cardData['GrandRounds'].data),

    },
  }
  navigateTo('studentHome', context.home);
}

async function renderCouncilPage() {
  let context = {
    userIdData: '',
    email: '',
    headOfOrg: '',
    avatar: '',
    councilDoc: '',
    councilMembers: [],
    missionHospital: [],
    councilCardData: ''
  };
  // const datatarget = JSON.parse(element.getAttribute('data-target'));
  context.userIdData = usrDetails.data._id;
  context.email = usrDetails.data.emails[0].address;

  const collections = [
    { "collection": "CardBuilder", "query": { cardName: "Council Documents" } },
    { "collection": "CouncilMembers", "query": { 'councilMemberUserInfo.councilMemberUserId': context.userIdData, isDeleted: 'false' }, projection: { _id: 1, salutation: 1, councilMemberDesignation: 1, councilMemberUserInfo: 1, councilMemberOrganization: 1 } }
  ];
  const fetchedData = await fetchedDataAPI('fetchCollectionData', collections);
  context.councilDoc = fetchedData.CardBuilder?.data[0]
  const councilMember = fetchedData.CouncilMembers?.data?.[0];
  if (councilMember) {
    const cnMemOrgId = councilMember.councilMemberOrganization?.councilMemberOrganizationId;
    if (!cnMemOrgId) throw new Error('No council member organization ID found.');

    const councilMemberCollections = [
      { "collection": "HeadOfOrganization", "query": { councilMemberOrganizationId: cnMemOrgId, isDeleted: 'false', headOfOrganizationStatus: "Current" } },
      { "collection": "MissionHospital", "query": { councilMemberOrganizationId: cnMemOrgId, isDeleted: 'false' }, projection: { _id: 1, missionHospitalName: 1 } },
      { "collection": "CouncilMembers", "query": { "councilMemberOrganization.councilMemberOrganizationId": cnMemOrgId, "isDeleted": "false" }, projection: { _id: 1, councilMemberUserInfo: 1, councilMemberDesignation: 1, councilMemberImage: 1, salutation: 1, councilMemberCategory: 1 } }
    ];

    const orgDetails = await fetchedDataAPI('fetchCollectionData', councilMemberCollections);
    context.headOfOrg = orgDetails.HeadOfOrganization?.data[0] || { headOfOrganizationName: 'HeadOfOrganization not added', councilMemberOrganizationName: 'concilmemberorganization not added' };
    context.avatar = `https://s3.amazonaws.com/img.studenthub.in/sbHeadofOrganizationUser/${orgDetails.HeadOfOrganization?.data[0]?._id}_user.png`
    context.councilMembers = orgDetails.CouncilMembers?.data || [];
    //console.log('renderCouncilPage results are', orgDetails)
    //context.councilCardData = arrayDataRenderInCard('cardList', orgDetails.CouncilMembers?.data)
    context.councilCardData = renderFunctions['cardList'](orgDetails.CouncilMembers?.data)
    context.missionHospital = orgDetails.MissionHospital?.data || [];
  }
  try {
    navigateTo('council', context);
  } catch (error) {
    console.error('Error in renderCouncilPage:', error);
  }
}
async function renderMissionsPage() {
  // const datatarget = JSON.parse(element.getAttribute('data-target'));
  // const userIdData = datatarget.userId;
  const userIdData = usrDetails.data._id;
  var now = Date.now();
  var oneDay = 1000 * 60 * 60 * 24;
  var today = new Date(now - (now % oneDay));
  var tomorrow = new Date(today.valueOf() + oneDay);
  today.setHours(0, 0, 0, 0);
  tomorrow.setHours(0, 0, 0, 0);
  let collections = [
    { "collection": "Thought", "query": { "tdate": { "$gte": { "$date": today.toISOString() }, "$lt": { "$date": tomorrow.toISOString() } }, "isDeleted": "false" }, "sort": { "tdate": -1 } },
    { "collection": "HospitalAdmins", "query": { userDocId: userIdData, isDeleted: 'false' } },
    { "collection": "WeeklyManna", "query": { isDeleted: false }, "options": { "sort": { "devotionalDate": -1 }, "limit": 1 } },
    { "collection": "GrandRounds", "query": { isDeleted: false }, "options": { "sort": { "startDate": -1 } } },
    { "collection": "WhatsNew", "query": { isDeleted: false, showOnCarousel: 'yes', "showOn.Missions": true }, "options": { "sort": { 'added.addedDate': -1 } } }

  ];

  if (usrDetails.data.profile.userType === 'faculty' || usrDetails.data.profile.userType === 'postgraduate') {
    collections.push({ "collection": "NewsData", "query": { "newsDate": { "$gt": { "$date": new Date().toISOString() } }, 'newsEditorStatus': 'approved', 'newsTags.newsTagId': 'MSN', 'newsUserType.newsUserTypeName': "faculty", isDeleted: 'false' }, projection: { _id: 1, newsDate: 1, newsTitle: 1, newsSubTitle: 1, newsImage: 1 }, "options": { "sort": { "newsDate": 1 } } })
  } else if (usrDetails.data.profile.userType === 'external user' && usrDetails.data.roles.includes('Missions')) {
    collections.push({ "collection": "NewsData", "query": { "newsDate": { "$gt": { "$date": new Date().toISOString() } }, 'newsEditorStatus': 'approved', 'newsTags.newsTagId': 'MSN', 'newsUserType.newsUserTypeName': { "$in": ["external user", "faculty"] }, isDeleted: 'false' }, projection: { _id: 1, newsDate: 1, newsTitle: 1, newsSubTitle: 1, newsImage: 1 }, "options": { "sort": { "newsDate": 1 } } })
  }
  const results = await fetchedDataAPI('fetchCollectionData', collections);

  // console.log('results are', userIdData, results)
  let context = {
    //postLogin:true,
    allottedHospitals: renderFunctions['readMoreCards'](results.HospitalAdmins?.data[0]?.allottedMissionHospitals || []),
    thoughtOfDay: results['Thought'].data[0]?.thoughts || '',
    weeklyManna: renderFunctions['weeklyMannaCard'](results['WeeklyManna'].data[0]),
    grandRounds: renderFunctions['grandRoundsCard'](results['GrandRounds'].data),
    renderedNews: renderFunctions['news'](results['NewsData'].data),
    whatsNew: renderFunctions['whatsNew'](results['WhatsNew'].data)

  }
  navigateTo('mission', context, ['statusCount', []])
  setTimeout(() => initWhatsNewCarousel(), 500);
}


async function statusCount() {
  try {
    const requestDefinitions = [
      { id: "networkConslt", collection: "NetConsltPatient", query: { isDeleted: false, status: 'Submitted' }, projection: { _id: 1 } },

    ];
    const results = await fetchCollectionData('fetchCollectionData', requestDefinitions);
    console.log('results are', results)
    document.getElementById('networkConslt').textContent = results?.data.length || ' ';

  } catch (error) {
    console.error("Error loading status of cards:", error);
  }
}

async function renderGuestHomePage() {
  var now = Date.now();
  var oneDay = 1000 * 60 * 60 * 24;
  var today = new Date(now - (now % oneDay));
  var tomorrow = new Date(today.valueOf() + oneDay);
  today.setHours(0, 0, 0, 0);
  tomorrow.setHours(0, 0, 0, 0);
  const collections = [
    { "collection": "NewsData", "query": { "newsDate": { "$gt": { "$date": new Date().toISOString() } }, 'newsEditorStatus': 'approved', 'newsTags.newsTagId': 'MSN', 'newsUserType.newsUserTypeName': { "$all": ["external user", "other"] }, isDeleted: 'false' }, projection: { _id: 1, newsDate: 1, newsTitle: 1, newsSubTitle: 1, newsImage: 1 }, "options": { "sort": { "newsDate": 1 } } },
    { "collection": "Thought", "query": { "tdate": { "$gte": { "$date": today.toISOString() }, "$lt": { "$date": tomorrow.toISOString() } }, "isDeleted": "false" }, "sort": { "tdate": -1 } },
    { "collection": "WhatsNew", "query": { isDeleted: false, showOnCarousel: 'yes', "showOn.Guest": true }, "options": { "sort": { 'added.addedDate': -1 } } }

  ];
  const results = await fetchedDataAPI('fetchCollectionData', collections);
  console.log('results are', results)
  let context = {
    thoughtOfDay: results['Thought'].data[0]?.thoughts || '',
    renderedNews: renderFunctions['news2'](results['NewsData'].data),
    whatsNew: renderFunctions['whatsNew'](results['WhatsNew'].data)

  }
  navigateTo('guestHome', context);
  setTimeout(() => initWhatsNewCarousel(), 500);

}


let missionHospitalImages;
async function renderMissionHospitalUser(msnHospId) {
  var collections = [
    { "collection": "FormIO", "query": { formKey: "externalMissionRequest" } },
    { "collection": "MissionHospital", "query": { _id: msnHospId, isDeleted: 'false' } },
    { "collection": "MissionRequests", "query": { missionHospitalId: msnHospId, isDeleted: 'false' } },
    { "collection": "MissionSpecializations", "query": { isDeleted: 'false' }, projection: { _id: 1, name: 1 } }
  ];
  //var formio =  { "collection": "FormIO", "query": { formKey: "externalMissionRequest" } };
  //const respFormio = await fetchCollectionData('fetchCollectionData', formio,true);// getting formio from local url
  //console.log("formio",respFormio);
  //var coll = { "collection": "MissionRequests", "query": { missionHospitalId: msnHospId, isDeleted: 'false' }, projection: { _id: 1, missionHospitalId: 1, specializationId: 1, missionStatus: 1, requestStatus: 1, requestType: 1, fromMsnHospDate: 1, toMsnHospDate: 1, misnExtupdateComments: 1 } };
  //const response = await fetchCollectionData('fetchCollectionData', coll,true);// getting missionrequests from local url
  //console.log("response",response);
  await fetchedDataAPI('fetchCollectionData', collections).then((fetchedResults) => {
    // console.log(fetchedResults, msnHospId);
    context = {
      formIO: fetchedResults['FormIO'].data[0],
      //formIO:respFormio,
      missionHospital: fetchedResults['MissionHospital'].data[0].missionHospitalName,
      msnHosp: fetchedResults['MissionHospital'].data[0],
      msnReqests: fetchedResults['MissionRequests'].data,
      //msnReqests: response,
      specialization: fetchedResults['MissionSpecializations'].data,
      specializationsTable: renderFunctions['cardTable'](fetchedResults['MissionHospital'].data[0].hospitalDepartments),
      statusCards: [
        {
          icon: '../images/handshake.svg',
          hospitalDetail: 'Best Matching Program',
          redirect: 'https://cmcbms.handcaudit.com/'
        },
        {
          icon: '../images/bed-pulse-solid.svg',
          infoLabel: 'Bed Strength',
          info: fetchedResults['MissionHospital'].data[0].hospitalBedStrength
        },
        {
          icon: '../images/stethoscope-simple.svg',
          infoLabel: 'status',
          info: fetchedResults['MissionHospital'].data[0].hospitalFunctional ? 'Functional' : 'Not functional'
        },
      ],
      galImages: fetchedResults['MissionHospital'].data[0].hospitalImages
    }
    //context.statusCardsData = arrayDataRenderInCard('readMoreCards', context.statusCards)
    context.statusCardsData = renderFunctions['readMoreCards'](context.statusCards)
    //context.galleryTable = arrayDataRenderInCard('imgArray', {images:fetchedResults['MissionHospital'].data[0].hospitalImages,hspName:fetchedResults['MissionHospital'].data[0].missionHospitalName}),
    context.galleryTable = renderFunctions['imgArray']({ images: fetchedResults['MissionHospital'].data[0].hospitalImages, hspName: fetchedResults['MissionHospital'].data[0].missionHospitalName }),
      navigateTo('missionHospitalUser', context, [
        ['locateMap', ['contactMap', [context.msnHosp._id]]],
        ['datatablesMsqLoad', [context]],
        ['loadLegalHelpDataTable', [msnHospId]],
        ['loadFinanceDataTable', [msnHospId]]
      ]);
    missionHospitalImages = context.galImages;
  })
}

async function renderHospitalDetails(msnHospId, fromPage) {

  const pageConfigs = {
    contactMap: {
      collections: [
        { collection: "MissionHospital", query: { _id: msnHospId, isDeleted: 'false' } },
        { collection: "MissionRequests", query: { missionHospitalId: msnHospId, isDeleted: 'false' }, projection: { _id: 1, missionHospitalId: 1, specializationId: 1, missionStatus: 1, requestStatus: 1, requestType: 1, fromMsnHospDate: 1, toMsnHospDate: 1, misnExtupdateComments: 1 } },
        { collection: "MissionSpecializations", query: { isDeleted: 'false' }, projection: { _id: 1, name: 1 } }
      ],
      back: "navigateTo('contact', { postLogin: true, currPage: 'renderPostHomePage()', role: 'Missions' }, ['loadHospitalIdsAndMap']);"
    },
    msnHsptlMap: {
      collections: [
        { collection: "MissionHospital", query: { _id: msnHospId, isDeleted: 'false' } },
        { collection: "MissionSpecializations", query: { isDeleted: 'false' } }
      ],
      back: "navigateTo('mmService', {}, ['loadMmServicePage']);"
    },
    msnVisitMap: {
      collections: [
        { collection: "MissionHospital", query: { _id: msnHospId, isDeleted: 'false' } },
        { collection: "MissionSpecializations", query: { isDeleted: 'false' } }
      ],
      back: "navigateTo('missionVisits', ' ',[['msnVisitManPowerTable'], ['loadNotesFromJourney']]);"
    },
    conclaveHsptlMap: {
      collections: [{ collection: "ConclaveHsptl", query: { _id: msnHospId, isDeleted: false } }],
      back: "navigateTo('academicConclave', {}, ['loadMap', ['conclaveHsptlMap']]);"
    }
  };

  const config = pageConfigs[fromPage] || { collections: [], back: "navigateTo('home')" };

  try {
    const fetchedResults = await fetchedDataAPI('fetchCollectionData', config.collections);

    const msnData = fetchedResults['MissionHospital']?.data?.[0];
    const conclaveData = fetchedResults['ConclaveHsptl']?.data?.[0];
    const activeData = msnData || conclaveData || {};

    const context = {
      missionHospital: activeData.missionHospitalName || activeData.hospitalName || 'Hospital Name not available',
      msnHosp: activeData,
      msnReqests: fetchedResults['MissionRequests']?.data || [],
      specialization: fetchedResults['MissionSpecializations']?.data || [],
      specializationsTable: renderFunctions['cardTable'](activeData.hospitalDepartments || []),
      statusCards: [
        {
          icon: '../images/bed-pulse-solid.svg',
          infoLabel: 'Bed Strength',
          info: activeData.hospitalBedStrength || 'Data not available'
        },
        {
          icon: '../images/stethoscope-simple.svg',
          infoLabel: 'Status',
          info: msnData ? (msnData.hospitalFunctional ? 'Functional' : 'Not functional') : 'Functional'
        }
      ],
      galImages: activeData.hospitalImages || [],
      currPage: config.back
    };

    context.statusCardsData = renderFunctions['readMoreCards'](context.statusCards);
    context.galleryTable = renderFunctions['imgArray']({
      images: context.galImages,
      hspName: context.missionHospital
    });

    navigateTo('missionHospitalDetails', context, [
      ['locateMap', [fromPage, [activeData._id]]]
    ]);

    missionHospitalImages = context.galImages;

  } catch (error) {
    console.error("Error fetching hospital details:", error);
  }
}

let menteeInstructions = ''
async function renderMenteePage() {
  var collections = [
    { "collection": "MissionsInstructions", "query": { status: 'Active' }, projection: { instructionsForMentees: 1, } },
    {
      "collection": "MenteeRole", "query": { isDeleted: false, menteeUserEmail: usrDetails.data.emails[0].address },
      projection: {
        _id: 1, menteeRoleStatus: 1, menteeUserName: 1, menteeUserId: 1, menteeUserEmail: 1, course: 1, aboutme: 1, uploadStudentImage: 1,
        "careerCallingMentors._id": 1,
        "careerCallingMentors.mentorUserName": 1,
        "othersMentors._id": 1,
        "othersMentors.mentorUserName": 1,
        "spiritualMentors._id": 1,
        "spiritualMentors.mentorUserName": 1
      }
    },
  ];
  const fetchedResults = await fetchedDataAPI('fetchCollectionData', collections);
  menteeInstructions = fetchedResults['MissionsInstructions']?.data[0]?.instructionsForMentees || 'No instructions available';
  const allMentorsMap = new Map(); // To track unique mentors by _id
  function processMentors(mentors, type) {// Helper function to process mentors and add to the map
    mentors.forEach(mentor => {
      if (allMentorsMap.has(mentor._id)) {
        // If mentor already exists, add only  typeOfMentorship
        allMentorsMap.get(mentor._id).typeOfMentorship.push(type);
      } else {
        // Add new mentor with typeOfMentorship
        allMentorsMap.set(mentor._id, { ...mentor, typeOfMentorship: [type] });
      }
    });
  }
  // Process each type of mentors
  processMentors(fetchedResults['MenteeRole'].data[0]?.careerCallingMentors || [], { 'careerCalling': 'Career Calling' });
  processMentors(fetchedResults['MenteeRole'].data[0]?.othersMentors || [], { 'others': 'Others' });
  processMentors(fetchedResults['MenteeRole'].data[0]?.spiritualMentors || [], { 'spiritual': 'Spiritual' });
  const allMentors = Array.from(allMentorsMap.values());//Convert map values to an arrayall mentors without repetiton

  const mentorQueryDetails = {
    "collection": "MentorRole",
    query: {
      isDeleted: false,
      _id: { $in: allMentors.map((mentor) => mentor._id) }
    },
    projection: { mentorUserId: 1, city: 1, mentorUserEmail: 1, avatar: 1, mentorUserName: 1, pincode: 1, state: 1, mentorRoleStatus: 1, aboutme: 1 }
  }
  const mentorDetails = await fetchCollectionData('fetchCollectionData', mentorQueryDetails)
  mentorDetails.data = mentorDetails.data.map((mentor) => { //text rendering issues solving
    if (mentor.aboutme) {
      mentor.aboutme = mentor.aboutme.replace(/"/g, "'");
    }
    return mentor;
  });
  const combinedMentors = allMentors.map(mentor => {
    // Merging matching mentorDetails with current allMentors
    const matchingMentorDetails = mentorDetails.data.find(
      detail => detail.mentorUserName === mentor.mentorUserName
    );
    return {
      mentor: true, // Adding mentor flag
      ...mentor,
      ...(matchingMentorDetails || {}),
      mentorId: mentor._id,
      menteeId: fetchedResults['MenteeRole'].data[0]._id,
      menteeUserId: fetchedResults['MenteeRole'].data[0].menteeUserId,
      menteeUserName: fetchedResults['MenteeRole'].data[0].menteeUserName,
      course: fetchedResults['MenteeRole'].data[0].course,
      batch: fetchedResults['MenteeRole'].data[0].batch,
      menteeUserEmail: fetchedResults['MenteeRole'].data[0].menteeUserEmail,
      college: fetchedResults['MenteeRole'].data[0].college
    };
  });
  // combinedMentors[0].mentorRoleStatus='Former'
  combinedMentors.sort((a, b) => { //Sort mentor to show all current mentors on top
    if (a.mentorRoleStatus === 'Current' && b.mentorRoleStatus === 'Former') return -1;
    if (a.mentorRoleStatus === 'Former' && b.mentorRoleStatus === 'Current') return 1;
    return 0;
  });
  let context = {
    userType: 'Mentee',
    menteeId: fetchedResults['MenteeRole'].data[0]?._id,
    cardData: {
      menteeInstruction: fetchedResults['MissionsInstructions']?.data[0]?.instructionsForMentees || 'No instructions available',
      menteeAvatar: fetchedResults['MenteeRole']?.data[0]?.uploadStudentImage[0]?.thumbnailurl || './images/user.svg',
      menteeName: fetchedResults['MenteeRole']?.data[0]?.menteeUserName || 'updating',
      menteeCourse: fetchedResults['MenteeRole']?.data[0]?.course || 'updating',
      mentorList: renderFunctions.cardList(combinedMentors, 'mentor'),
    }
  }
  navigateTo('mentee', context, [
    ['datatablesMyMeetings', [
      '#formTableallMeetings',
      {
        isDeleted: false,
        "mentee.menteeId": fetchedResults['MenteeRole']?.data[0]._id
      },
      'mentor.mentorUserName'
    ]]
  ]);

}
let mentorInstructions = ''
async function renderMentorPage() {
  var collections = [
    { "collection": "MissionsInstructions", "query": { status: 'Active' }, projection: { instructionsForMentor: 1, } },
    { "collection": "MentorRole", "query": { mentorUserEmail: usrDetails.data.emails[0].address, mentorRoleStatus: 'Current' }, projection: { _id: 1, city: 1, mentorRoleStatus: 1, mentorUserEmail: 1, mentorUserId: 1, mentorUserName: 1, pincode: 1, state: 1, typeOfMentorship: 1, uploadFacultyImage: 1 } },
  ];
  const fetchedResults = await fetchedDataAPI('fetchCollectionData', collections)
  mentorInstructions = fetchedResults['MissionsInstructions']?.data[0]?.instructionsForMentor || 'No instructions available';
  const typeOfMentorship = await fetchedResults['MentorRole']?.data[0]?.typeOfMentorship || [];
  const menteeQuery = {
    collection: "MenteeRole",
    query: {
      isDeleted: false,
      $or: typeOfMentorship.map((type) => ({
        [`${type}Mentors.mentorUserName`]: fetchedResults['MentorRole']?.data[0]?.mentorUserName
      })), menteeRoleStatus: "Current"
    },
    projection: { _id: 1, menteeRoleStatus: 1, menteeUserName: 1, menteeUserId: 1, menteeUserEmail: 1, aboutme: 1, avatar: 1, batch: 1, course: 1, college: 1, phoneNumber1: 1 }
  };

  const menteeList = await fetchCollectionData('fetchCollectionData', menteeQuery)//fetch mentees
  menteeList.data = menteeList.data.map((mentee) => { //text rendering issues solving
    if (mentee.aboutme) {
      mentee.aboutme = mentee.aboutme.replace(/"/g, "'");
    }
    return mentee;
  });
  menteeList.data.sort((a, b) => {
    if (a.menteeRoleStatus === 'Current' && b.menteeRoleStatus === 'Former') return -1;
    if (a.menteeRoleStatus === 'Former' && b.menteeRoleStatus === 'Current') return 1;
    return 0;
  });
  const menteeData = menteeList.data.map((mentee) => ({
    'mentee': true, //adding mentee flag
    menteeId: mentee._id,// renaming _id to menteeId
    mentorId: fetchedResults['MentorRole'].data[0]._id, // adding mentorId
    ...mentee,
    ...fetchedResults['MentorRole'].data[0]
  }));
  function formatMentorshipTypes(types) {
    if (!types || !Array.isArray(types)) return "updating";
    return types
      .map(item =>
        item === 'careerCalling'
          ? 'Career Calling'
          : item.charAt(0).toUpperCase() + item.slice(1)
      )
      .join(" | ");
  }
  let context = {
    userType: "Mentor",
    mentorId: fetchedResults["MentorRole"].data[0]?._id,
    cardData: {
      mentorInstruction: fetchedResults['MissionsInstructions']?.data[0]?.instructionsForMentor || 'No instructions available',
      mentorAvatar: fetchedResults['MentorRole']?.data[0]?.uploadFacultyImage?.[0]?.thumbnailurl || './images/user.svg',
      mentorName: fetchedResults['MentorRole']?.data[0]?.mentorUserName || 'updating',
      mentorCourse: formatMentorshipTypes(fetchedResults['MentorRole']?.data[0]?.typeOfMentorship),
      menteeList: renderFunctions.cardList(menteeData)
    }
  }
  navigateTo('mentor', context, [
    ['datatablesMyMeetings', [
      '#formTableallMeetings',
      {
        isDeleted: false,
        "mentor.mentorId": fetchedResults['MentorRole']?.data[0]._id
      },
      'mentee.menteeUserName'
    ]]
  ]);
}

const processImage = async (image, userId, dbName) => {
  if (!image.url.includes(",")) {
    // Already a valid URL just ship
    console.warn("Skipping non-base64 image:", image.url);
    return image;
  }

  const base64String = image.url.split(",")[1];
  const extension = image.name.split(".").pop();
  const imageKey = `${dbName}/${userId}.${extension}`;
  const uploadedUrl = await uploadToS3(base64String, imageKey);

  if (!uploadedUrl) return image;

  const thumbnailKey = `${dbName}/${userId}_thumbnail.${extension}`;
  const uploadedThumbnailUrl = await uploadToS3(base64String, thumbnailKey, true);

  return {
    ...image,
    url: uploadedUrl,
    thumbnailurl: uploadedThumbnailUrl,
  };
};

async function generateThumbnail(url, type) {
  return `./images/icons/${type.toLowerCase()}.png`;
}
function instructionHandler(userType) {
  openModal("instructions", "", { userType: userType, userData: (userType === "Mentor" ? mentorInstructions : menteeInstructions) })
}
async function renderLoadResources(keyname, redirectFun) {
  //stream loading
  console.log("renderLoadResources");
  const streamQuery = {
    collection: "MissionsStream",
    query: { isDeleted: "false" },
    projection: { _id: 1, code: 1, name: 1 }
  };
  const streamsData = await fetchCollectionData('fetchCollectionData', streamQuery)
  const streamCards = streamsData.data.length
    ? await Promise.all(
      streamsData.data.map(async (stream) => {
        const thumbnail = await generateThumbnail('', stream.code);
        return renderFunctions.nameCard({ ...stream, redirectFun, thumbnail });
      })
    ).then(cards => cards.join('')) // Combine all cards into a single string
    : '';
  const context = {
    streamCards,
    redirectFun,
  };
  navigateTo(keyname, context, ["learningResourceSearch", []]); // searching of learning resources globally
}
async function learningResourceSearch(streamId = null) {
  const closeSearchBtn = document.getElementById('closeSearch')
  const resource = document.getElementById('resource')
  const mainresource = document.getElementById('mainResources')
  const archiveresource = document.getElementById('archivedResource')
  const resourceFilter = document.getElementById('resourceFilter')
  document.getElementById('allResourceFilter').addEventListener('input', async function () {
    const filterKeyword = this.value.toLowerCase();
    if (filterKeyword.length >= 3) {
      resourceFetch(streamId, 0, 0, filterKeyword)
        .then(async (resp) => {
          const updatedData = await Promise.all(
            resp.map(async (item) => ({
              ...item,
              thumbnail: await generateThumbnail(item.url, item.type),
            })),
          );
          console.log('resp for keyword', filterKeyword, updatedData)
          resourceFilter.innerHTML = updatedData.map((item) => renderFunctions.resourcesCard(item)).join('');
          // Hide the main content
          closeSearchBtn.style.display = "inline-block";
          [resource, mainresource, archiveresource].forEach((el) => {
            if (el) el.classList.add("d-none");
          });
          // Update the search results   
          resourceFilter.classList.replace('h-0', 'h-auto');
        })
    } else {
      // Reset to the main content
      closeSearchBtn.style.display = 'none';
      // Clear the search results
      resourceFilter.innerHTML = '';
      resourceFilter.classList.replace('h-auto', 'h-0');
      [resource, mainresource, archiveresource].forEach(el => {
        if (el) el.classList.remove('d-none');
      });
    }
  });
  // Function to clear the search field when close button is clicked
  document.getElementById("closeSearch").addEventListener("click", function () {
    // Reset to the main content
    resourceFilter.innerHTML = '';
    closeSearchBtn.style.display = 'none';
    [resource, mainresource, archiveresource].forEach(el => {
      if (el) el.classList.remove('d-none');
    });
    resourceFilter.classList.replace("h-auto", "h-0");
    document.getElementById("allResourceFilter").value = "";
  });
}
const initialRLimit = 40; // Number of resources to fetch initially
const scrollRLimit = 4; // Number of resources to fetch on each scroll
let skipR = initialRLimit;
async function resourceFetch(streamId = null, limit, skip = 0, searchKey) {
  const query = { isDeleted: false };
  if (streamId) {
    query.stream = { $elemMatch: { _id: streamId } };
  }
  if (searchKey) {
    query.$or = [
      { title: { $regex: searchKey, $options: "i" } },
      { metaTags: { $regex: searchKey, $options: "i" } },
    ];
  }
  const resourceDQuery = {
    collection: "LearningResources",
    query,
    projection: { Date: 1, stream: 1, resourceLink: 1, resourcePerson: 1, type: 1, typeId: 1, subType: 1, metaTags: 1, title: 1 },
    options: { limit, skip, "sort": { "Date": -1 } }
  };
  //  return await fetchCollectionData('fetchCollectionData', resourceDQuery,true)
  // //  .then((resp) => resp.data);
  //  .then((resp) =>resp);
  results = await fetchCollectionData("fetchCollectionData", resourceDQuery);
  // results.data.forEach(item => {console.log(item._id); item.stream.forEach(stream=>{console.log(stream._id,stream.code)})})
  console.log("lim", limit, "skip", skip, results);
  return results.data;
}
async function loadMoreResource(streamId) {
  try {
    console.log("loadMoreResource", skipR);
    const newResources = await resourceFetch(streamId, scrollRLimit, skipR);
    if (newResources.length > 0) {
      skipR += newResources.length;
      const pResources = await Promise.all(
        newResources.map(async (item) => ({
          ...item,
          thumbnail: await generateThumbnail(item.url, item.type),
        }))
      );
      // Generate and append the new content
      const newContent = pResources.map(item => renderFunctions.resourcesCard(item)).join('');
      document.getElementById('archivedOnFetch').innerHTML += newContent;
    } else {
      console.log("No more resources to load.");
    }
  } catch (error) {
    console.error("Error loading more resources:", error);
  }

}
async function detailResources(streamId, streamName, streameCode, redirectFun, thumb) {//initial fetching of all resources
  console.log('detailResources', streamId, streamName, streameCode, redirectFun, thumb)
  skipR = initialRLimit;
  //  console.log('streamId',streamId,'streamName',streamName,streameCode)
  const resources = await resourceFetch(streamId, initialRLimit);
  let latestResource, topResource, recentResource, archivedResource;
  if (resources.length) {
    const pResources = await Promise.all(
      resources.map(async (item) => ({
        ...item,
        thumbnail: await generateThumbnail(item.url, item.type),
      })),
    );
    latestResource = pResources.slice(0, 5).map(item => renderFunctions.latestResourceCard(item)).join('');
    topResource = pResources.slice(5, 10).map(item => renderFunctions.topResourceCard(item)).join('');
    recentResource = pResources.slice(10, 15).map(item => renderFunctions.recentResourceCard(item)).join('');
    archivedResource = pResources.slice(15,).map(item => renderFunctions.resourcesCard(item)).join('');
  }
  const context = {
    latestResource,
    topResource,
    recentResource,
    archivedResource,
    streamName, streameCode, thumb,
    redirectFun
  }
  navigateTo('detailedResources', context, [
    ['learningResourceSearch', [streamId]], // searching of learning resources for a specific stream
    ['setupInfiniteScroll', ['resource', streamId]],
  ]);
}

async function loadSubcard(keyname, url, redirectFun) {
  if (keyname === 'doddLibrary' || keyname === 'eqas') {
    //  openModal("popUpWindow",'',{title: keyname, url: url});
    openUrlPopup(url);
  }
  else if (keyname === 'manpowerRequest' || keyname === 'learningResources' || keyname == 'legalHelp' || keyname == 'equipment') {
    if (keyname === 'manpowerRequest') {
      var collections = [
        { "collection": "MissionHospital", "query": { isDeleted: 'false' }, projection: { _id: 1, missionHospitalName: 1 } },
        { "collection": "MissionRequests", "query": { isDeleted: 'false', "missionStatus": { $in: ['Open', 'InProgress'] } }, projection: { _id: 1, missionHospitalId: 1, selectedLinkedDepartments: 1, specializationId: 1, fromMsnHospDate: 1, toMsnHospDate: 1, missionStatus: 1, requestStatus: 1 } },
        { "collection": "MissionSpecializations", "query": { isDeleted: 'false' }, projection: { _id: 1, name: 1 } }
      ]
      let context = {};
      await fetchedDataAPI('fetchCollectionData', collections)
        .then((fetchedData) => {
          context = {
            msnHosps: fetchedData["MissionHospital"].data,
            msnSpecs: fetchedData["MissionSpecializations"].data,
            missionRequests: fetchedData["MissionRequests"].data,
            missionSpecialization: fetchedData["MissionSpecializations"].data,
          };
          navigateTo(keyname, {}, ["datatablesMsnLoad", [context]]);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    }
    else if (keyname == 'equipment') {
      navigateTo('equipment', {}, ['loadAssets', []]);
    } else if (keyname == 'legalHelp') {
      navigateTo('legalHelp', {}, ['loadLegalHelpDataTable', []]);
    }
    else {
      console.log('redirectFun', redirectFun)
      navigateTo(keyname, {}, ['renderLoadResources', [keyname, redirectFun]]);
    }
  }
  else if (keyname === 'dls') {
    window.open('https://s3.amazonaws.com/img.studenthub.in/CMCVConnect_Portal/Pictures/_16b948137046166a5897731aa4ad2497_Pictures.pdf', 'Popup', 'width=800,height=600');
  }
  else if (keyname === 'weeklyManna') {
    navigateTo('finance', {}, ['loadFinanceDataTable', []]);
  }
  else if (keyname === 'libraryAccess') {
    navigateTo('libraryAccess', {}, ['loadLibraryAccessForm', []]);
  }
  else if (keyname === 'research') {
    navigateTo('research', {}, ['loadResearchCards', []]);
  }
  else if (keyname === 'shiloh') {
    console.log(keyname);
    navigateTo(keyname, {}, []);
  }
  else if (keyname === 'connectNewsletter') {
    console.log(keyname);
    navigateTo(keyname, {}, ['loadNewsletterCards', []]);
  }
  else {
    openModal(keyname)

  }
}

function openUrlPopup(url) {
  window.open(url, "Popup", "width=800,height=600");
}

//pdf functions
// let pdfDoc = null;
// let pageNum = 1;
// let pageRendering = false;
// let pageNumPending = null;
// let scale = 1.0; // Initial scale
// function loadPdf(pdfUrl) {
//   const pdfViewer = document.getElementById('pdfViewer');
//   // Load PDF and initialize first page rendering
//   pdfjsLib.getDocument(pdfUrl).promise.then(function (doc) {
//     pdfDoc = doc;
//     document.getElementById('page_count').textContent = pdfDoc.numPages;
//     initializeScaleToFitWidth();
//     renderPage(pageNum);
//   });
// }
// function initializeScaleToFitWidth() {
//   const pdfViewer = document.getElementById('pdfViewer');
//   const containerWidth = pdfViewer.clientWidth;
//   pdfDoc.getPage(1).then(function (page) {
//     const viewport = page.getViewport({ scale: 1 });
//     const pageWidth = viewport.width;
//     scale = containerWidth / pageWidth;
//   });
// }
// function downloadPdf() {
//   if (!pdfDoc) {
//     console.error("PDF document is not loaded.");
//     return;
//   }

//   pdfDoc.getData().then(function (data) {
//     const blob = new Blob([data], { type: 'application/pdf' });
//     const url = window.URL.createObjectURL(blob);
//     const a = document.createElement('a');
//     a.style.display = 'none';
//     a.href = url;
//     a.download = 'document.pdf';
//     document.body.appendChild(a);
//     a.click();
//     window.URL.revokeObjectURL(url);
//   }).catch(function (error) {
//     console.error('Error downloading PDF:', error);
//   });
// }
// function handlePageInput(event) {
//   if (event.key === 'Enter') {
//     const pageNumInput = parseInt(event.target.value, 10);

//     if (pageNumInput > 0 && pageNumInput <= pdfDoc.numPages) {
//       pageNum = pageNumInput;
//       queueRenderPage(pageNum);
//     } else {
//       alert(`Please enter a page number between 1 and ${pdfDoc.numPages}.`);
//       event.target.value = pageNum;
//     }
//   }
// }
// function renderPage(num) {
//   const pdfViewer = document.getElementById('pdfViewer');
//   pageRendering = true;
//   pdfDoc.getPage(num).then(function (page) {
//     const viewport = page.getViewport({ scale });
//     const canvas = document.createElement('canvas');
//     const ctx = canvas.getContext('2d');
//     canvas.height = viewport.height;
//     canvas.width = viewport.width;
//     const renderContext = {
//       canvasContext: ctx,
//       viewport: viewport
//     };

//     pdfViewer.innerHTML = '';
//     pdfViewer.appendChild(canvas);

//     page.render(renderContext).promise.then(() => {
//       pageRendering = false;
//       if (pageNumPending !== null) {
//         renderPage(pageNumPending);
//         pageNumPending = null;
//       }
//     });
//   });

//   document.getElementById('page_num').textContent = pageNum;
// }
// function queueRenderPage(num) {
//   if (pageRendering) {
//     pageNumPending = num;
//   } else {
//     renderPage(num);
//   }
// }
// function onPrevPage() {
//   console.log("previous page clicked", document.getElementById('page_num').textContent)
//   if (pageNum <= 1) {
//     return;
//   }
//   pageNum--;
//   queueRenderPage(pageNum);
// }
// function onNextPage() {
//   console.log("next page clicked",)
//   pageNum = document.getElementById('page_num').textContent
//   if (pageNum >= pdfDoc.numPages) {
//     return;
//   }
//   pageNum++;
//   queueRenderPage(pageNum);
// }
// function zoomIn() {
//   scale += 0.1;
//   queueRenderPage(pageNum);
// }
// function zoomOut() {
//   if (scale <= 0.2) { // Limit minimum zoom out scale
//     return;
//   }
//   scale -= 0.1;
//   queueRenderPage(pageNum);
// }

//header active tab control
let activeTabId = null;
function activateTab(tabId) {
  // Remove active class from all tabs
  const allTabs = document.querySelectorAll("[data-tab]");
  allTabs.forEach((el) => el.classList.remove("active"));

  // Add active class to the clicked tab and matching content
  const newActiveTabs = document.querySelectorAll(`[data-tab="${tabId}"]`);
  newActiveTabs.forEach((el) => el.classList.add("active"));

  // Save to sessionStorage
  sessionStorage.setItem("activeTabId", tabId);
  activeTabId = tabId;
}
const GUIDE_DEMOS = {
  'mms-open': {
    title: 'How to open the MMS page',
    body: `
      <div class="alert alert-warning py-2 px-3 small mb-3">
        <i class="fa-solid fa-circle-info me-1"></i>
        The <strong>Mission Engagement</strong> menu — and the MMS page inside it — only shows up
        for <strong>faculty</strong> accounts. If you don't see it in your navbar, you're signed in
        as a different user type.
      </div>

      <h6 class="fw-bold mb-2">On desktop</h6>
      <ol class="mb-4">
        <li class="mb-2">Sign in, then look at the <strong>top navigation bar</strong>.</li>
        <li class="mb-2">Click <strong>Mission Engagement</strong> — it's a dropdown, next to the other menu
          links (Council, Mission Mentors, Mission Mentees).</li>
        <li class="mb-2">From the menu that opens, click <strong>MMS</strong> — it's the first item, above
          "Mission Visits" and "Mission Sabbatical".</li>
        <li>The MMS page loads in the panel below the header.</li>
      </ol>

      <p class="text-muted small mb-2">What you'll click (recreated from the live menu):</p>
      <div class="border rounded-3 p-3 mb-4 bg-light">
        <div class="d-inline-block bg-primarycolor rounded-2 p-2">
          <span class="text-white px-2 py-1">Mission Engagement <i class="fa-solid fa-caret-down ms-1"></i></span>
          <div class="bg-white rounded-2 shadow-sm mt-1 py-1" style="min-width:200px;">
            <div class="px-3 py-2 rounded-1 d-flex align-items-center" style="background-color:#d2652d;color:#fff;font-weight:600;">
              <i class="fa-solid fa-hand-pointer me-2"></i> MMS
            </div>
            <div class="px-3 py-2 text-dark">Mission Visits</div>
            <div class="px-3 py-2 text-dark">Mission Sabbatical</div>
          </div>
        </div>
      </div>

      <h6 class="fw-bold mb-2">On mobile</h6>
      <ol class="mb-4">
        <li class="mb-2">Tap the <strong>&#8942;</strong> (three-dot) icon at the top-right of the header.</li>
        <li class="mb-2">Tap <strong>Mission Engagement</strong> to expand it.</li>
        <li>Tap <strong>MMS</strong>.</li>
      </ol>

      <h6 class="fw-bold mb-2">Once you're on the MMS page</h6>
      <p class="mb-1">You'll see your MMS dashboard — a chart of your completed visits, your
        approved/pending visit status, and a list of previous visits.</p>
      <p class="mb-0 text-muted small">Next step — starting a new application with the
        <strong>Apply Here</strong> button — will be added to this guide soon.</p>
    `
  }
};

function openGuideDemo(key) {
  const demo = GUIDE_DEMOS[key];
  if (!demo) return;
  const titleEl = document.getElementById('guideDemoTitle');
  const bodyEl = document.getElementById('guideDemoBody');
  if (!titleEl || !bodyEl) return;
  titleEl.textContent = demo.title;
  bodyEl.innerHTML = demo.body;
  const modal = new bootstrap.Modal(document.getElementById('guideDemoModal'));
  modal.show();
}

//Guide page script strats
function loadGuidePage() {
  // Placeholder hook, called after views/guidePage.html is injected into #content
  // (see navigateTo('guidePage', {}, ['loadGuidePage']) in the guideBtn/guideBtnmb
  // links above). Nothing to fetch yet — every tile's content is static — but this
  // keeps the page wired into the same navigateTo/loadPage callback convention as
  // every other page, ready for future per-tile setup (e.g. progress tracking).
}
//Guide page script ends

async function loadMmServicePage() {
  const user = usrDetails?.data?.profile || {};
  $(".userName").text("Dear Dr. " + user.name);
  $(".deptName").text("Past " + user.department + " Visits");

  const departmentId = user.departmentId || "";
  const processHospitalList = (data) => {
    return data
      .flatMap((doc) => doc.allottedMissionHospitals || [])
      .filter((h) => h.hospitalEligibleForMmp === "yes" && h.missionHospitals)
      .map((h) => ({
        hospitalName: h.missionHospitals?.missionHospitalName || "",
        hospitalId: h.missionHospitals?._id || "",
        contactPerson: h.contactPerson || "Details",
        contactNumber: h.contactNumber || "Details",
      }));
  };

  let hospitals = [];

  // Fetch Department Specific Hospitals
  if (departmentId) {
    const depCollection = {
      collection: "MmsDepHsptlAll",
      query: { departmentId: departmentId, isDeleted: false },
      projection: { allottedMissionHospitals: 1 }
    };
    const depMmsData = await fetchCollectionData('fetchCollectionData', depCollection);

    if (depMmsData?.data?.length) {
      hospitals = processHospitalList(depMmsData.data);
    }
  }

  // If no department specific data found (or no Dept ID), fetch All Hospitals
  if (hospitals.length === 0) {
    const allCollection = {
      collection: "MmsDepHsptlAll",
      query: { isDeleted: false },
      projection: { allottedMissionHospitals: 1 }
    };
    const allMmsData = await fetchCollectionData('fetchCollectionData', allCollection);

    if (allMmsData?.data?.length) {
      hospitals = processHospitalList(allMmsData.data);
    }
  }

  if (hospitals.length) {
    const hsptlIds = hospitals.map(h => h.hospitalId);
    loadMap('msnHsptlMap', hsptlIds, hospitals);
  }

  const collections = [{
    collection: "MmsApplication",
    query: { isDeleted: false },
  }, {
    collection: "MissionHospital",
    query: { isDeleted: 'false' },
  },
  ];

  const data = await fetchedDataAPI('fetchCollectionData', collections);
  let mmsAppData = data['MmsApplication']?.data;
  const missionHospitals = data['MissionHospital']?.data;
  console.log('fetchQuery for MmsApplication', mmsAppData);

  const hospitalStateMap = {};

  missionHospitals.forEach(h => {
    const state = h.hospitalState;

    hospitalStateMap[h._id] = state;
  });

  const stateCounts = {};
  const deptStateCounts = {};

  const mmsChartData = mmsAppData.filter(item => item.visitStatus === "completed");
  // console.log('mmsChartData', mmsChartData);
  mmsChartData.forEach(item => {
    const hospId = item.missionHospital?._id;
    const state = hospitalStateMap[hospId];

    if (!state) return;

    // Total users per state
    stateCounts[state] = (stateCounts[state] || 0) + 1;

    // Department-specific users
    // console.log('deptStateCounts', item.department, user.department);

    if (item.department === user.department || item.departmentId === user.departmentId) {
      deptStateCounts[state] = (deptStateCounts[state] || 0) + 1;
      // console.log('deptStateCounts', deptStateCounts);
    }
  });

  const states = Object.keys(stateCounts);

  const totalUsers = states.map(state => stateCounts[state] || 0);
  const deptUsers = states.map(state => deptStateCounts[state] || 0);

  const combinedData = states.map((state, i) => ({
    state,
    total: totalUsers[i],
    dept: deptUsers[i]
  }));

  combinedData.sort((a, b) => b.total - a.total);

  const sortedStates = combinedData.map(d => d.state);
  const sortedTotal = combinedData.map(d => d.total);
  const sortedDept = combinedData.map(d => d.dept);

  const totalVisits = sortedTotal.reduce((sum, value) => sum + value, 0);

  Chart.register(ChartDataLabels);

  new Chart("mmsUsersChart", {
    type: "bar",
    data: {
      labels: sortedStates,
      datasets: [
        {
          label: "Total Faculty Visit",
          data: sortedTotal,
          backgroundColor: "#091636",
          borderColor: "#091636",
          borderWidth: 1,
          datalabels: {
            anchor: 'end',
            align: 'top',
            color: '#091636',
            font: {
              weight: 'bold',
              size: 12
            },
            formatter: (value) => {
              const percentage = ((value / totalVisits) * 100).toFixed(1);
              return `${percentage}%`;
            }
          }
        },
        {
          label: user.department + " Faculty Visit",
          data: sortedDept,
          backgroundColor: "#ada05d",
          borderColor: "#ada05d",
          borderWidth: 1,
          datalabels: {
            anchor: 'end',
            align: 'top',
            color: '#ada05d',
            font: {
              weight: 'bold',
              size: 12
            },
            formatter: (value) => {
              const percentage = ((value / totalVisits) * 100).toFixed(1);
              return `${percentage}%`;
            }
          }
        }
      ]
    },
    options: {
      maintainAspectRatio: false,
      responsive: true,
      plugins: {
        legend: {
          display: true,
          position: 'top',
          labels: {
            boxWidth: 20,
            boxHeight: 20,
            font: {
              size: 16,
              weight: 'bold'
            }
          }
        },
        datalabels: {
          clamp: true
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          grace: '20%'
        }
      }
    },
    plugins: [ChartDataLabels]
  });
  mmsAppData = mmsAppData.filter(item => item.department === user.department || item.departmentId === user.departmentId);

  const userApplications = mmsAppData.filter(item => item.empNumber === user.employeeNo);

  const approvedPanel = document.getElementById("mmsApprovedPanel");
  if (!userApplications.length) {
    approvedPanel.innerHTML = "";
  }

  // Drafts
  const draftItems = userApplications.filter((item) => item.status === "draft");
  if (draftItems.length) {
    document.getElementById("draftMsg").innerHTML =
      '<div class="blink text-warning"> Please click here to continue your application.</div>';
  }

  // Approved/Submitted (Active Visits)
  const approvedList = userApplications.filter(item =>
    (item.status === "approved" || item.status === "submitted") &&
    (item.visitStatus !== "completed" && item.visitStatus !== "cancelled")
  );

  console.log("Approved active list:", approvedList);

  if (!approvedList.length) {
    approvedPanel.innerHTML = "";
    console.log("No approved active visits");
  } else {
    approvedList.forEach((item) => {
      item.formattedDates = {
        from: new Date(item.fromDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        to: new Date(item.toDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
      };
    });

    const activeHsptlIds = approvedList.map(item => item.missionHospital._id);

    const msnHsptlColl = {
      "collection": "MissionHospital",
      "query": { _id: { $in: activeHsptlIds }, isDeleted: "false" },
      projection: {
        hospitalImages: {
          $map: { input: "$hospitalImages", as: "image", in: { name: "$$image.name", url: "$$image.url" } }
        }
      }
    };

    const msnHsptlData = await fetchCollectionData(
      "fetchCollectionData",
      msnHsptlColl,
    );

    approvedList.forEach(item => {
      const hospitalRecord = msnHsptlData.data.find(hsp => hsp._id == item.missionHospital._id);
      item.hospitalImage = hospitalRecord?.hospitalImages?.[0] || { name: 'default.png', url: 'https://s3.amazonaws.com/img.studenthub.in/CMCVConnect_Portal/Pictures/_313ea5411cb9f9e319423cc9a033b275_Pictures.png' };
    });

    approvedPanel.innerHTML = `
  <h3 class="text-center mb-4"> <i class="fa-regular fa-star fa-2xl" style="color: #e9ce40"></i> Your Upcoming Visit</h3> 
  <div class="row g-4 justify-content-center align-items-center">
    ${approvedList.map((item) => renderFunctions.mmsApprovedCard(item)).join("")}
  </div>
`
    if (approvedList.length > 0) {
      openModal("mmsApprovedPanel", "", approvedList);
    }
    ;
    console.log("Approved panel rendered.");
  }

  // showing ALL completed visits for the department
  const completedList = mmsAppData.filter(item => item.visitStatus === 'completed' && item.numberOfDays !== null);
  const userDeptCompletedList = completedList.filter(item => item.empNumber === user.employeeNo);
  const collection2 = {
    collection: "MmsOtherVisit",
    query: { employeeNo: user.employeeNo, isDeleted: false },
  };
  const depMmsData2 = await fetchCollectionData(
    "fetchCollectionData",
    collection2,
  );
  const userOtherMmsVisits = depMmsData2.data || [];

  const userCompletedList = [...userDeptCompletedList, ...userOtherMmsVisits];
  // console.log('User completed visits:', userCompletedList);
  const preMmsContainer = document.getElementById("preMmsVisits");

  if (completedList.length > 0) {
    preMmsContainer.innerHTML = `<div class="row overflow-y-auto px-3" style="max-height: 300px;">
          ${renderFunctions.preMmsVisitsCard(completedList.slice(0, 5))}
       </div>
       <div class="text-center mt-3">
          <button class="btn secondary-bg-color text-white fw-medium" onclick="navigateTo('preMmsVisits', {}, ['loadPreMmsVisits', []]);">View More</button>
       </div>`;
  } else {
    preMmsContainer.innerHTML = `<div class="text-center p-3 border bg-white rounded-3">
         <h5 class="text-black">Our records show that you are the first person from your department.</h5>
       </div>`;
  }

  if (userDeptCompletedList.length > 0) {
    const collection = {
      collection: "MmsVisitComplt",
      query: { employeeNo: user.employeeNo, isDeleted: false },
    };

    const depMmsData = await fetchCollectionData(
      "fetchCollectionData",
      collection,
    );
    const mmsRecords = depMmsData.data || [];
    console.log("MMS Visit Completion Records:", mmsRecords);

    const confirmationData =
      mmsRecords.find((r) => r.reason === "confirmation") || null;
    const professorshipData =
      mmsRecords.find((r) => r.reason === "professorship") || null;

    const renderVisitSection = (data, title, id) => {
      console.log(`Rendering section for ${title}:`, data, "with id:", id);
      if (!data) return "";

      return `
        <div class="accordion-item bg-dark border-tan mb-3" style="border: 1px solid #ada05d; border-radius: 8px; overflow: hidden;">
            <h2 class="accordion-header" id="heading${id}">
                <button class="accordion-button collapsed bg-dark text-white fw-bold justify-content-between" type="button" 
                        data-bs-toggle="collapse" data-bs-target="#collapse${id}" aria-expanded="false" aria-controls="collapse${id}"
                        style="box-shadow: none;">
                    ${title} <i class="fa-solid fa-angle-down ms-5 icon-toggle"></i>
                </button>
            </h2>
            <div id="collapse${id}" class="accordion-collapse collapse" aria-labelledby="heading${id}">
                <div class="accordion-body text-start text-white p-3">
                    <p class="mb-2">Number of days you have finished your MMS : <span class="fw-bold rounded px-2" style="background-color: #ada05d;">${data.totalNumberOfDays}</span></p>
                    
                    ${data.completionCertificate
          ? `
                        <p class="mb-2">Download your MMS certificate here: 
                            <a href="${data.completionCertificate[0]?.url || "#"}" target="_blank" class="text-tan fw-bold fs-5 ms-2">
                                <i class="fa-solid fa-download"></i>
                            </a>
                        </p>`
          : ""
        }

                    <div class="row mt-3">
                        <div class="col-12 col-md-4">
                            <p>Past Visits:</p>
                        </div>
                        <div class="col-12 col-md-8 overflow-y-auto px-3" style="max-height: 150px;">
                        ${renderFunctions.userMmsVisitsCard(
          userCompletedList.filter((visit) =>
            data.visitedHospital?.some(
              (h) =>
                h.missionHospitalName ===
                visit.missionHospital?.missionHospitalName,
            ),
          ),
        )}
                        </div>
                    </div>
                </div>
            </div>
        </div>`;
    };

    document.getElementById("userMmsVisits").innerHTML = `
        <div class="col-md-9">
            <div class="accordion" id="mmsAccordion">
                ${renderVisitSection(confirmationData, "Visits for Confirmation", "Confirmation")}
                ${renderVisitSection(professorshipData, "Visits for Professorship", "Professorship")}
            </div>
        </div>`;
  }

  const mmsContainer = document.getElementById("userMmsVisits");

  mmsContainer.addEventListener('show.bs.collapse', function (e) {
    const button = e.target.previousElementSibling.querySelector('.accordion-button');
    const icon = button.querySelector('.icon-toggle');
    icon.classList.remove('fa-angle-down');
    icon.classList.add('fa-angle-up');
  });

  mmsContainer.addEventListener('hide.bs.collapse', function (e) {
    const button = e.target.previousElementSibling.querySelector('.accordion-button');
    const icon = button.querySelector('.icon-toggle');
    icon.classList.remove('fa-angle-up');
    icon.classList.add('fa-angle-down');
  });

  document.querySelectorAll(".step-card").forEach((card) => {
    card.addEventListener("click", () => {
      const step = card.parentElement;
      document.querySelectorAll(".flow-step").forEach((s) => {
        if (s !== step) s.classList.remove("active");
      });
      step.classList.toggle("active");
    });
  });
}

function enableNetConsltRolesPage() {
  // Reset page-load cache so data refreshes on each module visit
  Object.keys(loadedPages).forEach((k) => delete loadedPages[k]);

  initNcNavigation();

  const userRoles = usrDetails?.data?.roles || [];

  const roleMap = {
    requestPage: "NC Request",
    consultPage: "NC Consultant",
    nodalPage: "NC Nodal",
  };

  document.querySelectorAll(".nav-btn").forEach((item) => {
    const page = item.dataset.page;
    if (!roleMap[page]) return;
    item.classList.toggle("d-none", !userRoles.includes(roleMap[page]));
  });

  if (userRoles.includes("NC Request")) {
    document.getElementById("registrationTrigger").classList.add("d-none");
    document.getElementById("ncQuickRegister")?.classList.add("d-none");
  }
  // welcome name - same source loadNetConsltRegForm() pre-fills from
   const ncNameEl = document.getElementById("ncUserName");
   if (ncNameEl) ncNameEl.textContent = usrDetails?.data?.profile?.name || "";

  // Activate the first visible nav button automatically
  const firstVisible = document.querySelector(".nav-btn:not(.d-none)");
  if (firstVisible) firstVisible.click();
}

//Network consult starts

let _ncDashBusy = false;
let _ncDashData = null;   // last fetched rows, reused by the detail popups
 
async function loadNcDashboard(force = false) {
  if (_ncDashBusy) return;
  _ncDashBusy = true;
 
  if (force) ncDashSetLoading();
 
  try {
    const [patientsRes, appsRes, queriesRes, themesRes] = await Promise.all([
      fetchCollectionData('fetchCollectionData', {
        collection: 'NetConsltPatient',
        query: { isDeleted: false },
        projection: {
          patientId: 1, patientName: 1, patientStatus: 1, gender: 1, age: 1,
          patientRelatedThemeName: 1, instHsptlName: 1, added: 1
        },
        options: { sort: { 'added.addedDate': -1 } }
      }),
      fetchCollectionData('fetchCollectionData', {
        collection: 'NetConsltRegApp',
        query: { isDeleted: false },
        projection: {
          name: 1, designation: 1, status: 1, roles: 1, added: 1,
          cmcDepartments: 1, cmcUnit: 1, cmcUnits: 1,
          missionHospital: 1, hospitalName: 1, employeeNumber: 1
        }
      }),
      /* NetConsltPatientQuery is read through the ...FromDB endpoint with
         queryType:"standard" - the same call ncPatientQuery() makes. The
         plain endpoint returns a different envelope for this collection. */
      fetchCollectionData('fetchCollectionDataFromDB', {
        collection: 'NetConsltPatientQuery',
        query: { isDeleted: false },
        options: { sort: { 'added.addedDate': -1 } },
        queryType: 'standard'
      }),
      fetchCollectionData('fetchCollectionData', {
        collection: 'NetConsltTheme',
        query: { isDeleted: false },
        projection: { themeName: 1, description: 1 }
      })
    ]);
 
    /* envelopes differ per collection - ncRows() always yields an array */
    const patients = ncRows(patientsRes);
    const apps     = ncRows(appsRes);
    const queries  = ncRows(queriesRes);
    const themes   = ncRows(themesRes);
 
    // one document per visit -> collapse to the newest visit per patient
    const cases = ncLatestPerPatient(patients);
 
    /* keep the fetched rows so a KPI tile can open its detail list
       without going back to the API */
    _ncDashData = { visits: patients, cases: cases, apps: apps, queries: queries, themes: themes };
 
    ncRenderKpis(patients, cases, apps, queries, themes);
    ncRenderCaseStatus(cases);
    ncRenderAppStatus(apps);
    ncRenderThemeChart(cases, themes);
    ncRenderActivity(patients, queries);
 
  } catch (error) {
    console.error('Network Consults dashboard failed to load:', error);
    ncDashError();
  } finally {
    _ncDashBusy = false;
  }
}
 
/* ─── KPI tiles ──────────────────────────────────────────────────────── */
 
function ncRenderKpis(visits, cases, apps, queries, themes) {
 
  /* total cases */
  ncSetText('ncKpiTotalCases', cases.length);
  ncSetText('ncKpiTotalCasesFoot',
    visits.length + ' visit' + (visits.length === 1 ? '' : 's') + ' recorded');
 
  /* open questions */
  const open = queries.filter(q => !(q.answers && q.answers.length));
  ncSetText('ncKpiOpenQueries', open.length);
  const high = open.filter(q => q.questionTag === 'High').length;
  ncSetText('ncKpiOpenQueriesFoot',
    high ? high + ' marked High priority' : 'None at High priority');
 
  /* average time from question asked -> first answer */
  const gaps = [];
  queries.forEach(q => {
    const asked = ncDate(q.added && q.added.addedDate);
    if (!asked) return;
    const firstAnswer = (q.answers || [])
      .map(a => ncDate(a.added && a.added.addedDate))
      .filter(Boolean)
      .sort((a, b) => a - b)[0];
    if (firstAnswer && firstAnswer >= asked) gaps.push(firstAnswer - asked);
  });
  if (gaps.length) {
    const avg = gaps.reduce((sum, ms) => sum + ms, 0) / gaps.length;
    ncSetText('ncKpiResponse', ncDuration(avg));
    ncSetText('ncKpiResponseFoot',
      'across ' + gaps.length + ' answered question' + (gaps.length === 1 ? '' : 's'));
  } else {
    ncSetText('ncKpiResponse', '--');
    ncSetText('ncKpiResponseFoot', 'No answered questions yet');
  }
 
  /* registered consultants */
  const consultants = apps.filter(a =>
    (a.roles || []).some(r => (r && r._id ? r._id : r) === 'NC Consultant')).length;
  ncSetText('ncKpiConsultants', consultants);
  ncSetText('ncKpiConsultantsFoot',
    apps.length + ' registration' + (apps.length === 1 ? '' : 's') + ' in total');
 
  /* themes */
  ncSetText('ncKpiThemes', themes.length);
  const used = new Set(cases.map(c => (c.patientRelatedThemeName || '').trim()).filter(Boolean));
  ncSetText('ncKpiThemesFoot', used.size + ' with cases submitted');
 
  /* this month vs last month */
  const now        = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const prevStart  = new Date(now.getFullYear(), now.getMonth() - 1, 1);
 
  const inRange = (from, to) => cases.filter(c => {
    const d = ncDate(c.added && c.added.addedDate);
    return d && d >= from && (!to || d < to);
  }).length;
 
  const thisMonth = inRange(monthStart, null);
  const lastMonth = inRange(prevStart, monthStart);
 
  ncSetText('ncKpiMonthCases', thisMonth);
 
  const footEl = document.getElementById('ncKpiMonthCasesFoot');
  if (footEl) {
    if (!lastMonth && !thisMonth) {
      footEl.innerHTML = '<span class="kpi-chip neutral">No cases last month</span>';
    } else if (!lastMonth) {
      footEl.innerHTML = '<span class="kpi-chip up">New this month</span>';
    } else {
      const pct = Math.round(((thisMonth - lastMonth) / lastMonth) * 100);
      const cls = pct > 0 ? 'up' : (pct < 0 ? 'down' : 'neutral');
      const arrow = pct > 0 ? '&#9650;' : (pct < 0 ? '&#9660;' : '');
      footEl.innerHTML = '<span class="kpi-chip ' + cls + '">' + arrow + ' ' +
        Math.abs(pct) + '%</span> vs last month';
    }
  }
}
 
/* ─── Patient case status ────────────────────────────────────────────── */
 
const NC_CASE_STATES = [
  { key: 'New',      label: 'New / unassigned', cls: 'is-new' },
  { key: 'Pending',  label: 'Pending',          cls: 'is-pending' },
  { key: 'Allotted', label: 'Allotted',         cls: 'is-allotted' },
  { key: 'Referred', label: 'Referred',         cls: 'is-referred' }
];
 
function ncRenderCaseStatus(cases) {
  const counts = {};
  cases.forEach(c => {
    const key = c.patientStatus || 'New';   // nodal has not decided yet
    counts[key] = (counts[key] || 0) + 1;
  });
  ncPaintStatus('ncCaseStatusBar', 'ncCaseStatusLegend', 'ncCaseStatusMeta',
    NC_CASE_STATES, counts, cases.length, 'case');
}
 
/* ─── Registration applications ──────────────────────────────────────── */
 
const NC_APP_STATES = [
  { key: 'Submitted', label: 'Submitted', cls: 'is-pending' },
  { key: 'Approved',  label: 'Approved',  cls: 'is-allotted' },
  { key: 'Rejected',  label: 'Rejected',  cls: 'is-rejected' }
];
 
function ncRenderAppStatus(apps) {
  const counts = {};
  apps.forEach(a => {
    const key = a.status || 'Submitted';
    counts[key] = (counts[key] || 0) + 1;
  });
  ncPaintStatus('ncAppStatusBar', 'ncAppStatusLegend', 'ncAppStatusMeta',
    NC_APP_STATES, counts, apps.length, 'application');
}
 
/* Shared painter for both segmented bars. Any status value that is not
   in the known list is rolled into a neutral "Other" segment so nothing
   silently disappears from the totals. */
function ncPaintStatus(barId, legendId, metaId, states, counts, total, noun) {
  const bar    = document.getElementById(barId);
  const legend = document.getElementById(legendId);
  const meta   = document.getElementById(metaId);
 
  const known = states.map(s => s.key);
  const other = Object.keys(counts)
    .filter(k => known.indexOf(k) === -1)
    .reduce((sum, k) => sum + counts[k], 0);
 
  const rows = states
    .map(s => ({ label: s.label, cls: s.cls, value: counts[s.key] || 0 }))
    .filter(r => r.value > 0);
 
  if (other > 0) rows.push({ label: 'Other', cls: 'is-other', value: other });
 
  if (meta) meta.textContent = total ? total + ' ' + noun + (total === 1 ? '' : 's') : '';
 
  if (!total || !rows.length) {
    if (bar) bar.innerHTML = '';
    if (legend) legend.innerHTML = '<div class="nc-empty">No ' + noun + 's yet.</div>';
    return;
  }
 
  if (bar) {
    bar.innerHTML = rows.map(r =>
      '<div class="seg ' + r.cls + '" style="width:' + ((r.value / total) * 100) + '%" ' +
      'title="' + ncEsc(r.label) + ': ' + r.value + '"></div>'
    ).join('');
  }
 
  if (legend) {
    legend.innerHTML = rows.map(r =>
      '<div class="nc-legend-item">' +
        '<span class="nc-legend-dot ' + r.cls + '"></span>' +
        '<span class="lbl">' + ncEsc(r.label) + '</span>' +
        '<span class="pct">' + Math.round((r.value / total) * 100) + '%</span>' +
        '<span class="count">' + r.value + '</span>' +
      '</div>'
    ).join('');
  }
}
 
/* ─── Consults by theme ──────────────────────────────────────────────── */
 
function ncRenderThemeChart(cases, themes) {
  const el   = document.getElementById('ncThemeChart');
  const meta = document.getElementById('ncThemeChartMeta');
  if (!el) return;
 
  const counts = new Map();
  cases.forEach(c => {
    const name = (c.patientRelatedThemeName || '').trim() || 'Not specified';
    counts.set(name, (counts.get(name) || 0) + 1);
  });
 
  let rows = Array.from(counts.entries())
    .map(entry => ({ name: entry[0], value: entry[1] }))
    .sort((a, b) => b.value - a.value);
 
  if (meta) meta.textContent = themes.length + ' themes registered';
 
  if (!rows.length) {
    el.innerHTML = '<div class="nc-empty">No cases submitted yet.</div>';
    return;
  }
 
  // keep the chart readable: top 6, everything else rolled up
  const top = rows.slice(0, 6);
  const restCount = rows.length - top.length;
  const restTotal = rows.slice(6).reduce((sum, r) => sum + r.value, 0);
  if (restTotal) top.push({ name: 'Other (' + restCount + ')', value: restTotal });
 
  const max = Math.max.apply(null, top.map(r => r.value));
 
  el.innerHTML = top.map(r =>
    '<div class="nc-bar-row">' +
      '<span class="bar-label" title="' + ncEsc(r.name) + '">' + ncEsc(r.name) + '</span>' +
      '<span class="nc-bar-track">' +
        '<span class="nc-bar-fill" style="width:' +
          Math.max(4, Math.round((r.value / max) * 100)) + '%"></span>' +
      '</span>' +
      '<span class="bar-value">' + r.value + '</span>' +
    '</div>'
  ).join('');
}
 
/* ─── Recent activity ────────────────────────────────────────────────── */
 
function ncRenderActivity(visits, queries) {
  const el = document.getElementById('ncActivityFeed');
  if (!el) return;
 
  const items = [];
 
  visits.forEach(v => {
    const when = ncDate(v.added && v.added.addedDate);
    if (!when) return;
    const who = (v.added && v.added.userName) || 'A network doctor';
    const theme = v.patientRelatedThemeName ? ' (' + ncEsc(v.patientRelatedThemeName) + ')' : '';
    items.push({
      when: when,
      icon: 'fa-file-medical',
      tone: '',
      html: '<span class="who">Dr. ' + ncEsc(who) + '</span> submitted a case &mdash; ' +
            ncEsc(v.patientName || v.patientId || 'patient') + theme
    });
  });
 
  queries.forEach(q => {
    const asked = ncDate(q.added && q.added.addedDate);
    if (asked) {
      items.push({
        when: asked,
        icon: 'fa-circle-question',
        tone: q.questionTag === 'High' ? 'warn' : '',
        html: '<span class="who">Dr. ' + ncEsc((q.added && q.added.userName) || '-') + '</span> asked a ' +
              ncEsc(q.questionTag || 'new') + ' priority question on ' + ncEsc(q.patientId || 'a case')
      });
    }
    (q.answers || []).forEach(a => {
      const when = ncDate(a.added && a.added.addedDate);
      if (!when) return;
      items.push({
        when: when,
        icon: 'fa-reply',
        tone: 'good',
        html: '<span class="who">Dr. ' + ncEsc((a.added && a.added.userName) || '-') + '</span> answered a question on ' +
              ncEsc(q.patientId || 'a case')
      });
    });
  });
 
  if (!items.length) {
    el.innerHTML = '<div class="nc-empty">No activity recorded yet.</div>';
    return;
  }
 
  el.innerHTML = items
    .sort((a, b) => b.when - a.when)
    .slice(0, 6)
    .map(item =>
      '<div class="nc-activity-item">' +
        '<div class="nc-activity-icon ' + item.tone + '"><i class="fa-solid ' + item.icon + '"></i></div>' +
        '<div class="nc-activity-text">' + item.html + '</div>' +
        '<div class="nc-activity-time">' + ncTimeAgo(item.when) + '</div>' +
      '</div>'
    ).join('');
}
 
/* ─── Quick actions ──────────────────────────────────────────────────── */
 
function ncGoToPage(page) {
  const btn = document.querySelector('.nav-btn[data-page="' + page + '"]');
  if (!btn || btn.classList.contains('d-none')) {
    alert('This section opens once your Network Consults registration is approved.');
    return;
  }
  btn.click();
}
 
function ncNewPatient() {
  const btn = document.querySelector('.nav-btn[data-page="requestPage"]');
  if (!btn || btn.classList.contains('d-none')) {
    alert('Patient requests open once your Network Consults registration is approved.');
    return;
  }
  btn.click();
  openModal('formIO', null, 'Add Patient Request', null);
  ncPatientReqForm('add', null);
}
 
/* ─── Small helpers ──────────────────────────────────────────────────── */
 
/* Each visit is its own document sharing one patientId, so a "case" is
   the newest visit for that patientId. Documents arrive newest-first,
   so the first one seen wins. Visits with no patientId yet (the id is
   only assigned when a nodal marks the case Allotted) fall back to _id. */
function ncLatestPerPatient(visits) {
  const seen = new Set();
  const out = [];
  visits.forEach(v => {
    const key = v.patientId || v._id;
    if (seen.has(key)) return;
    seen.add(key);
    out.push(v);
  });
  return out;
}
 
/* The generic API does not return the same envelope for every collection:
   most give { data: [ ... ] }, but at least NetConsltPatientQuery returns
   an object. This pulls the row list out of whichever shape arrives and
   always hands back an array, so a render function can never be handed a
   non-array. */
function ncRows(res) {
  const payload = (res && res.data !== undefined) ? res.data : res;
 
  if (Array.isArray(payload)) return payload;
  if (!payload || typeof payload !== 'object') return [];
 
  if (Array.isArray(payload.data))   return payload.data;
  if (Array.isArray(payload.rows))   return payload.rows;
  if (Array.isArray(payload.result)) return payload.result;
  if (Array.isArray(payload.docs))   return payload.docs;
 
  const nested = Object.keys(payload).map(k => payload[k]).find(Array.isArray);
  if (nested) return nested;
 
  return payload._id ? [payload] : [];
}
 
function ncSetText(id, value) {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = value;
  el.classList.remove('is-loading');
}
 
/* Accepts an ISO string, a timestamp, or a Mongo {$date:...} wrapper */
function ncDate(value) {
  if (!value) return null;
  const raw = (typeof value === 'object' && value.$date) ? value.$date : value;
  const d = new Date(raw);
  return isNaN(d.getTime()) ? null : d;
}
 
function ncDuration(ms) {
  const hours = ms / 3600000;
  if (hours < 1) return Math.max(1, Math.round(ms / 60000)) + 'm';
  if (hours < 48) return Math.round(hours) + 'h';
  return Math.round(hours / 24) + 'd';
}
 
function ncTimeAgo(date) {
  const diff = Date.now() - date.getTime();
  const mins = Math.round(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return mins + 'm ago';
  const hours = Math.round(mins / 60);
  if (hours < 24) return hours + 'h ago';
  const days = Math.round(hours / 24);
  if (days === 1) return 'yesterday';
  if (days < 7) return days + 'd ago';
  return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}
 
/* Patient names, themes and question text come from user input and are
   injected as HTML here, so escape them. */
function ncEsc(value) {
  return String(value == null ? '' : value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
 
function ncDashSetLoading() {
  ['ncKpiTotalCases', 'ncKpiOpenQueries', 'ncKpiResponse',
   'ncKpiConsultants', 'ncKpiThemes', 'ncKpiMonthCases'].forEach(id => {
    const el = document.getElementById(id);
    if (el) { el.textContent = '--'; el.classList.add('is-loading'); }
  });
}
 
function ncDashError() {
  ['ncThemeChart', 'ncCaseStatusLegend', 'ncAppStatusLegend', 'ncActivityFeed'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.innerHTML = '<div class="nc-empty">Could not load this data. Try Refresh.</div>';
  });
  ncDashSetLoading();
}

/* ─── which tile opens which list ────────────────────────────────────── */
 
function ncShowDetail(view) {
  if (!_ncDashData) {
    console.warn('Dashboard data not loaded yet');
    return;
  }
 
  const d = _ncDashData;
  let built;
 
  switch (view) {
 
    case 'cases':
      built = ncDetailCases(d.cases);
      built.title = 'All Patient Cases';
      built.sub = 'One row per patient, showing the latest visit. Click a row with a Patient ID to open its workspace.';
      break;
 
    case 'monthCases': {
      const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
      const list = d.cases.filter(c => {
        const when = ncDate(c.added && c.added.addedDate);
        return when && when >= monthStart;
      });
      built = ncDetailCases(list);
      built.title = 'Cases Submitted This Month';
      built.sub = 'Since ' + monthStart.toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });
      break;
    }
 
    case 'openQuestions':
      built = ncDetailQuestions(d.queries.filter(q => !(q.answers && q.answers.length)));
      built.title = 'Open Questions';
      built.sub = 'Questions with no answer posted yet, longest waiting first.';
      break;
 
    case 'consultants':
      built = ncDetailConsultants(
        d.apps.filter(a => (a.roles || []).some(r => (r && r._id ? r._id : r) === 'NC Consultant')));
      built.title = 'Registered Consultants';
      built.sub = 'Registrations holding the NC Consultant role.';
      break;
 
    case 'themes':
      built = ncDetailThemes(d.themes, d.cases);
      built.title = 'Consult Themes';
      built.sub = 'Themes available to network doctors, with the cases submitted under each.';
      break;
 
    default:
      return;
  }
 
  ncPaintDetail(built);
}
 
 
/* ─── row builders ───────────────────────────────────────────────────── */
 
const NC_STATUS_CLASS = {
  New: 'is-new', Pending: 'is-pending', Allotted: 'is-allotted', Referred: 'is-referred'
};
 
const NC_PRIORITY_CLASS = {
  High: 'is-rejected', Medium: 'is-pending', Low: 'is-allotted'
};
 
function ncDetailCases(list) {
  return {
    head: ['Patient', 'Patient ID', 'Hospital', 'Theme', 'Status', 'Submitted by', 'Date'],
    empty: 'No patient cases yet.',
    noun: 'case',
    rows: list.map(c => {
      const when   = ncDate(c.added && c.added.addedDate);
      const status = c.patientStatus || 'New';
      const by     = (c.added && c.added.userName) || '';
      const meta   = [c.age ? c.age + 'y' : '', c.gender || ''].filter(Boolean).join(' · ');
 
      const cells = [
        '<strong>' + ncEsc(c.patientName || '-') + '</strong>' +
          (meta ? '<span class="nc-sub">' + ncEsc(meta) + '</span>' : ''),
        c.patientId ? ncEsc(c.patientId) : '<span class="nc-muted">not assigned</span>',
        ncEsc(c.instHsptlName || '-'),
        ncEsc(c.patientRelatedThemeName || '-'),
        '<span class="nc-pill ' + (NC_STATUS_CLASS[status] || 'is-new') + '">' + ncEsc(status) + '</span>',
        by ? 'Dr. ' + ncEsc(by) : '-',
        when ? ncFormatDate(when) : '-'
      ];
 
      return {
        text: [c.patientName, c.patientId, c.instHsptlName, c.patientRelatedThemeName, status, by]
                .join(' ').toLowerCase(),
        html: '<tr' + (c.patientId ? ' class="is-linked" onclick="ncOpenCase(\'' + ncEsc(c.patientId) + '\')"' : '') + '>' +
              cells.map(cell => '<td>' + cell + '</td>').join('') + '</tr>'
      };
    })
  };
}
 
function ncDetailQuestions(list) {
  const sorted = list.slice().sort((a, b) => {
    const da = ncDate(a.added && a.added.addedDate);
    const db = ncDate(b.added && b.added.addedDate);
    return (da ? da.getTime() : 0) - (db ? db.getTime() : 0);   // oldest = longest waiting
  });
 
  return {
    head: ['Priority', 'Question', 'Patient ID', 'Asked by', 'Asked', 'Waiting'],
    empty: 'Every question has been answered.',
    noun: 'open question',
    rows: sorted.map(q => {
      const when = ncDate(q.added && q.added.addedDate);
      const by   = (q.added && q.added.userName) || '';
      const tag  = q.questionTag || '-';
 
      const cells = [
        '<span class="nc-pill ' + (NC_PRIORITY_CLASS[tag] || 'is-new') + '">' + ncEsc(tag) + '</span>',
        '<span class="nc-clamp">' + ncEsc(q.question || '-') + '</span>',
        ncEsc(q.patientId || '-'),
        by ? 'Dr. ' + ncEsc(by) : '-',
        when ? ncFormatDate(when) : '-',
        when ? ncDuration(Date.now() - when.getTime()) : '-'
      ];
 
      return {
        text: [tag, q.question, q.patientId, by].join(' ').toLowerCase(),
        html: '<tr' + (q.patientId ? ' class="is-linked" onclick="ncOpenCase(\'' + ncEsc(q.patientId) + '\')"' : '') + '>' +
              cells.map(cell => '<td>' + cell + '</td>').join('') + '</tr>'
      };
    })
  };
}
 
function ncDetailConsultants(list) {
  return {
    head: ['Name', 'Designation', 'Department', 'Unit', 'Institution', 'Roles', 'Status'],
    empty: 'No consultants registered yet.',
    noun: 'consultant',
    rows: list.map(a => {
      const roles = (a.roles || [])
        .map(r => (r && r._id ? r._id : r))
        .filter(Boolean);
 
      const status = a.status || 'Submitted';
      const statusCls = status === 'Approved' ? 'is-allotted'
                      : (status === 'Rejected' ? 'is-rejected' : 'is-pending');
 
      const cells = [
        '<strong>' + ncEsc(a.name || '-') + '</strong>' +
          (a.employeeNumber ? '<span class="nc-sub">' + ncEsc(a.employeeNumber) + '</span>' : ''),
        ncEsc(a.designation || '-'),
        ncEsc(ncDeptName(a)),
        ncEsc(ncUnitName(a)),
        ncEsc(ncInstName(a)),
        roles.length
          ? roles.map(r => '<span class="nc-tag">' + ncEsc(r) + '</span>').join(' ')
          : '<span class="nc-muted">-</span>',
        '<span class="nc-pill ' + statusCls + '">' + ncEsc(status) + '</span>'
      ];
 
      return {
        text: [a.name, a.designation, ncDeptName(a), ncUnitName(a), ncInstName(a), roles.join(' '), status]
                .join(' ').toLowerCase(),
        html: '<tr>' + cells.map(cell => '<td>' + cell + '</td>').join('') + '</tr>'
      };
    })
  };
}
 
function ncDetailThemes(themes, cases) {
  const counts = new Map();
  cases.forEach(c => {
    const name = (c.patientRelatedThemeName || '').trim();
    if (name) counts.set(name, (counts.get(name) || 0) + 1);
  });
 
  const rows = themes.map(t => {
    const name  = t.themeName || '-';
    const count = counts.get(String(name).trim()) || 0;
    const share = cases.length ? Math.round((count / cases.length) * 100) : 0;
 
    const cells = [
      '<strong>' + ncEsc(name) + '</strong>',
      '<span class="nc-clamp">' + ncEsc(t.description || '-') + '</span>',
      '<span class="nc-count">' + count + '</span>',
      count ? share + '%' : '<span class="nc-muted">-</span>'
    ];
 
    return {
      sortKey: count,
      text: [name, t.description].join(' ').toLowerCase(),
      html: '<tr>' + cells.map(cell => '<td>' + cell + '</td>').join('') + '</tr>'
    };
  }).sort((a, b) => b.sortKey - a.sortKey);
 
  return {
    head: ['Theme', 'Description', 'Cases', 'Share'],
    empty: 'No themes configured yet.',
    noun: 'theme',
    rows: rows
  };
}
 
 
/* ─── popup plumbing ─────────────────────────────────────────────────── */
 
let _ncDetailRows = [];   // rows currently in the popup, for the search box
 
function ncPaintDetail(built) {
  _ncDetailRows = built.rows || [];
 
  ncSetText('ncDetailTitle', built.title || 'Details');
  ncSetText('ncDetailSub', built.sub || '');
 
  const head = document.getElementById('ncDetailHead');
  if (head) {
    head.innerHTML = '<tr>' + (built.head || [])
      .map(label => '<th>' + ncEsc(label) + '</th>').join('') + '</tr>';
  }
 
  const search = document.getElementById('ncDetailSearch');
  if (search) search.value = '';
 
  ncFilterDetail('', built.empty, built.noun);
 
  const modal = ncDetailModal();
  if (modal) modal.show();
}
 
/* Bootstrap 5 is already loaded by the app (initNcNavigation uses
   bootstrap.Collapse), but guard anyway so a script-order problem can
   never take the drill-through down with it. */
function ncDetailModal() {
  const el = document.getElementById('ncDetailModal');
  if (!el || typeof bootstrap === 'undefined' || !bootstrap.Modal) return null;
  return bootstrap.Modal.getInstance(el) || new bootstrap.Modal(el);
}
 
function ncFilterDetail(term, emptyMsg, noun) {
  const body = document.getElementById('ncDetailBody');
  if (!body) return;
 
  const needle = String(term || '').trim().toLowerCase();
  const rows = needle
    ? _ncDetailRows.filter(r => r.text.indexOf(needle) !== -1)
    : _ncDetailRows;
 
  const colCount = document.querySelectorAll('#ncDetailHead th').length || 1;
 
  if (!rows.length) {
    const message = needle
      ? 'Nothing matches "' + ncEsc(term) + '".'
      : (emptyMsg || 'Nothing to show.');
    body.innerHTML = '<tr><td colspan="' + colCount + '"><div class="nc-empty">' + message + '</div></td></tr>';
  } else {
    body.innerHTML = rows.map(r => r.html).join('');
  }
 
  const countEl = document.getElementById('ncDetailCount');
  if (countEl) {
    const label = noun || countEl.dataset.noun || 'row';
    if (noun) countEl.dataset.noun = noun;
    countEl.textContent = rows.length + ' ' + label + (rows.length === 1 ? '' : 's') +
      (needle && rows.length !== _ncDetailRows.length ? ' of ' + _ncDetailRows.length : '');
  }
}
 
/* Row click -> close the popup and open that patient's workspace */
function ncOpenCase(patientId) {
  if (!patientId) return;
  const modal = ncDetailModal();
  if (modal) modal.hide();
  openPatientWorkspace(patientId);
}
 
 
/* ─── field helpers (same fallback chains the NC tables use) ─────────── */
 
function ncDeptName(a) {
  const dept = a.cmcDepartments;
  if (!dept) return a.department || '-';
  if (Array.isArray(dept)) return dept.map(d => d && d.name).filter(Boolean).join(', ') || '-';
  return dept.name || '-';
}
 
function ncUnitName(a) {
  if (a.cmcUnit && a.cmcUnit.name) return a.cmcUnit.name;
  if (Array.isArray(a.cmcUnits)) {
    return a.cmcUnits.map(u => (u && u.name) ? u.name : u).filter(Boolean).join(', ') || '-';
  }
  return a.cmcUnits || '-';
}
 
/* matches ncNodalsListTable(): mission hospital name, else hospital name, else CMC */
function ncInstName(a) {
  return (a.missionHospital && a.missionHospital.missionHospitalName)
    || a.hospitalName
    || 'CMC';
}
 
function ncFormatDate(date) {
  return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}
 
//Network consult ends
const loadedPages = {};

function loadNcPage(page) {
  if (loadedPages[page]) return;

  switch (page) {
    case "introPage":
          loadNcDashboard();
          break;

    case "themesPage":
      renderNcThemes();
      break;

    case "requestPage":
      ncPatientReqtable();
      break;

    case "consultPage":
      ncMyDeptConsltTable();
      newPatientReq('myApprovedPatient');
      break;

    case "nodalPage":
      ncNodalsListTable();
      newPatientReq('newPatientReq');
      break;
  }

  loadedPages[page] = true;
}

function initNcNavigation() {
  const navBtns = document.querySelectorAll(".nav-btn");
  const pages = document.querySelectorAll(".content-page");

  navBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const targetPage = btn.dataset.page;

      /* ACTIVE BUTTON */

      navBtns.forEach((b) => b.classList.remove("active"));

      btn.classList.add("active");

      /* PAGE SWITCH */

      pages.forEach((page) => {
        page.classList.add("d-none");
      });

      document.getElementById(targetPage)?.classList.remove("d-none");

      /* CLOSE MOBILE MENU */

      const navbarCollapse = document.getElementById("ncNavbar");

      if (navbarCollapse.classList.contains("show")) {
        bootstrap.Collapse.getInstance(navbarCollapse)?.hide();
      }

      /* LOAD PAGE DATA */

      loadNcPage(targetPage);
    });
  });
}

async function renderNcThemes() {
  const ncThemesList = document.getElementById("ncThemesList");
  const collection = {
    collection: "NetConsltTheme",
    query: { isDeleted: false },
  };

  try {
    const ncThemesData = await fetchCollectionData(
      "fetchCollectionData",
      collection,
    );
    const ncThemes = ncThemesData.data || [];

    ncThemesList.innerHTML =
      `<div class="row justify-content-center">` +
      renderFunctions.ncThemesList(ncThemes) +
      `</div>`;
  } catch (error) {
    console.error("Error fetching themes:", error);
  }
}

async function loadServiceCommitPage() {
  const user = usrDetails?.data?.profile || {};
  const admissionNo = user.admissionNo;

  const fetchQuery = {
    collection: "students",
    query: {
      admissionNo: admissionNo, // Use dynamic admissionNo with fallback
    },
    queryType: "standard",
    projection: { academic: 0, bills: 0, schedules: 0, eventAttendance: 0 }
  };

  const collData = await fetchCollectionData(
    "fetchCollectionDataFromDB",
    fetchQuery
  );

  const studentData = collData?.data?.[0];
  console.log("studentData", studentData);
  if (!studentData) return;
  if (studentData.sponsoringBody?._id == undefined) {
    alert("No sponsoring details found.")
    console.log("No sponsoring body")
    return
  };

  // Render view
  navigateTo("serviceCommitment", studentData, [
    ["loadSponsoringBodyCard", [studentData.sponsoringBody._id, studentData.listOfHsptlVisited]],
    ["initFeedbackForm", [studentData]]
  ]);

}

function initFeedbackForm(studentData) {
  const hospitalInput = document.getElementById("selectedHsptl");
  const hospitalText = document.getElementById("selectedHospitalText");
  const feedbackTextarea = document.getElementById("feedback");
  const submitBtn = document.getElementById("shareBtn");
  const hospitalList = document.getElementById("hospitalList");

  // Ensure DOM elements exist before binding
  if (!hospitalList || !submitBtn || !feedbackTextarea) {
    // Retry once on next animation frame if DOM isn't ready yet
    requestAnimationFrame(() => initFeedbackForm(studentData));
    return;
  }

  function toggleButtonState() {
    const hasHospital = Boolean(hospitalInput.value);
    const hasFeedback = Boolean(feedbackTextarea.value.trim());
    submitBtn.disabled = !(hasHospital && hasFeedback);
  }

  // Handle Hospital Selection (Event Delegation)
  hospitalList.addEventListener("click", function (e) {
    const item = e.target.closest(".hospital-item");
    if (!item) return;

    // Set values
    hospitalInput.value = item.dataset.id;
    hospitalText.textContent = item.textContent.trim();

    toggleButtonState();
  });

  // Handle Feedback typing
  feedbackTextarea.addEventListener("input", toggleButtonState);

  // Handle Form Submission
  submitBtn.addEventListener("click", async function (e) {
    e.preventDefault();

    const selectedHsptlId = hospitalInput.value;
    const feedbackContent = feedbackTextarea.value.trim();

    if (!selectedHsptlId || !feedbackContent) return;

    const saveQuery = {
      collection: "missionHospital",
      query: {
        selector: { _id: selectedHsptlId },
        data: {
          $push: {
            studentFeedback: {
              studentName: studentData.firstName + " " + studentData.lastName,
              admissionNo: studentData.admissionNo,
              feedback: feedbackContent,
              feedbackDate: new Date(),
            },
          },
        }
      },
    };

    try {
      submitBtn.disabled = true;
      submitBtn.innerText = "Saving...";

      const response = await fetchCollectionData(
        "updateCollectionDataInDB",
        saveQuery
      );

      if (response) {
        alert("Thank you! Your feedback has been shared successfully.");

        // Reset form
        hospitalInput.value = "";
        hospitalText.textContent = "Select Hospital";
        feedbackTextarea.value = "";
      }
    } catch (err) {
      console.error("Error submitting feedback:", err);
      alert("Error saving feedback. Please try again.");
    } finally {
      submitBtn.innerText = "Click here to share";
      toggleButtonState();
    }
  });

  // Set initial state
  toggleButtonState();
}

async function loadSponsoringBodyCard(mnwCode, allottedHospitals = []) {
  console.log("mnwCode", mnwCode);
  if (!mnwCode) {
    return;
  }
  const allottedIds = allottedHospitals.map(
    h => h.hsptlPosted._id
  );

  const fetchQuery = {
    collection: "MissionHospital",
    query: { sponsoringBodyId: mnwCode },
  };

  const collData = await fetchCollectionData(
    "fetchCollectionData",
    fetchQuery,
  );
  const sponsoringBodyData = collData.data;
  console.log("sponsoringBodyData", sponsoringBodyData);

  document.getElementById("sponsoringBodyCard").innerHTML = `
    <div class="row justify-content-center my-3">
      ${renderFunctions.sponsoringBodyCard(
    collData.data,
    allottedIds
  )}
    </div>
  `;
}

async function loadFovGrantsPage() {

  const collection = { collection: "FovApplication", query: { isDeleted: false, 'projectCoordinators.email': usrDetails?.data?.emails.address }, projection: { _id: 1 }, options: { sort: { 'added.date': -1 } } };
  const collData = await fetchCollectionData("fetchCollectionData", collection) || { data: [] };
  navigateTo("fovGrants", collData.fovGrantId, []);

  if (collData.data.length > 0) {
    document.getElementById("fovAppDashboardBtn").classList.remove('d-none');
  }
  if (usrDetails?.data?.role === "Admin") {
    document.getElementById("fovAdminDashboardBtn").classList.remove('d-none');
  }


}

//Mission Newsletter - script starts

async function loadNewsletterCards() {
  const container = document.getElementById('newsletterCards');
  if (!container) return;

  const res = await fetchCollectionData('fetchCollectionData', {
    collection: 'ConnectNewsletter',
    query: { isDeleted: false }
  });
  const newsletterData = res?.data || [];

  if (!newsletterData.length) {
    container.innerHTML = `<p class="text-muted">No newsletters available yet.</p>`;
    return;
  }

  // Most recent issue first
  const sorted = [...newsletterData].sort(
    (a, b) => new Date(b.stDate) - new Date(a.stDate)
  );

  container.innerHTML = sorted.map(item => {
    const cover = item.coverImg?.[0]?.url || item.coverImg?.[0]?.data?.url || './images/cmc-logo.png';
    const dateStr = item.stDate
      ? new Date(item.stDate).toLocaleDateString('en-IN', {
          year: 'numeric', month: 'long', day: 'numeric'
        })
      : '';

    return `
      <div class="newsletter-card" data-flipbook="${item.flipbookUrl}" onclick="openNewsletter(this)">
        <div class="newsletter-cover">
          <img src="${cover}" alt="${item.title || 'Mission Connect'}">
        </div>
        <div class="newsletter-content">
          <h5>${item.title || ''}</h5>
          <p>${dateStr}</p>
        </div>
      </div>
    `;
  }).join('');
}

function openNewsletter(card) {

    const url = card.dataset.flipbook;

    document.getElementById("newsletterFrame").src = url;

    const modal = new bootstrap.Modal(
        document.getElementById("newsletterModal")
    );

    modal.show();
}

// Clear iframe when modal closes — delegated on document since #newsletterModal
// only exists in the DOM while home / missions / connectNewsletter is the
// active page, and this listener must survive page swaps.
document.addEventListener("hidden.bs.modal", function (e) {
    if (e.target && e.target.id === "newsletterModal") {
        const frame = document.getElementById("newsletterFrame");
        if (frame) frame.src = "";
    }
});

//Mission Newsletter - script ends