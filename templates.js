
  window.precompiledTemplates = {
    "header": function(data) {
    return `${data.preLogin ? `
<header class="p-2 position-relative bg-primarycolor">
  <div class="d-flex flex-row align-items-center justify-content-between">

    <!-- Left spacer -->
    <div></div>

    <!-- Mobile / Tablet Logo -->
    <div class="d-block d-lg-none">
      <div class="d-flex align-items-center text-white fs-4 trirong-bold">
        <img src="/images/cmc-logo-white-transparent.png" class="img-fluid" width="40px" />
        &nbsp; CMC<span class="primarycolor" style="font-size:40px; line-height: 1;">V</span>CONNECT
      </div>
    </div>

    <!-- Desktop Logo -->
    <div class="d-none d-lg-block" style="width: 860px;">
      <div class="d-flex flex-column align-items-start text-white trirong-bold"
        style="position: relative; left: 150px;">

        <div class="d-flex align-items-center fs-1" style="position: relative; left: 140px;">
          <img src="/images/cmc-logo-white-transparent.png" class="img-fluid" width="80px" />
          &nbsp; CMC<span class="primarycolor" style="font-size:64px; line-height: 1;">V</span>CONNECT
        </div>
        <p class="fst-italic w-100 text-end" style="position: absolute; bottom: -18px; right: 55px; font-size: 14px;">
          Connect, Communicate, Collaborate </p>

      </div>
    </div>

    <div class="d-flex align-items-center">
      <!-- Mobile 3-dot -->
      <button class="btn me-2 d-md-none d-inline" data-bs-toggle="offcanvas" data-bs-target="#offcanvas3dot"
        aria-controls="offcanvas3dot">
        <img src="/images/3dot.svg" alt="3dot" height="20px">
      </button>

      <!-- Desktop links -->
      <div class="d-none d-md-inline">

        <!-- Login Dropdown -->
        <div class="btn-group dropdown">
          <button class="btn dropdown-toggle bg-white" id="loginDropdown" aria-expanded="false">
            Login
          </button>
          <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="loginDropdown">
            <li>
              <button class="btn dropdown-item" onclick="msSignIn(event)" title="For Microsoft Ids ending in 
              ***@cmcvellore.ac.in 
              ***@cmcvellore.edu.in 
              ***@cmcv.in">
                <div class="btn border" style="font-size: 15px;">
                  <img class="me-2" src="./images/microsoft.png" alt="microsoft login" height="20" width="20">
                  Sign in
                </div>
              </button>
            </li>
            <li>
              <button class="btn dropdown-item" id="googleSignInButton"
                title="For Google Ids ending in ***@cmc.edu.in"></button>
            </li>
          </ul>
        </div>

        <!-- Sign Up -->
        <button class="btn text-light ms-2 secondary-bg-color"
          onclick="openModal('formIO', null, 'Request Login Form'), requestLoginForm()">Sign Up</button>
      </div>
    </div>
  </div>

  <!-- offscreen -->
  <div class="offcanvas offcanvas-start bg-transparent border-0" tabindex="-1" id="offcanvas3dot"
    aria-labelledby="offcanvas3dot">

    <div class="offcanvas-header justify-content-end">
      <button type="button" class="btn-close bg-white shadow-sm" data-bs-dismiss="offcanvas"
        aria-label="Close"></button>
    </div>

    <div class="m-3 bg-white rounded-4 h-100 overflow-hidden d-flex flex-column shadow">
      <ul class="list-group list-group-flush fs-6">

        <li
          class="list-group-item list-group-item-action py-3 pe-pointer d-flex align-items-center justify-content-center"
          onclick="msSignIn(event)" data-bs-dismiss="offcanvas">
          <img src="./images/microsoft.png" alt="microsoft login" height="22" width="22" class="me-2">
          <span class="fw-semibold">Sign In</span>
        </li>

        <li class="list-group-item d-flex justify-content-center" id="googleSignInButtonmb">
        </li>

        <li
          class="list-group-item list-group-item-action py-3 pe-pointer fw-bold text-white text-center border-0 secondary-bg-color"
          onclick="openModal('formIO', null, 'Request Login Form'); requestLoginForm();" data-bs-dismiss="offcanvas">
          <i class="fa-solid fa-pen-to-square"></i> Sign Up
        </li>

      </ul>
    </div>

    </ul>
    <div class=" text-center mb-2">Version ${data.version}
    </div>
  </div>
</header>
`:''}

${data.postLogin?`
<nav class="navbar navbar-expand-lg px-1 roboto-regular bg-primarycolor">
  <div class="position-absolute w-100">
  </div>
  <div class="d-lg-none d-flex align-items-center">
    <img src="/images/cmc-logo-white-transparent.png" class="img-fluid" width="50px" />
    <span class=" d-flex align-items-center text-white text-center fw-bold trirong-bold"><span>&nbsp; CMC</span><span
        class="primarycolor fs-1 ">V</span><span>CONNECT</span> </span>
  </div>
  <button class="btn me-2 d-lg-none d-inline" data-bs-toggle="offcanvas" data-bs-target="#navbarText"
    aria-controls="navbarText">
    <img src="/images/3dot.svg" alt="3dot" height="20px">
  </button>
  <div class="collapse navbar-nav navbar-collapse justify-content-around" data-bs-auto-close="false">
    <ul class="navbar-nav">
      <a class="nav-link text-white btn" id="home" data-tab="home"
        onclick="renderPostHomePage(); activateTab('home');">Home</a>
      ${data.councilBtn}
      <!-- ${data.missionBtn} -->
      ${data.mentorBtn}
      ${data.menteeBtn}
      ${data.msnVisitBtn}
      ${data.serviceCommitmentBtn}
      ${data.fovGrantsBtn}
      <!-- <a class="nav-link text-white" aria-current="page" id="missions" data-target="missions" onclick="activateTab(this);renderMissionsPage()">Missions</a>
              <a class="nav-link text-white" aria-current="page" id="council" data-target="council" onclick="activateTab(this);renderCouncilPage()">Council</a> -->
    </ul>
    <div class="d-none d-lg-block">
      <div class="d-flex align-items-center text-white fs-1 trirong-bold">
        <img src="/images/cmc-logo-white-transparent.png" class="img-fluid" width="50px" />
        &nbsp; CMC<span class="primarycolor" style="font-size:64px; line-height: 1;">V</span>CONNECT
      </div>
    </div>
    <ul class="navbar-nav align-items-center">
      ${data.guideBtn}
      <a class="nav-link text-white btn" id="contactus" data-tab="contactus"
        onclick="openModal('contactMissions')">Contact us</a>

      <a class="nav-link dropdown-toggle" type="button" data-toggle="dropdown" data-bs-toggle="dropdown"
        aria-expanded="false">
        <img class="profile_icon rounded-circle" src="${data.userImg}" alt="" style="width: 35px; height: 35px;">
      </a>
      <div class="dropdown-menu mb-2 p-3 mx-auto" style="left: auto; width: max-content; ">
        <div class=" d-flex flex-column align-items-center">
          <img class="profile_icon rounded-circle mb-2" src="${data.userImg}" style="width: 65px; height: 65px;">
          <hr class="border-top border-secondary my-auto w-100 mb-2" />
          <span class="connect-text-darkblue"> </span>
          <span class="secondary-color">${data.email}</span>
        </div>
      </div>
      </li>
      <li>
        <button class="btn btn-light align-text-top" type="button" id="${data.email}:${data.loginType}"
          onclick="msAndGoogleSignOut(event)">
          <img
            src="${data.loginType === 'google' ? '../images/google.svg' : data.loginType === 'microsoft' ? '../images/microsoft.svg' : ''}"
            class="img-fluid" width="20px" />
          Sign Out</button>
      </li>
    </ul>
  </div>
</nav>
<!-- offscreen -->
<div class="offcanvas offcanvas-start bg-white" tabindex="-1" id="navbarText" aria-labelledby="offcanvas3dot">
  <div class="offcanvas-header">
    <span class="d-flex">
      <img class="rounded-circle border me-2" src="${data.userImg}" alt="" width="30" height="30">
      <span class="my-auto border rounded-pill px-3 fw-semibold fs-6">${data.name}</span>
    </span>
    <button type="button" class="btn-close bg-white  fs-6" data-bs-dismiss="offcanvas" aria-label="Close"></button>
  </div>
  <div class="m-3 h-100 overflow-hidden d-flex flex-column justify-content-between">
    <ul class=" fs-5 list-group">
      <li class="list-group-item border-bottom border-top-0 border-start-0 border-end-0 active" data-bs-toggle="tab"
        data-tab="home" onclick="activateTab('home');renderPostHomePage()" data-bs-dismiss="offcanvas">
        <a class="nav-link btn">Home</a>
      </li>
      ${data.councilBtnmb}
      ${data.mentorBtnmb}
      ${data.menteeBtnmb}
      ${data.msnVisitBtnmb}
      ${data.serviceCommitmentBtnmb}
      ${data.fovGrantsBtnmb}
      ${data.guideBtnmb}
       ${data.guideBtnmb}
      <li class="text-center mt-2">
        <button class="btn btn-light align-text-top" type="button" id="${data.email}:${data.loginType}"
          onclick="msAndGoogleSignOut(event)">
          <img
            src="${data.loginType === 'google' ? '../images/google.svg' : data.loginType === 'microsoft' ? '../images/microsoft.svg' : ''}"
            class="img-fluid" width="20px" />
          Sign Out</button>
      </li>
    </ul>
    <div class="text-center">Version ${data.version}</div>
  </div>

</div>
`:''}`;
  },
"home": function(data) {
    return `<div class="fadeIn-up container-fluid bg-white" style="font-family: math;">

  <div class="row p-4 pt-5 pb-0">
    <div class="col-md-7 mx-auto">
      <p class="text-center fs-5" style="line-height: 1.8; word-spacing: 2px;">
        <strong>CMC <span class="primarycolor" style="font-size:24px; line-height: 1;">V</span> CONNECT</strong> is
        dedicated to providing a comprehensive platform for medical professionals,
        students, and individuals who share the ethos of CMC Vellore — <br>
        <em>"Not to be ministered unto, but to minister"</em>.
      </p>
    </div>
  </div>

  <div class="row justify-content-center">
    <div class="col-12"
      style="background:url('https://s3.amazonaws.com/img.studenthub.in/CMCVConnect_Portal/Pictures/_504eab6a6d9ba6482037ab9a52d06537_Pictures.png') 50% 33% /cover no-repeat; height: 360px; width: 1140px;">

    </div>
  </div>

  <div class="row p-md-5 pt-0">
    <div class="col-lg-8 mx-auto text-center">
      <p class="fs-5" style="line-height: 1.8; word-spacing: 2px;">
        This platform serves as a hub for engaging in discussions, accessing educational resources, and sharing ideas,
        knowledge, and expertise. Our focus on integrating faith with medical education sets us apart, creating a
        distinct learning environment for those passionate about making a difference in healthcare.
      </p>
    </div>
  </div>

  <div class="row align-items-center p-2 shadow-sm" style="background-color: #d0d4df;">
    <div class="col-12 col-md-4"
      style="background:url('https://s3.amazonaws.com/img.studenthub.in/CMCVConnect_Portal/Pictures/_ba8ab66b2e84966ea90e452e98395e5c_Pictures.jpg') center/cover no-repeat; height: 360px; border-radius: 8px;">
    </div>
    <div class="col-12 col-md-4 my-3">
      <p class="text-center px-3" style="line-height: 1.8; word-spacing: 2px; font-size: 19px;">
        We offer resources including online courses, reading materials, second opinions for patient care,
        training opportunities, skill development workshops, and job vacancies in mission hospitals.
        We also provide legal assistance and guidance for NABH certification, ensuring comprehensive
        support for those working or looking to serve in mission fields.
      </p>
    </div>
    <div class="col-12 col-md-4"
      style="background:url('https://s3.amazonaws.com/img.studenthub.in/CMCVConnect_Portal/Pictures/_bae8d3833b7293943235c723b6efaf2a_Pictures.jpg') center/cover no-repeat; height: 360px; border-radius: 8px;">
    </div>
  </div>

  <div class="row p-md-5 pt-3">
    <div class="col-lg-8 mx-auto text-center">
      <h3 class="fw-bold">Join Our Community</h3>
      <p class="fs-5" style="line-height: 1.8; word-spacing: 2px;">
        Be a part of our vibrant community dedicated to sharing knowledge, supporting one another,
        and making a positive impact. Explore our resources, participate in discussions, and
        stay updated on the latest advancements in medical education.
      </p>
    </div>
  </div>

  <div class="row align-items-center p-2 shadow-sm" style="background-color: #d0d4df;">
    <div class="col-12 col-md-4 my-3 text-center">
      <h3 class="fw-medium">Who Can Connect?</h3>
      <p style="line-height: 1.8; word-spacing: 2px; font-size: 19px;">
        Anyone with a heart for service… health professionals, volunteers, donors, well-wishers,
        and anyone interested in India’s healthcare. Students passionate about serving in
        different regions of India are especially encouraged to join.
      </p>
    </div>
    <div class="col-12 col-md-4"
      style="background:url('https://s3.amazonaws.com/img.studenthub.in/CMCVConnect_Portal/Pictures/_2ffebfa7a0e306fa93e359df4d703e0f_Pictures.jpg') center/cover no-repeat; height: 360px; border-radius: 8px;">
    </div>
    <div class="col-12 col-md-4 my-3 text-center">
      <h3 class="fw-medium">How Do I Connect?</h3>
      <p style="line-height: 1.8; word-spacing: 2px; font-size: 19px;">
        We’d love to hear from you! Simply fill out the form on our sign-up page,
        and the Missions Office at CMC Vellore will contact you. Share your story
        and how you’d like to get involved — we’re excited to connect!
      </p>
      <button class="btn text-light ms-2 secondary-bg-color"
        onclick="openModal('formIO', null, 'Request Login Form'), requestLoginForm()">Sign Up</button>
    </div>
  </div>

  <div class="row text-center justify-content-center bg-white">
    <h3 class="fw-bold mb-4 mt-5">Our Team</h3>
    <div class="col-12 col-md-8 d-flex flex-column flex-md-row justify-content-center align-items-center gap-4">
      <div class="text-dark">
        <h2 class="text-center word-image" style="font-size: 60px; display: inline-block;
            margin: 0;
             background-color: #2f8d46;
            background-image: url('https://s3.amazonaws.com/img.studenthub.in/CMCVConnect_Portal/Pictures/_d7f9c0d4864e6689686f724c66e412cb_Pictures.jpg');
            background-repeat: no-repeat;
            background-size: cover;
            background-position: center;
            color: transparent;
            background-clip: text;
            -webkit-background-clip: text;
            font-family: fantasy;">LET'S <br> MAKE <br> A <br> DIFFERENCE</h2>
      </div>
      <div class="col-12 col-md-6 my-3">
        <div class="ratio ratio-16x9 shadow-sm" style="background: url('https://s3.amazonaws.com/img.studenthub.in/CMCVConnect_Portal/Pictures/_9190f31218da64072a192e060aaf3949_Pictures.jpg') center/cover no-repeat; 
              border: solid 12px #80c6f2; 
              border-radius: 8px;">
        </div>
      </div>
    </div>
  </div>

  <div class="row justify-content-center text-white py-5" style="background-color: #020714;">
    <div class="col-12 col-md-8 d-flex flex-column flex-md-row align-items-start justify-content-between">

      <!-- Left: Title -->
      <div class="mb-4 mb-md-0">
        <h2 class="fw-medium" style="font-size: 44px;">CMC Missions</h2>
      </div>

      <!-- Right: Contact Details -->
      <div class="fs-5">
        <p class="mb-3">
          <i class="fa-envelope fas me-2 secondary-color"></i>
          <strong>Email:</strong>
          <a href="mailto:missionsoffice@cmcvellore.ac.in" class="text-decoration-none text-white">
            missionsoffice@cmcvellore.ac.in
          </a>
        </p>

        <p class="mb-3">
          <i class="fa-phone-alt fas me-2 secondary-color"></i>
          <strong>Phone:</strong>
          <a href="tel:+914162286171" class="text-decoration-none text-white">
            0416-2286117
          </a>
        </p>

        <p>
          <i class="fa-map-marker-alt fas me-2 secondary-color"></i>
          <strong>Address:</strong>
          <span>CMC Vellore - 632004</span>
        </p>
      </div>

    </div>
  </div>



</div>`;
  },
"studentHome": function(data) {
    return `

<!-- <main class="bg-primarycolor " style="min-height: 100%;"> -->
  <div class="position-relative z-1 d-flex justify-content-center d-md-none ">
    ${data.msnbtn}
  </div>
  <div class="container-fluid pt-3 ">
    
    <div class="row" data-row="row-1">
      
      
      
      
      <div class="col-12 mb-0 col-md-4" data-column="col-1">
        
        
        <div class="col-12 mb-2 mb-md-4 " data-row-col="card-row1-column-1">
          
          
<div class="card shadow bg-opacity-10 overflow-hidden">
  
  <div class="card-header border-0 ">
    <h5 class="d-flex justify-content-between align-items-center">Thought of the day <img
        class='img-thumbnail-rounded '
        src="./images/dove.svg" width="25"
        height="25" ></h5>
  </div>
  
  <div class="card-body p-2 p-md-3">
    
    
    <div class="mb-0 " >
      <div class="cnt">${data.thoughtOfDay || "“Whenever GOD determines to do a great work, HE first sets HIS people to pray.” - Charles Spurgeon" }</div>
    </div>
    

    
  </div>
</div>

          
        </div>
        
        
        <div class="col-12 mb-2 mb-md-4 " data-row-col="card-row1-column-1">
          
          
<div class="card shadow bg-opacity-10 overflow-hidden">
  
  <div class="card-header border-0 ">
    <h5 class="d-flex justify-content-between align-items-center">Grand Rounds <img
        class='img-thumbnail-rounded '
        src="../images/icons/grandRounds.png" width="25"
        height="25" ></h5>
  </div>
  
  <div class="card-body p-2 p-md-3">
    
    

    <div class="row g-3 align-items-center">
      <div class="col-12 col-sm-4 col-md-3 text-center">
        <img class="me-3 ms-2"
          src="https://s3.amazonaws.com/img.studenthub.in/CMCVConnect_Portal/Pictures/_b5c59b98f37db017af29c626a296f835_Pictures.png"
          height="100" width="100" alt="Grand Rounds Image">
      </div>
      <div class="col-12 col-sm-8 col-md-9">
        <h6 class="fw-semibold text-center mb-2">
          Ongoing Grand Rounds
        </h6>
        <div class="grandRounds-list">
          ${data.grandRounds}
        </div>
      </div>
    </div>

    
    <div class="text-end">
      <button class="btn bg-info-subtle py-1 px-2 rounded-3"
        onclick="navigateTo('grandRounds', {backTo: 'renderPostHomePage()'}, [['loadGrandRoundsTable', []], ['loadGrandRoundsVideos', [10]]]);">Read
        More</button>
    </div>

    

    
  </div>
</div>

          
        </div>
        
        
        <div class="col-12 mb-2 mb-md-4 d-flex " data-row-col="card-row1-column-1">
          
          
<div class="d-flex flex-wrap w-100 justify-content-around">
  
  
  <div class="p-1 p-md-2 d-flex flex-column flex-wrap align-items-center justify-content-center subcard z-1 
 
     mb-2"
    style="color:white;background-color: #99d77f;"
    onclick="loadSubcard('learningResources','','renderPostHomePage()')">
    <i class=" rounded bg-opacity-10 fab fa-readme "></i>
    <p class=" text-bold  text-center mb-0">Learning Resources </p>
  </div>
  
  <div class="p-1 p-md-2 d-flex flex-column flex-wrap align-items-center justify-content-center subcard z-1 
 
     mb-2"
    style="color:white;background-color: #e58176;"
    onclick="loadSubcard('doddLibrary','https://dodd.cmcvellore.ac.in','renderPostHomePage()')">
    <i class=" rounded bg-opacity-10 fas fa-book "></i>
    <p class=" text-bold  text-center mb-0">Dodd Library </p>
  </div>
  
  <div class="p-1 p-md-2 d-flex flex-column flex-wrap align-items-center justify-content-center subcard z-1 
 
     mb-2"
    style="color:white;background-color: #232342;"
    onclick="loadSubcard('manpowerRequest','','renderPostHomePage()')">
    <i class=" rounded bg-opacity-10 fas fa-users "></i>
    <p class=" text-bold  text-center mb-0">Manpower Requests </p>
  </div>
  
  <div class="p-1 p-md-2 d-flex flex-column flex-wrap align-items-center justify-content-center subcard z-1 
 
     mb-2"
    style="color:white;background-color: #6470aa;"
    onclick="loadSubcard('dls','','renderPostHomePage()')">
    <i class=" rounded bg-opacity-10 fas fa-user-md "></i>
    <p class=" text-bold  text-center mb-0">DLS </p>
  </div>
  
  <div class="p-1 p-md-2 d-flex flex-column flex-wrap align-items-center justify-content-center subcard z-1 
 
     mb-2"
    style="color:white;background-color: #c32828;"
    onclick="loadSubcard('missionHospitalVisits','','renderPostHomePage()')">
    <i class=" rounded bg-opacity-10 fas fa-hospital-symbol "></i>
    <p class=" text-bold  text-center mb-0">Mission Hospital Visits </p>
  </div>
  
  <div class="p-1 p-md-2 d-flex flex-column flex-wrap align-items-center justify-content-center subcard z-1 
 
     mb-2"
    style="color:white;background-color: #450e62;"
    onclick="loadSubcard('trainingOrObservership','','renderPostHomePage()')">
    <i class=" rounded bg-opacity-10 fas fa-chart-line "></i>
    <p class=" text-bold  text-center mb-0">Training or Observership </p>
  </div>
  
  <div class="p-1 p-md-2 d-flex flex-column flex-wrap align-items-center justify-content-center subcard z-1 
 
    "
    style="color:white;background-color: #b89d7a;"
    onclick="loadSubcard('research','','renderPostHomePage()')">
    <i class=" rounded bg-opacity-10 fas fa-newspaper "></i>
    <p class=" text-bold  text-center mb-0">Research </p>
  </div>
  
  <div class="p-1 p-md-2 d-flex flex-column flex-wrap align-items-center justify-content-center subcard z-1 
 
    "
    style="color:white;background-color: #858596;"
    onclick="loadSubcard('shiloh','','renderPostHomePage()')">
    <i class=" rounded bg-opacity-10 fas fa-warehouse "></i>
    <p class=" text-bold  text-center mb-0">Shiloh </p>
  </div>
  
  
</div>

          
        </div>
        
      </div>
      
      <div class="col-12 mb-0 col-md-4" data-column="col-2">
        
        
        <div class="col-12 mb-2 mb-md-4 " data-row-col="card-row1-column-2">
          
          

<div class="card text-center shadow p-2 d-flex h-100 " onclick="navigateTo(&#39;contact&#39;,{postLogin: true,currPage: &#39;renderPostHomePage()&#39;, role: &#39;Missions&#39;}, [&#39;loadHospitalIdsAndMap&#39;,[]]);"
  data-flipbook="">
  
  <div class="">
    <div class="card-content picture py-1 position-relative">
      
      
      <img src="./images/icons/india-icon1.png" width="140" alt="Icon">
      
    </div>
    <div class="card-footer bg-transparent border-0 w-100 ">
      <h5 class="text-secondary"></h5>
      <h2 class="text-wrap  connect-text-darkblue "
        style="font-size: 1.5rem;">
        Mission Hospitals
        
        
      </h2>
    </div>
  </div>
</div>


          
        </div>
        
        
        <div class="col-12 mb-2 mb-md-4 " data-row-col="card-row1-column-2">
          
          

<div class="card text-center shadow p-2 d-flex h-100 border-0 pe-pointer p-0" onclick="navigateTo(&#39;clinicalSnip&#39;, {}, [&#39;loadClinicalSnip&#39;,[]]);"
  data-flipbook="">
  
  <div class="card-header border-0 text-start">
    <h5 class="mb-0">Clinical Snippets</h5>
  </div>
  
  <div class="flex-lg-row d-flex flex-column align-items-center px-5">
    <div class="card-content picture py-1 position-relative">
      
      
      <img src="../images/icons/Open_Book.png" width="120" alt="Icon">
      
    </div>
    <div class="card-footer bg-transparent border-0 w-100 p-0">
      <h5 class="text-secondary"></h5>
      <h2 class="text-wrap  connect-text-darkblue "
        style="font-size: larger;">
        Take a quiz!!
        
        
      </h2>
    </div>
  </div>
</div>


          
        </div>
        
        
        <div class="col-12 mb-2 mb-md-4 " data-row-col="card-row1-column-2">
          
          

<div class="card text-center shadow p-2 d-flex h-100 border-0 pe-pointer p-0" onclick="navigateTo(&#39;academicConclave&#39;, {}, [&#39;conclaveParticipants&#39;, []]);"
  data-flipbook="">
  
  <div class="flex-lg-row d-flex flex-column">
    <div class="card-content picture py-1 position-relative">
      
      
      <img src="https://s3.amazonaws.com/img.studenthub.in/CMCVConnect_Portal/Pictures/_95ba291d20881589e4a4c4e099df0af6_Pictures.png" width="150" alt="Icon">
      
    </div>
    <div class="card-footer bg-transparent border-0 w-100 align-content-center p-0">
      <h5 class="text-secondary"></h5>
      <h2 class="text-wrap  connect-text-darkblue "
        style="font-size: larger;">
        Medical Colleges Conclave
        <br><br><small class="text-muted">Bringing together Christian institutions to strengthen Education, Service, Research &amp; Outreach in our nation.</small> <br>
        
      </h2>
    </div>
  </div>
</div>


          
        </div>
        
        
        <div class="col-12 mb-2 mb-md-4 " data-row-col="card-row1-column-2">
          
          

<div class="card text-center shadow p-2 d-flex h-100 border-0 pe-pointer p-0" onclick="openModal(&#39;connectOneOnOne&#39;, null, &#39;&#39;)"
  data-flipbook="">
  
  <div class="flex-lg-row d-flex flex-column">
    <div class="card-content picture py-1 position-relative">
      
      
      <img src="https://s3.amazonaws.com/img.studenthub.in/CMCVConnect_Portal/Pictures/_28bee5a70144b41a2f693999122af07b_Pictures.png" width="210" alt="Icon">
      
    </div>
    <div class="card-footer bg-transparent border-0 w-100 align-content-center p-0">
      <h5 class="text-secondary"></h5>
      <h2 class="text-wrap  connect-text-darkblue "
        style="font-size: medium;">
        "THIS SHILOH.. WOULD YOU LIKE TO CONNECT WITH US?"
        <br><br><small class="text-muted">Sharing Your Struggles With Someone Who Has Walked The Path - In An Atmosphere Of Love, Trust, And Openness - Can Open The Door To Your Breakthrough.</small> <br>
        
        <button class="btn btn-sm secondary-bg-color text-white ms-2 mt-3" onclick="window.open(&#39;https://docs.google.com/forms/d/e/1FAIpQLSf0Hdz-vvsCtxw0ZBDnGhgdxnV5SpygYOyscPzk1yPCm7KwmA/viewform&#39;, &#39;_blank&#39;)">Register</button>
        
      </h2>
    </div>
  </div>
</div>


          
        </div>
        
      </div>
      
      <div class="col-12 mb-0 col-md-4" data-column="col-3">
        
        
        <div class="col-12 mb-2 mb-md-4 " data-row-col="card-row1-column-3">
          
          
<div class="card shadow bg-opacity-10 overflow-hidden">
  
  <div class="card-header border-0 ">
    <h5 class="d-flex justify-content-between align-items-center">Weekly Manna <img
        class='img-thumbnail-rounded '
        src="./images/prayer-hands.png" width="25"
        height="25" ></h5>
  </div>
  
  <div class="card-body p-2 p-md-3">
    
    <div class="text-end">
      <i class="fas fa-info-circle ms-2 text-muted" data-bs-toggle="tooltip" data-bs-placement="right"
        title="Maitiri, CMC"></i>
      <button class="btn bg-info-subtle py-1 px-2 rounded-3"
        onclick="navigateTo('weeklyManna', {}, ['loadWeeklyMannaTable', []]);">View all</button>
    </div>
    
    ${data.weeklyManna}
    

    

    
  </div>
</div>

          
        </div>
        
        
        <div class="col-12 mb-2 mb-md-4 " data-row-col="card-row1-column-3">
          
          
<div class="card shadow bg-opacity-10 overflow-hidden">
  
  <div class="card-header border-0 ">
    <h5 class="d-flex justify-content-between align-items-center">News <img
        class='img-thumbnail-rounded '
        src="./images/file.svg" width="25"
        height="25" ></h5>
  </div>
  
  <div class="card-body p-2 p-md-3">
    
    <div class="text-end" style="margin-top: -5px;"><span class="px-2 py-1 bg-info-subtle rounded-3 pe-pointer"
        onclick="loadAllNews('student', 'renderStudentHomePage()')">View all</span></div>
    <div class=" demo rounded-3">
      ${data.renderedNews}
    </div>
    

    
  </div>
</div>

          
        </div>
        
      </div>
      
    </div>
    
    <div class="row" data-row="row-2">
      
      
      
      
      <div class="col-12 mb-0 col-md-12" data-column="col-3">
        
        
        <div class="col-12 mb-2 mb-md-4 " data-row-col="card-row2-column-3">
          
          

<div class="card text-center shadow p-2 d-flex h-100 border-0 pe-pointer p-0" onclick="openNewsletter(this)"
  data-flipbook="https://online.fliphtml5.com/cmcvellore/Mission-Connect---NL-2026-Vol1-Iss-2/">
  
  <div class="card-header border-0 text-start">
    <h5 class="mb-0">Missions Connect Newsletter</h5>
  </div>
  
  <div class="flex-lg-row d-flex flex-column">
    <div class="card-content picture py-1 position-relative">
      
      
      <img src="https://s3.amazonaws.com/img.studenthub.in/CMCVConnect_Portal/Pictures/_53841622cdbeb07dc31398aa3346b1f6_Pictures.png" width="150" alt="Icon">
      
    </div>
    <div class="card-footer bg-transparent border-0 w-100 align-content-center">
      <h5 class="text-secondary"></h5>
      <h2 class="text-wrap  connect-text-darkblue "
        style="font-size: larger;">
        Do you have a story to share?
        <br><br><small class="text-muted">We would love to hear from you. Please write to us @ missionconnect@cmcvellore.ac.in</small> <br>
        
        <button class="btn btn-sm secondary-bg-color text-white ms-2 mt-3" onclick=" ">Click here to read the Volumn 1 | Issue 2</button>
        
      </h2>
    </div>
  </div>
</div>

<!-- Model area -->

<div class="modal fade" id="newsletterModal" tabindex="-1">

  <div class="modal-dialog modal-xl modal-dialog-centered">

    <div class="modal-content">

      <div class="modal-header">

        <h5 class="modal-title">
          Missions Connect Newsletter
        </h5>

        <button type="button" class="btn-close" data-bs-dismiss="modal">
        </button>

      </div>

      <div class="modal-body p-0">

        <iframe id="newsletterFrame" width="100%" height="700" frameborder="0" allowfullscreen>
        </iframe>

      </div>

    </div>

  </div>

</div>


          
        </div>
        
      </div>
      
    </div>
    
  </div>
<!-- </main> -->
`;
  },
"contact": function(data) {
    return `${data.preLogin ? `
<div class="container d-flex flex-column align-items-center justify-content-center h-100">
    <!-- Contact Card -->
    <div class="bg-white contact-card p-4 rounded-4 shadow-lg mb-4" style="font-style: italic;">
        <div class="row align-items-center">
            <!-- Left Side - CMC Logo -->
            <div class="col-md-5 text-center">
                <img src="https://s3.amazonaws.com/img.studenthub.in/CMCVConnect_Portal/Pictures/_4c238c991d260738541f4b1437bf6349_Pictures.png.png"
                    class="img-fluid contact-logo" alt="CMC Logo" style="width: 300px;">
            </div>

            <!-- Right Side - Contact Details -->
            <div class="col-md-7">
                <h2 class="fw-bold text-dark mb-3">Contact Info</h2>
                <hr class="w-50 border-secondary mb-3">
                <div class="fs-5">
                    <p class="mb-2">
                        <i class="fa-envelope fas me-2 secondary-color"></i>
                        <strong>Email:</strong>
                        <a href="mailto:missionsoffice@cmcvellore.ac.in" class="text-decoration-none text-dark">
                            missionsoffice@cmcvellore.ac.in
                        </a>
                    </p>
                    <p class="mb-2">
                        <i class="fa-phone-alt fas me-2 secondary-color"></i>
                        <strong>Phone:</strong>
                        <a href="tel:+914162286171" class="text-decoration-none text-dark">
                            0416-2286117
                        </a>
                    </p>
                    <p>
                        <i class="fa-map-marker-alt fas me-2 secondary-color"></i>
                        <strong>Address:</strong>
                        <span class="text-dark">CMC Vellore - 632007</span>
                    </p>
                </div>
            </div>
        </div>
    </div>
</div>


`:''}

${data.postLogin?`
<div class="container-fluid fadeIn-up d-flex flex-column bg-white">
    ${data.currPage ? `<i class="bg-opacity-10 fa-arrow-left fas rounded position-absolute start-0 top-0 m-2 fs-2"
        onclick="${data.currPage}"></i>` : ''}

    <div class="container text-center mt-3">
        <h4>Mission Hospitals Map</h4>
        <p>CMC’s mission hospital network comprises around 200 hospitals across the country, primarily serving rural and
            underserved regions. In many of these areas, these hospitals are the only source of accessible, affordable,
            and dependable healthcare. The interactive map allows you to view them and identify opportunities to
            contribute. ${data.role.includes("Missions") ?` Please use the filter option to
            refine by state, department and manpower needs.`:` `}
        </p>
    </div>
    <!-- Row 1: Search and Filter -->
    <div class="row justify-content-center mt-2">
        <div class="col-12 col-md-4 d-flex align-items-center justify-content-between p-2">

            <!-- Search Input -->
            <div class="search-container position-relative flex-grow-1 me-2">
                <input type="text" id="searchInput" class="form-control" placeholder="Search..."
                    oninput="showSuggestions()">
                <button id="clearSearch" onclick="clearSearch()" class="clear-btn position-absolute end-0 me-2"
                    style="display: none;">&times;</button>
                <div class="suggestions position-absolute w-100 bg-white shadow rounded" id="suggestionsBox"
                    style="display: none;"></div>
            </div>

            <!-- Combined Filter Dropdown -->
            <div class="dropdown" data-bs-auto-close="outside">
                <button class="btn border d-flex align-items-center bg-white" type="button" data-bs-toggle="dropdown">
                    <i class="fa fa-filter me-2 secondary-color"></i> Filters
                </button>
                <div class="dropdown-menu p-2"
                    style="width: 270px; max-height: 400px; overflow-y: auto; font-size: small; scrollbar-width: thin;">
                    <div class="accordion" id="filterAccordion">
                        <!-- State Filter Accordion -->
                        <div class="accordion-item">
                            <h3 class="accordion-header" id="headingState">
                                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                                    data-bs-target="#collapseState">
                                    State<span class="arrow-icon ms-auto"><i class="fa fa-chevron-right"></i></span>
                                </button>
                            </h3>
                            <div id="collapseState" class="accordion-collapse collapse"
                                data-bs-parent="#filterAccordion">
                                <ul class="accordion-body list-unstyled p-2" id="stateCheckboxList"></ul>
                            </div>
                        </div>
                        ${data.role.includes("Missions") ?`
                        <!-- Department Filter Accordion -->
                        <div class="accordion-item">
                            <h3 class="accordion-header" id="headingDepartment">
                                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                                    data-bs-target="#collapseDepartment">
                                    Department<span class="arrow-icon ms-auto"><i
                                            class="fa fa-chevron-right"></i></span>
                                </button>
                            </h3>
                            <div id="collapseDepartment" class="accordion-collapse collapse"
                                data-bs-parent="#filterAccordion">
                                <ul class="accordion-body list-unstyled p-2" id="departmentCheckboxList"></ul>
                            </div>
                        </div>

                        <!-- Manpower Filter Accordion -->
                        <div class="accordion-item">
                            <h3 class="accordion-header" id="headingManpower">
                                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                                    data-bs-target="#collapseManpower">
                                    Manpower<span class="arrow-icon ms-auto"><i class="fa fa-chevron-right"></i></span>
                                </button>
                            </h3>
                            <div id="collapseManpower" class="accordion-collapse collapse"
                                data-bs-parent="#filterAccordion">
                                <ul class="accordion-body list-unstyled p-2" id="manpowerCheckboxList"></ul>
                            </div>
                        </div>
                        ` : ''}
                    </div>

                    <!-- Clear All Filters -->
                    <div class="text-center mt-3">
                        <div id="Clearfilters" class="ms-1"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Row 3: Map and Cards -->
    <div class="row flex-grow-1 justify-content-center m-0">
        <div class="col-12 col-md-8 mb-2 p-0">
            <div id="contactMap" class="w-100 shadow border rounded-3" style="min-height: 300px; height: 70vh;"></div>
            <!-- Map Legend -->
            <div class="d-flex justify-content-start align-items-center mt-2 mb-2 ps-2" id="mapLegend"
                style="font-size: small;">
                <div class="d-flex align-items-center me-4">
                    <span class="text-center"><img src="./images/icons/location-icon.png"
                            style="height: 25px; width: 25px;">Network Hospitals</span>
                </div>
                <div class="d-flex align-items-center">
                    <span class="text-center"><img src="./images/icons/pin.png" style="height: 25px; width: 25px;">Non
                        Network Hospitals</span>
                </div>
            </div>

        </div>
        <div class="col-12 col-md-3 p-0 d-flex flex-column align-items-center">
            <div id="hospitalCards" class="w-100 overflow-auto rounded-3"
                style="max-height: 70vh; scrollbar-width: thin;"></div>
        </div>
    </div>
</div>
`:''}`;
  },
"about": function(data) {
    return `    <div class="fadeIn-up container-fluid">
        <div class="fs-1 my-5">About CMCV Connect</div>
        <div class="d-flex flex-md-row flex-column p-3">
          <div class="col-12 col-md-4 d-flex justify-content-center">
            <img class="img-fluid px-2 mb-3"style="max-height: 350px;" src="https://s3.us-east-1.amazonaws.com/img.studenthub.in/missionsSiteImages/prelogin/about01.jpg" alt="">
          </div>
          <div class="col-12 col-md-4 d-flex justify-content-center">
            <img class="img-fluid px-2 mb-3"style="max-height: 350px;" src="https://s3.us-east-1.amazonaws.com/img.studenthub.in/missionsSiteImages/prelogin/about02.png" alt="">
          </div>
          <div class="col-12 col-md-4 d-flex justify-content-center">
            <img class="img-fluid px-2 mb-3"style="max-height: 350px;" src="https://s3.us-east-1.amazonaws.com/img.studenthub.in/missionsSiteImages/prelogin/about03.jpg" alt="">
          </div>
        </div>
        <div class="d-flex flex-md-row flex-column p-3">
          <div class="col-12 col-md-4 p-2">
            <h3 class="text-center">What is CMCV Connect?</h3>
            <div class="border border-dark w-100 my-2"></div>
            <h5 class="my-4">A chance to serve together</h5>
            <p>
              CMCV Connect is an online platform designed to foster collaboration and connection among individuals who align
              with the ethos of CMC Vellore: “not to be served but to serve.” CMCV Connect serves as a virtual hub where
              stakeholders from diverse backgrounds converge to share ideas, resources, and expertise
            </p>
      
          </div>
          <div class="col-12 col-md-4 p-2">
            <h3 class="text-center">Who can connect?</h3>
            <div class="border border-dark w-100 my-2"></div>
            <h5 class="mb-2">Anyone with a heart for service</h5>
            <p>
              Health professionals, volunteers, donors, well-wishers, and anyone interested in India’s healthcare scenario can participate in this collaboration. Students interested in serving in different regions of India are also encouraged to join in.
            </p>
      
          </div>
          <div class="col-12 col-md-4 p-2">
            <h3 class="text-center">How do I Connect?</h3>
            <div class="border border-dark w-100 my-2"></div>
            <h5 class="mb-2">Contact us</h5>
            <p>
              Simply fill up the form on the ‘Contact Us’ page of this site, and the Missions office of CMC Vellore will get back to you. Tell us about yourself and how you would like to be involved.
            </p>
      
          </div>
        </div>
    </div>`;
  },
"mission": function(data) {
    return `

<!-- <main class="bg-primarycolor"> -->
    <div class="container-fluid pt-3 z-1">
    
    <div class="row" data-row="row-1">
      
      
      
      
      <div class="col-12 mb-0 col-md-12" data-column="col-1">
        
        
        <div class="col-12 mb-2 mb-md-4 " data-row-col="card-row1-column-1">
            
          
<div class="card shadow bg-opacity-10 overflow-hidden">
  
  <div class="card-body p-2 p-md-3">
    
    
    ${data.whatsNew}
    

    

    
  </div>
</div>

          
        </div>
        
      </div>
      
    </div>
    
    <div class="row" data-row="row-2">
      
      
      
      
      <div class="col-12 mb-0 col-md-4" data-column="col-1">
        
        
        <div class="col-12 mb-2 mb-md-4 " data-row-col="card-row2-column-1">
            
          
<div class="card shadow bg-opacity-10 overflow-hidden">
  
  <div class="card-header border-0 ">
    <h5 class="d-flex justify-content-between align-items-center">Thought for the day <img
        class='img-thumbnail-rounded '
        src="./images/dove.svg" width="25"
        height="25" ></h5>
  </div>
  
  <div class="card-body p-2 p-md-3">
    
    
    <div class="mb-0 " >
      <div class="cnt">${data.thoughtOfDay || "“Whenever GOD determines to do a great work, HE first sets HIS people to pray.” - Charles Spurgeon" }</div>
    </div>
    

    
  </div>
</div>

          
        </div>
        
        
        <div class="col-12 mb-2 mb-md-4 " data-row-col="card-row2-column-1">
            
            
<div class="card border-0 bg-transparent">
  <div class="row g-3 align-items-stretch">

    
    <div class="col-12 col-md-5-5 d-flex">

      
      <div class="card text-center shadow p-2 w-100 h-100  custom-card "
        onclick='navigateTo(&#39;contact&#39;, { postLogin: true, currPage: &#39;renderMissionsPage()&#39;, role: &#39;Missions&#39; }, [&#39;loadHospitalIdsAndMap&#39;, []]);'>

        <div class="card-main-content">
          <div class="card-content picture px-md-4 py-3 d-flex justify-content-center align-items-center flex-grow-1">
            
            <img src="./images/icons/india-icon1.png" class="img-fluid card-icon" alt="Icon">
            
          </div>

          <div class="card-footer bg-transparent border-0 w-100">
            <h5 class="text-wrap connect-text-darkblue mb-0">
              Mission Hospitals
            </h5>
          </div>
        </div>
        
        <div class="card-hover-overlay d-flex justify-content-center align-items-center">
          <p class="hover-message m-0 px-3">View our mission hospitals</p>
        </div>
        

      </div>
      

    </div>
    
    <div class="col-12 col-md-5-5 d-flex">

      
      <div class="d-flex flex-column w-100 h-100 gap-3">

        
        <div class="flex-fill d-flex">
          <span id="" class="statusCount"></span>

          <div class="card shadow-sm w-100 d-flex align-items-center split-card" onclick='navigateTo(&#39;secondOpinionModule&#39;, {}, []);'>

            <div class="row align-items-center w-100 g-2 g-md-3">

              <!-- Icon -->
              <div class="col-4 col-md-5 d-flex justify-content-center">
                
                <img src="./images/icons/opinionIcon.png" class="img-fluid split-card-icon" alt="Icon">
                
              </div>

              <!-- Text -->
              <div class="col-8 col-sm-7">
                <h5 class="mb-0 connect-text-darkblue">
                  Second-Opinion Connect
                </h5>
              </div>

            </div>
          </div>

        </div>
        
        <div class="flex-fill d-flex">
          <span id="networkConslt" class="statusCount"></span>

          <div class="card shadow-sm w-100 d-flex align-items-center split-card" onclick='navigateTo(&#39;networkConslt&#39;, {}, [&#39;enableNetConsltRolesPage&#39;, []]);'>

            <div class="row align-items-center w-100 g-2 g-md-3">

              <!-- Icon -->
              <div class="col-4 col-md-5 d-flex justify-content-center">
                
                <img src="https://s3.amazonaws.com/img.studenthub.in/CMCVConnect_Portal/Pictures/_0fbb4d606fae3f3c4387747ef92ad750_Pictures.png" class="img-fluid split-card-icon" alt="Icon">
                
              </div>

              <!-- Text -->
              <div class="col-8 col-sm-7">
                <h5 class="mb-0 connect-text-darkblue">
                  Network Consults
                </h5>
              </div>

            </div>
          </div>

        </div>
        

      </div>

      

    </div>
    

  </div>
</div>

          
        </div>
        
        
        <div class="col-12 mb-2 mb-md-4 " data-row-col="card-row2-column-1">
            
          
<div class="card shadow bg-opacity-10 overflow-hidden">
  
  <div class="card-header border-0 ">
    <h5 class="d-flex justify-content-between align-items-center">Grand Rounds <img
        class='img-thumbnail-rounded '
        src="../images/icons/grandRounds.png" width="25"
        height="25" ></h5>
  </div>
  
  <div class="card-body p-2 p-md-3">
    
    

    <div class="row g-3 align-items-center">
      <div class="col-12 col-sm-4 col-md-3 text-center">
        <img class="me-3 ms-2"
          src="https://s3.amazonaws.com/img.studenthub.in/CMCVConnect_Portal/Pictures/_b5c59b98f37db017af29c626a296f835_Pictures.png"
          height="100" width="100" alt="Grand Rounds Image">
      </div>
      <div class="col-12 col-sm-8 col-md-9">
        <h6 class="fw-semibold text-center mb-2">
          Ongoing Grand Rounds
        </h6>
        <div class="grandRounds-list">
          ${data.grandRounds}
        </div>
      </div>
    </div>

    
    <div class="text-end">
      <button class="btn bg-info-subtle py-1 px-2 rounded-3"
        onclick="navigateTo('grandRounds', {backTo: 'renderPostHomePage()'}, [['loadGrandRoundsTable', []], ['loadGrandRoundsVideos', [10]]]);">Read
        More</button>
    </div>

    

    
  </div>
</div>

          
        </div>
        
        
        <div class="col-12 mb-2 mb-md-4 d-flex " data-row-col="card-row2-column-1">
            
            
<div class="d-flex flex-wrap w-100 justify-content-around">
  
  
  <div class="p-1 p-md-2 d-flex flex-column flex-wrap align-items-center justify-content-center subcard z-1 
 
     mb-2"
    style="color:white;background-color: #99d77f;"
    onclick="loadSubcard('learningResources','','renderMissionsPage()')">
    <i class=" rounded bg-opacity-10 fab fa-readme "></i>
    <p class=" text-bold  text-center mb-0">Learning Resources </p>
  </div>
  
  <div class="p-1 p-md-2 d-flex flex-column flex-wrap align-items-center justify-content-center subcard z-1 
 
     mb-2"
    style="color:white;background-color: #232342;"
    onclick="loadSubcard('manpowerRequest','','renderMissionsPage()')">
    <i class=" rounded bg-opacity-10 fas fa-users "></i>
    <p class=" text-bold  text-center mb-0">Manpower Requests </p>
  </div>
  
  <div class="p-1 p-md-2 d-flex flex-column flex-wrap align-items-center justify-content-center subcard z-1 
 
     mb-2"
    style="color:white;background-color: #6470aa;"
    onclick="loadSubcard('dls','','renderMissionsPage()')">
    <i class=" rounded bg-opacity-10 fas fa-user-md "></i>
    <p class=" text-bold  text-center mb-0">DLS </p>
  </div>
  
  <div class="p-1 p-md-2 d-flex flex-column flex-wrap align-items-center justify-content-center subcard z-1 
 
     mb-2"
    style="color:white;background-color: #2d2d0b;"
    onclick="loadSubcard('nabhEntryLevel','','renderMissionsPage()')">
    <i class=" rounded bg-opacity-10 far fa-id-card "></i>
    <p class=" text-bold  text-center mb-0">NABH Entry Level </p>
  </div>
  
  <div class="p-1 p-md-2 d-flex flex-column flex-wrap align-items-center justify-content-center subcard z-1 
 
     mb-2"
    style="color:white;background-color: #54546c;"
    onclick="loadSubcard('legalHelp','','renderMissionsPage()')">
    <i class=" rounded bg-opacity-10 fas fa-hands-helping "></i>
    <p class=" text-bold  text-center mb-0">Legal Help </p>
  </div>
  
  <div class="p-1 p-md-2 d-flex flex-column flex-wrap align-items-center justify-content-center subcard z-1 
 
     mb-2"
    style="color:white;background-color: #c32828;"
    onclick="loadSubcard('missionHospitalVisits','','renderMissionsPage()')">
    <i class=" rounded bg-opacity-10 fas fa-hospital-symbol "></i>
    <p class=" text-bold  text-center mb-0">Mission Hospital Visits </p>
  </div>
  
  <div class="p-1 p-md-2 d-flex flex-column flex-wrap align-items-center justify-content-center subcard z-1 
 
     mb-2"
    style="color:white;background-color: #0f4748;"
    onclick="loadSubcard('equipment','','renderMissionsPage()')">
    <i class=" rounded bg-opacity-10 fas fa-dolly-flatbed "></i>
    <p class=" text-bold  text-center mb-0">Equipment </p>
  </div>
  
  <div class="p-1 p-md-2 d-flex flex-column flex-wrap align-items-center justify-content-center subcard z-1 
 
     mb-2"
    style="color:white;background-color: #1b265a;"
    onclick="loadSubcard('libraryAccess','https://forms.office.com/r/qjPaux8a4x','renderMissionsPage()')">
    <i class=" rounded bg-opacity-10 far fa-id-card "></i>
    <p class=" text-bold  text-center mb-0">Library Access </p>
  </div>
  
  <div class="p-1 p-md-2 d-flex flex-column flex-wrap align-items-center justify-content-center subcard z-1 
 
     mb-2"
    style="color:white;background-color: #b89d7a;"
    onclick="loadSubcard('research','','renderMissionsPage()')">
    <i class=" rounded bg-opacity-10 fas fa-newspaper "></i>
    <p class=" text-bold  text-center mb-0">Research </p>
  </div>
  
  <div class="p-1 p-md-2 d-flex flex-column flex-wrap align-items-center justify-content-center subcard z-1 
 
     mb-2"
    style="color:white;background-color: #858596;"
    onclick="loadSubcard('shiloh','','renderMissionsPage()')">
    <i class=" rounded bg-opacity-10 fas fa-warehouse "></i>
    <p class=" text-bold  text-center mb-0">Shiloh </p>
  </div>
  
  <div class="p-1 p-md-2 d-flex flex-column flex-wrap align-items-center justify-content-center subcard z-1 
 
     mb-2"
    style="color:white;background-color: #c49e68;"
    onclick="loadSubcard('connectNewsletter','','renderMissionsPage()')">
    <i class=" rounded bg-opacity-10 fas fa-newspaper "></i>
    <p class=" text-bold  text-center mb-0">Connect Newsletter </p>
  </div>
  
  <div class="p-1 p-md-2 d-flex flex-column flex-wrap align-items-center justify-content-center subcard z-1 
 
     mb-2"
    style="color:white;background-color: #dcbbe2;"
    onclick="loadSubcard('missionDesk','','renderMissionsPage()')">
    <i class=" rounded bg-opacity-10 fas fa-desktop "></i>
    <p class=" text-bold  text-center mb-0">Mission Desk </p>
  </div>
  
  
</div>

            
        </div>
        
      </div>
      
      <div class="col-12 mb-0 col-md-4" data-column="col-2">
        
        
        <div class="col-12 mb-2 mb-md-4 " data-row-col="card-row2-column-2">
            
          
<div class="card shadow bg-opacity-10 overflow-hidden">
  
  <div class="card-header border-0 ">
    <h5 class="d-flex justify-content-between align-items-center">Hospitals <img
        class='img-thumbnail-rounded '
        src="./images/feather-solid.svg" width="25"
        height="25" ></h5>
  </div>
  
  <div class="card-body p-2 p-md-3">
    
    
    

    <div class="d-flex flex-wrap justify-content-start pt-2 pb-2" style="max-height: 400px; overflow: auto;">
      


      
      ${data.allottedHospitals}
      

      
      
    </div>
    

    
  </div>
</div>

          
        </div>
        
        
        <div class="col-12 mb-2 mb-md-4 " data-row-col="card-row2-column-2">
            
            

<div class="card text-center shadow p-2 d-flex h-100 border-0 pe-pointer p-0" onclick="navigateTo(&#39;clinicalSnip&#39;, {}, [&#39;loadClinicalSnip&#39;,[]]);"
  data-flipbook="">
  
  <div class="card-header border-0 text-start">
    <h5 class="mb-0">Clinical Snippets</h5>
  </div>
  
  <div class="flex-lg-row d-flex flex-column align-items-center px-5">
    <div class="card-content picture py-1 position-relative">
      
      
      <img src="../images/icons/Open_Book.png" width="120" alt="Icon">
      
    </div>
    <div class="card-footer bg-transparent border-0 w-100 p-0">
      <h5 class="text-secondary"></h5>
      <h2 class="text-wrap  connect-text-darkblue "
        style="font-size: larger;">
        Take a quiz!!
        
        
      </h2>
    </div>
  </div>
</div>


            
        </div>
        
        
        <div class="col-12 mb-2 mb-md-4 " data-row-col="card-row2-column-2">
            
          
<div class="card shadow bg-opacity-10 overflow-hidden">
  
  <div class="card-header border-0 ">
    <h5 class="d-flex justify-content-between align-items-center">News <img
        class='img-thumbnail-rounded '
        src="./images/file.svg" width="25"
        height="25" ></h5>
  </div>
  
  <div class="card-body p-2 p-md-3">
    
    <div class="text-end" style="margin-top: -5px;"><span class="px-2 py-1 bg-info-subtle rounded-3 pe-pointer"
        onclick="loadAllNews('faculty', 'renderMissionsPage()')">View all</span></div>
    <div class=" demo rounded-3">
      ${data.renderedNews}
    </div>
    

    
  </div>
</div>

          
        </div>
        
      </div>
      
      <div class="col-12 mb-0 col-md-4" data-column="col-3">
        
        
        <div class="col-12 mb-2 mb-md-4 " data-row-col="card-row2-column-3">
            
          
<div class="card shadow bg-opacity-10 overflow-hidden">
  
  <div class="card-header border-0 ">
    <h5 class="d-flex justify-content-between align-items-center">Weekly Manna <img
        class='img-thumbnail-rounded '
        src="./images/prayer-hands.png" width="25"
        height="25" ></h5>
  </div>
  
  <div class="card-body p-2 p-md-3">
    
    <div class="text-end">
      <i class="fas fa-info-circle ms-2 text-muted" data-bs-toggle="tooltip" data-bs-placement="right"
        title="Maitiri, CMC"></i>
      <button class="btn bg-info-subtle py-1 px-2 rounded-3"
        onclick="navigateTo('weeklyManna', {}, ['loadWeeklyMannaTable', []]);">View all</button>
    </div>
    
    ${data.weeklyManna}
    

    

    
  </div>
</div>

          
        </div>
        
        
        <div class="col-12 mb-2 mb-md-4 " data-row-col="card-row2-column-3">
            
            

<div class="card text-center shadow p-2 d-flex h-100 border-0 pe-pointer p-0" onclick="navigateTo(&#39;academicConclave&#39;, {}, [&#39;loadMap&#39;, [&#39;conclaveHsptlMap&#39;]]);"
  data-flipbook="">
  
  <div class="card-header border-0 text-start">
    <h5 class="mb-0">Medical Colleges Conclave</h5>
  </div>
  
  <div class="flex-lg-row d-flex flex-column align-items-center">
    <div class="card-content picture py-1 position-relative">
      
      
      <img src="https://s3.amazonaws.com/img.studenthub.in/CMCVConnect_Portal/Pictures/_95ba291d20881589e4a4c4e099df0af6_Pictures.png" width="150" alt="Icon">
      
    </div>
    <div class="card-footer bg-transparent border-0 w-100 p-0">
      <h5 class="text-secondary"></h5>
      <h2 class="text-wrap  connect-text-darkblue "
        style="font-size: medium;">
        Bringing together Christian institutions to strengthen Education, Service, Research &amp; Outreach in our nation.
        
        
      </h2>
    </div>
  </div>
</div>


            
        </div>
        
        
        <div class="col-12 mb-2 mb-md-4 " data-row-col="card-row2-column-3">
            
            

<div class="card text-center shadow p-2 d-flex h-100 border-0 pe-pointer p-0" onclick="openNewsletter(this)"
  data-flipbook="https://online.fliphtml5.com/cmcvellore/Mission-Connect---NL-2026-Vol1-Iss-2/">
  
  <div class="card-header border-0 text-start">
    <h5 class="mb-0">Missions Connect Newsletter</h5>
  </div>
  
  <div class="flex-lg-row d-flex flex-column">
    <div class="card-content picture py-1 position-relative">
      
      
      <img src="https://s3.amazonaws.com/img.studenthub.in/CMCVConnect_Portal/Pictures/_53841622cdbeb07dc31398aa3346b1f6_Pictures.png" width="150" alt="Icon">
      
    </div>
    <div class="card-footer bg-transparent border-0 w-100 align-content-center">
      <h5 class="text-secondary"></h5>
      <h2 class="text-wrap  connect-text-darkblue "
        style="font-size: larger;">
        Do you have a story to share?
        <br><br><small class="text-muted">We would love to hear from you. Please write to us @ missionconnect@cmcvellore.ac.in</small> <br>
        
        <button class="btn btn-sm secondary-bg-color text-white ms-2 mt-3" onclick=" ">Click here to read the Volumn 1 | Issue 2</button>
        
      </h2>
    </div>
  </div>
</div>

<!-- Model area -->

<div class="modal fade" id="newsletterModal" tabindex="-1">

  <div class="modal-dialog modal-xl modal-dialog-centered">

    <div class="modal-content">

      <div class="modal-header">

        <h5 class="modal-title">
          Missions Connect Newsletter
        </h5>

        <button type="button" class="btn-close" data-bs-dismiss="modal">
        </button>

      </div>

      <div class="modal-body p-0">

        <iframe id="newsletterFrame" width="100%" height="700" frameborder="0" allowfullscreen>
        </iframe>

      </div>

    </div>

  </div>

</div>


            
        </div>
        
        
        <div class="col-12 mb-2 mb-md-4 " data-row-col="card-row2-column-3">
            
            

<div class="card text-center shadow p-2 d-flex h-100 border-0 pe-pointer p-0" onclick="openModal(&#39;formIO&#39;, null, &#39;&#39;), connectFeedbackForm()"
  data-flipbook="">
  
  <div class="card-header border-0 text-start">
    <h5 class="mb-0">Feedback</h5>
  </div>
  
  <div class="">
    <div class="card-content picture py-1 position-relative">
      
      
      <img src="https://s3.amazonaws.com/img.studenthub.in/CMCVConnect_Portal/Pictures/_dede857b58548dae8724c6d04fda3737_Pictures.png" width="120" alt="Icon">
      
    </div>
    <div class="card-footer bg-transparent border-0 w-100 ">
      <h5 class="text-secondary"></h5>
      <h2 class="text-wrap  connect-text-darkblue "
        style="font-size: medium;">
        Please take a moment to share your feedback.
        
        
      </h2>
    </div>
  </div>
</div>


            
        </div>
        
      </div>
      
    </div>
    
  </div>
<!-- </main> -->
`;
  },
"council": function(data) {
    return `

<!-- <main class="fadeIn-up" > -->
    <div class="container-fluid pt-3 fadeIn-up bg-white">
    
    <div class="row" data-row="row-1">
        
        
        <div class="col-12 mb-2 mb-md-4 " data-row-col="card-row1-column-">
            
            
            
<div class="card shadow bg-opacity-10 overflow-hidden">
  
  <div class="card-header border-0 ">
    <h5 class="d-flex justify-content-between align-items-center">Welcome Note <img
        class='img-thumbnail-rounded '
        src="./images/feather-solid.svg" width="25"
        height="25" ></h5>
  </div>
  
  <div class="card-body p-2 p-md-3">
    
    <blockquote class="blockstyle fs-5 p-2 p-md-4 fst-italic ">
      Welcome to the Council Member's Section of CMCVConnect.
      This is a confidential section accessible only to Council members of the CMC Vellore
      Association.
      Data on this page is from the records in the Council Office.
      If there are any discrepancies in the data displayed, kindly contact us at
      <span class="triangle"></span><span class="secondary-color text-end">
          councilsecretary@cmcvellore.ac.in</span>
    </blockquote>
    <div class="mb-0 " >
      <div class="cnt"></div>
    </div>
    

    
  </div>
</div>

            
        </div>
        
    </div>
    
    <div class="row" data-row="row-2">
        
        
        <div class="col-12 mb-2 mb-md-4 col-md-4" data-row-col="card-row2-column-">
            
            
            
<div class=" mb-2 mb-md-4 profile-card-3 shadow rounded w-100 position-relative overflow-hidden h-100 bg-white style="
  min-height: 300px;" >
  <div class="d-flex justify-content-center align-items-center w-100 position-relative" style="height: 200px;">
    
    <img src=${data.avatar} alt="profile-image" class="profile rounded-circle z-1"
      onerror="this.onerror=null; this.src='https://s3.amazonaws.com/img.studenthub.in/CMCVConnect_Portal/Pictures/_43782473c4ed75b1e167091821a4d700_Pictures.png'" />
  </div>
  <div class="text-center px-2 pb-3">
    <h2 class="connect-text-darkblue text-capitalize">${data.headOfOrg.headOfOrganizationName}</h2>
    <small class="text-secondary">Head of Organization</small>
  </div>
</div>

            
        </div>
        
        
        <div class="col-12 mb-2 mb-md-4 col-md-2-5" data-row-col="card-row2-column-">
            
            
            
<a href="https://cmcv.sharepoint.com/sites/TheCMCVelloreAssociation" target="_blank" class="text-decoration-none text-reset">
  <div class="card custom-card p-1 shadow text-center border-0 mb-4 d-flex h-100" style="color: ;">
    <div class="card-content navbar-brand ">
      <div class="card-body media">
        
        
        <i class="${data.councilDoc.chooseAnIcon} fa-4x" aria-hidden="true"></i>
        <hr />
        <h3 class="connect-text-darkblue">${data.councilDoc.cardName}</h3>
      </div>
      <div class="card-footer bg-transparent border-0">
        <em class="text-wrap secondary-color"><sup>*</sup>Please click on the Council Documents
                            icon to access the agenda and minutes of the Council Meetings</em>
      </div>
      
    </div>
  </div>
</a>

            
        </div>
        
        
        <div class="col-12 mb-2 mb-md-4 col-md-2-5" data-row-col="card-row2-column-">
            
            
            

<div class="card text-center shadow p-2 d-flex h-100 border-0" onclick=""
  data-flipbook="">
  
  <div class="">
    <div class="card-content picture py-1 position-relative">
      
      <img class="p-3 rounded-circle" src="./images/flower1.svg" width="120" alt=""
        style="background-color:#d2652d;">
      
      
    </div>
    <div class="card-footer bg-transparent border-0 w-100 ">
      <h5 class="text-secondary">Organization</h5>
      <h2 class="text-wrap  connect-text-darkblue "
        style="font-size: 1.5rem;">
        ${data.headOfOrg.councilMemberOrganizationName}
        
        
      </h2>
    </div>
  </div>
</div>


            
        </div>
        
        
        <div class="col-12 mb-2 mb-md-4 col-md-2-5" data-row-col="card-row2-column-">
            
            
            
<a href="https://cmcv.sharepoint.com/sites/CMCConsultations" target="_blank" class="text-decoration-none text-reset">
  <div class="card custom-card p-1 shadow text-center border-0 mb-4 d-flex h-100" style="color: ;">
    <div class="card-content navbar-brand ">
      <div class="card-body media">
        
        <img class="p-3 rounded-circle" src="./images/icons/consult.png" width="120" alt=""
          style="background-color:#d2652d !important;">
        <h4 class="text-secondary mt-4">Consultation 2025</h4>
        
        
    </div>
  </div>
</a>

            
        </div>
        
    </div>
    
    <div class="row" data-row="row-3">
        
        
        <div class="col-12 mb-2 mb-md-4 " data-row-col="card-row3-column-">
            
            
        </div>
        
    </div>
    
    <div class="row" data-row="row-4">
        
        
        <div class="col-12 mb-2 mb-md-4 " data-row-col="card-row4-column-">
            
            
            
<div class="card shadow bg-opacity-10 overflow-hidden">
  
  <div class="card-header border-0 ">
    <h5 class="d-flex justify-content-between align-items-center">Organization Members <img
        class='img-thumbnail-rounded '
        src="./images/feather-solid.svg" width="25"
        height="25" ></h5>
  </div>
  
  <div class="card-body p-2 p-md-3">
    
    
    

    <div class="d-flex flex-wrap justify-content-start pt-2 pb-2" style="max-height: 400px; overflow: auto;">
      
      ${data.councilCardData}
      


      

      
      
    </div>
    

    
  </div>
</div>

            
        </div>
        
    </div>
    
    </div>
<!-- </main> -->



`;
  },
"manpowerRequest": function(data) {
    return `

<div class="bg-white">
  <div class="position-relative">
    <h2 class="text-center bg-white p-3 rounded msnHospTitle connect-primary-border">Manpower Requests</h2>
    <i class="bg-opacity-10 fa-arrow-left fas rounded position-absolute start-0 top-0 m-3 fs-2 pe-pointer"onclick="renderPostHomePage(); clearGlobalFilters();"></i>
  </div>

  <div class="container-fluid px-3">
    <div class="row">

      <!-- Left column: card -->
      <div class="col-md-3 mt-5 pe-0">
        <div class="container-fluid pt-3 z-1">
          
          <div class="row" data-row="row-undefined">
            
            
            
            
            <div class="col-12 mb-0 col-md-12" data-column="col-undefined">
              
              <div class="col-12 mb-2 mb-md-4 "
                data-row-col="card-rowundefined-column-undefined">
                
                
<p class="fst-italic text-info" style="font-size: 15px;">
  <button id="clearStatusFilters" class="btn btn-sm secondary-bg-color text-white ms-2">Clear All</button>* Reclick the
  cards to unselect
</p>
<div class="d-flex flex-wrap w-100 justify-content-around">
  
  <button type="button" class="p-1 p-md-2 d-flex flex-column flex-wrap align-items-center justify-content-center subcard z-1
        
        d-flex align-items-center shadow rounded-3 status-filter-btn btn" data-status="submitted"
    style="border-top: 5px solid #addae6 !important; background-color: white;">

    <div class="d-flex align-items-center gap-3">
      <i class="fas fa-paper-plane" style="color: #addae6;"></i>
      <div class="fs-2 text-dark" id="manpowerStatus1"></div>
    </div>
    <p class="fw-light text-dark mb-0">Submitted</p>
  </button>
  
  <button type="button" class="p-1 p-md-2 d-flex flex-column flex-wrap align-items-center justify-content-center subcard z-1
        
        d-flex align-items-center shadow rounded-3 status-filter-btn btn" data-status="in progress"
    style="border-top: 5px solid #b0e694 !important; background-color: white;">

    <div class="d-flex align-items-center gap-3">
      <i class="fas fa-subway" style="color: #b0e694;"></i>
      <div class="fs-2 text-dark" id="manpowerStatus2"></div>
    </div>
    <p class="fw-light text-dark mb-0">In Progress</p>
  </button>
  
</div>

                

              </div>
              
            </div>
            
          </div>
          
        </div>
      </div>

      <!-- Right column: Table -->
      <div class="col-md-9 mb-3 ps-0">
        <div class="overflow-auto p-3 ">
        <table id="viewMissionTable" class="display mb-3" width="100%"></table>
      </div></div>

    </div>
  </div>

</div>
`;
  },
"missionHospitalUser": function(data) {
    return `
<div class="container-fluid p-2 p-md-5 bg-white ">
  <div class="position-relative">
    <h2 class="text-center mb-5 p-4 rounded msnHospTitle connect-primary-border">${data.missionHospital}</h2>
    <i class="bg-opacity-10 fa-arrow-left fas fs-2 rounded position-absolute start-0 top-0 m-3" onclick="renderMissionsPage(); clearGlobalFilters();"></i>
  </div>
  
      <!-- Offcanvas view on mobile and tablets -->
      <div class="offcanvas offcanvas-start d-lg-none" tabindex="-1" id="offcanvasHam" aria-labelledby="missHospialUser">
        <div class="offcanvas-header">
          <h5 class="offcanvas-title" >Offcanvas</h5>
          <button type="button" class="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>
        <div class="offcanvas-body">
          <ul class="list-group">
            <li class="list-group-item "  data-bs-target="#msnUsrHome"  data-bs-toggle="tab" data-bs-dismiss="offcanvas">Home</li>
            <li class="list-group-item "  data-bs-target="#msnRequest"  data-bs-toggle="tab" data-bs-dismiss="offcanvas">Mission Request</li>
            <li class="list-group-item "  data-bs-target="#msnHospgallery" data-bs-toggle="tab" data-bs-dismiss="offcanvas">Gallery</li>
            <li class="list-group-item "  data-bs-target="#msnLegalHelp" data-bs-toggle="tab" data-bs-dismiss="offcanvas" >LegalHelp</li>
            <li class="list-group-item "  data-bs-target="#msnFinance" data-bs-toggle="tab" data-bs-dismiss="offcanvas">Finance</li>
          </ul>
        </div>
      </div>
      
            <!-- Hamburger button for offcanvas -->
            <button class="btn btn-default secondary-bg-color d-lg-none" type="button" data-bs-target="#offcanvasHam" data-bs-toggle="offcanvas" >
              <span class="navbar-toggler-icon"><i class="fas fa-bars fs-3 text-white"></i></span>
            </button>
      <!-- Tabs view on desktop -->
      <div class="container-fluid d-none d-lg-block" >
        <ul class="nav nav-tabs"  role="tablist">
          <li class="nav-item" role="presentation">
            <button class="nav-link active"  data-bs-toggle="tab" data-bs-target="#msnUsrHome" type="button" role="tab" aria-controls="home" aria-selected="true">Home</button>
          </li>
          <li class="nav-item" role="presentation">
            <button class="nav-link" data-bs-toggle="tab" data-bs-target="#msnRequest" type="button" role="tab" aria-controls="msnRequest" aria-selected="false">Mission Request</button>
          </li>
          <li class="nav-item" role="presentation">
            <button class="nav-link" data-bs-toggle="tab" data-bs-target="#msnHospgallery" type="button" role="tab" aria-controls="msnHospgallery" aria-selected="false">Gallery</button>
          </li>
          <li class="nav-item" role="presentation">
            <button class="nav-link" data-bs-toggle="tab" data-bs-target="#msnLegalHelp" type="button" role="tab" aria-controls="msnLegalHelp" aria-selected="false">Legal Help</button>
          </li>
          <li class="nav-item" role="presentation">
            <button class="nav-link" data-bs-toggle="tab" data-bs-target="#msnFinance" type="button" role="tab" aria-controls="msnFinance" aria-selected="false">Finance</button>
          </li>
          
        </ul>
      </div>
   <!-- Tab content below tabs view -->
  
  <div class="tab-content container-fluid p-3 bg-white rounded" style="overflow-x: auto;">
    <div class="tab-pane fade show active" id="msnUsrHome" role="tabpanel" aria-labelledby="msnUsrHome-tab">
      
      
    <div class="row" data-row="row-1">
      
      
      
      
      <div class="col-12 mb-0 col-md-6" data-column="col-1">
        
        
        <div class="col-12 mb-2 mb-md-4 " data-row-col="card-row1-column-1">
          
          
<div class="card shadow bg-opacity-10 overflow-hidden rounded-3">
  
  <div class="card-header border-0 ">
    <h5 class="d-flex justify-content-between align-items-center">About ${data.msnHosp.missionHospitalName} <img
        class='img-thumbnail-rounded '
        src="./images/feather-solid.svg" width="25"
        height="25" ></h5>
  </div>
  
  <div class="card-body p-2 p-md-3">
    
    
    <div class="mb-0 " >
      <div class="cnt">${data.msnHosp.aboutHospital}</div>
    </div>
    

    
  </div>
</div>

          
        </div>
        
        
        <div class="col-12 mb-2 mb-md-4 " data-row-col="card-row1-column-1">
          
          
<div class="card shadow bg-opacity-10 overflow-hidden rounded-3">
  
  <div class="card-body p-2 p-md-3">
    
    <div class="card-header text-center bg-transparent secondary-color">
      <h3> ${data.msnHosp.missionHospitalName} Departments </h3>
    </div>
    <div class="card-content mt-3" style="max-height: 400px; overflow: auto;">
      <table class="table table-light table-striped">
        <thead class="connect-text-darkblue">
          <tr>
            <th scope="col">S.No</th>
            <th scope="col">Departments Name</th>
          </tr>
        </thead>
        <tbody>
          
          ${data.specializationsTable}
          
        </tbody>
      </table>
    </div>
    

    
  </div>
</div>

          
        </div>
        
      </div>
      
      <div class="col-12 mb-0 col-md-6" data-column="col-2">
        
        
        <div class="col-12 mb-2 mb-md-4 " data-row-col="card-row1-column-2">
          
          
<div class="d-flex flex-wrap w-100 justify-content-around">
  
  ${data.statusCardsData}
  
</div>

          
        </div>
        
        
        <div class="col-12 mb-2 mb-md-4 " data-row-col="card-row1-column-2">
          
          
<div class="card shadow bg-opacity-10 overflow-hidden rounded-3">
  
  <div class="card-header border-0 ">
    <h5 class="d-flex justify-content-between align-items-center">Location <img
        class='img-thumbnail-rounded '
        src="./images/feather-solid.svg" width="25"
        height="25" ></h5>
  </div>
  
  <div class="card-body p-2 p-md-3">
    
     <!-- Location for maps  -->
    <div id="mapOnCard" class="w-100" style="min-height: 300px;"></div>
    
    

    <div class="d-flex flex-wrap justify-content-start pt-2 pb-2" style="max-height: 400px; overflow: auto;">
      


      

      
      
    </div>
    

    
  </div>
</div>

          
        </div>
        
        
        <div class="col-12 mb-2 mb-md-4 " data-row-col="card-row1-column-2">
          
          
<div class="card shadow bg-opacity-10 overflow-hidden rounded-3">
  
  <div class="card-header border-0 ">
    <h5 class="d-flex justify-content-between align-items-center">Contact Us <img
        class='img-thumbnail-rounded '
        src="./images/feather-solid.svg" width="25"
        height="25" ></h5>
  </div>
  
  <div class="card-body p-2 p-md-3">
    
    
    

    <div class="d-flex flex-wrap justify-content-start pt-2 pb-2" style="max-height: 400px; overflow: auto;">
      


      

      
      <div class="d-flex flex-column">
        
        <div class="text-start mb-2 d-flex">
          <i class="fa-solid fs-4 me-3 fa-address-book secondary-color"></i>
          <span class="connect-text-darkblue listData">${data.msnHosp.hospitalAddress}</span>
        </div>
        
        <div class="text-start mb-2 d-flex">
          <i class="fa-solid fs-4 me-3 fa-envelope secondary-color"></i>
          <span class="connect-text-darkblue listData">${data.msnHosp.hospitalEmail}</span>
        </div>
        
        <div class="text-start mb-2 d-flex">
          <i class="fa-solid fs-4 me-3 fa-globe secondary-color"></i>
          <span class="connect-text-darkblue listData">${data.msnHosp.hospitalWebsite}</span>
        </div>
        
      </div>

      
      
    </div>
    

    
  </div>
</div>

          
        </div>
        
      </div>
      
    </div>
     
           

    </div>
    <div class="tab-pane fade " id="msnRequest" role="tabpanel" aria-labelledby="msnRequest-tab">
      <table id="msnReqTable" class="display" width="100%"></table>
    </div>
    <div class="tab-pane fade" id="msnHospgallery" role="tabpanel" aria-labelledby="msnHospgallery-tab">
      <div class="container-fluid">
        ${data.galleryTable}
      </div>
    </div>
    <div class="tab-pane fade" id="msnLegalHelp" role="tabpanel" aria-labelledby="msnLegalHelp-tab" >
      <div class="container-fluid p-0">
        <div class="row">
    
          <!-- Left column: card -->
          <div class="col-md-4 mt-5 p-0">
            <div class="container-fluid pt-3 z-1">
              
              <div class="row" data-row="row-undefined">
                
                
                
                
                <div class="col-12 mb-0 px-0 col-md-12" data-column="col-undefined">
                  
                  <div class="col-12 mb-2 mb-md-4 "
                       data-row-col="card-rowundefined-column-undefined">
                    
                      
<p class="fst-italic text-info" style="font-size: 15px;">
  <button id="clearStatusFilters" class="btn btn-sm secondary-bg-color text-white ms-2">Clear All</button>* Reclick the
  cards to unselect
</p>
<div class="d-flex flex-wrap w-100 justify-content-around">
  
  <button type="button" class="p-1 p-md-2 d-flex flex-column flex-wrap align-items-center justify-content-center subcard z-1
         mb-2
        d-flex align-items-center shadow rounded-3 status-filter-btn btn" data-status="submitted"
    style="border-top: 5px solid #addae6 !important; background-color: white;">

    <div class="d-flex align-items-center gap-3">
      <i class="fas fa-paper-plane" style="color: #addae6;"></i>
      <div class="fs-2 text-dark" id="legalHelpStatus1"></div>
    </div>
    <p class="fw-light text-dark mb-0">Submitted</p>
  </button>
  
  <button type="button" class="p-1 p-md-2 d-flex flex-column flex-wrap align-items-center justify-content-center subcard z-1
         mb-2
        d-flex align-items-center shadow rounded-3 status-filter-btn btn" data-status="in progress"
    style="border-top: 5px solid #b0e694 !important; background-color: white;">

    <div class="d-flex align-items-center gap-3">
      <i class="fas fa-subway" style="color: #b0e694;"></i>
      <div class="fs-2 text-dark" id="legalHelpStatus2"></div>
    </div>
    <p class="fw-light text-dark mb-0">In Progress</p>
  </button>
  
  <button type="button" class="p-1 p-md-2 d-flex flex-column flex-wrap align-items-center justify-content-center subcard z-1
         mb-2
        d-flex align-items-center shadow rounded-3 status-filter-btn btn" data-status="completed"
    style="border-top: 5px solid #e57171 !important; background-color: white;">

    <div class="d-flex align-items-center gap-3">
      <i class="fas fa-download" style="color: #e57171;"></i>
      <div class="fs-2 text-dark" id="legalHelpStatus3"></div>
    </div>
    <p class="fw-light text-dark mb-0">Completed</p>
  </button>
  
</div>

                    
    
                  </div>
                  
                </div>
                
              </div>
              
            </div>
          </div>
    
          <!-- Right column: Table -->
          <div class="col-md-8 mb-3 p-0">
            <div class="overflow-auto p-3 ">
            <table id="missionLegalHelp" class="display mb-3" width="100%"></table>
          </div></div>
    
        </div>
      </div>
    </div>

    <div class="tab-pane fade" id="msnFinance" role="tabpanel" aria-labelledby="msnFinance-tab">
      <div class="container-fluid px-3">
        <div class="row">
          <!-- Left column: card -->
          <div class="col-md-4 mt-5 pe-0">
            <div class="container-fluid pt-3 z-1">
              
              <div class="row" data-row="row-undefined">
                
                
                
                
                <div class="col-12 mb-0 col-md-12" data-column="col-undefined">
                  
                  <div class="col-12 mb-2 mb-md-4 "
                       data-row-col="card-rowundefined-column-undefined">
                    
                      
<p class="fst-italic text-info" style="font-size: 15px;">
  <button id="clearStatusFilters" class="btn btn-sm secondary-bg-color text-white ms-2">Clear All</button>* Reclick the
  cards to unselect
</p>
<div class="d-flex flex-wrap w-100 justify-content-around">
  
  <button type="button" class="p-1 p-md-2 d-flex flex-column flex-wrap align-items-center justify-content-center subcard z-1
         mb-2
        d-flex align-items-center shadow rounded-3 status-filter-btn btn" data-status="submitted"
    style="border-top: 5px solid #addae6 !important; background-color: white;">

    <div class="d-flex align-items-center gap-3">
      <i class="fas fa-paper-plane" style="color: #addae6;"></i>
      <div class="fs-2 text-dark" id="financeStatus1"></div>
    </div>
    <p class="fw-light text-dark mb-0">Submitted</p>
  </button>
  
  <button type="button" class="p-1 p-md-2 d-flex flex-column flex-wrap align-items-center justify-content-center subcard z-1
         mb-2
        d-flex align-items-center shadow rounded-3 status-filter-btn btn" data-status="in progress"
    style="border-top: 5px solid #b0e694 !important; background-color: white;">

    <div class="d-flex align-items-center gap-3">
      <i class="fas fa-subway" style="color: #b0e694;"></i>
      <div class="fs-2 text-dark" id="financeStatus2"></div>
    </div>
    <p class="fw-light text-dark mb-0">In Progress</p>
  </button>
  
  <button type="button" class="p-1 p-md-2 d-flex flex-column flex-wrap align-items-center justify-content-center subcard z-1
         mb-2
        d-flex align-items-center shadow rounded-3 status-filter-btn btn" data-status="completed"
    style="border-top: 5px solid #e57171 !important; background-color: white;">

    <div class="d-flex align-items-center gap-3">
      <i class="fas fa-download" style="color: #e57171;"></i>
      <div class="fs-2 text-dark" id="financeStatus3"></div>
    </div>
    <p class="fw-light text-dark mb-0">Completed</p>
  </button>
  
</div>

                    
    
                  </div>
                  
                </div>
                
              </div>
              
            </div>
          </div>
    
          <!-- Right column: Table -->
          <div class="col-md-8 mb-3 ps-0">
            <div class="overflow-auto p-3 ">
            <table id="missionFinance" class="display mb-3" width="100%"></table>
          </div></div>
    
        </div>
      </div>
  </div>
   
  </div>`;
  },
"missionHospitalDetails": function(data) {
    return `
<div class="container-fluid p-2 p-md-5 bg-white ">
  <div class="position-relative">
    <h2 class="text-center mb-5 p-4 rounded msnHospTitle connect-primary-border">${data.missionHospital}</h2>
    <i class="bg-opacity-10 fa-arrow-left fas fs-2 rounded position-absolute start-0 top-0 m-3" onclick="${data.currPage}"></i>
  </div>
  
     
   <!-- Tab content below tabs view -->
  
  <div class="tab-content container-fluid p-3 bg-white rounded" style="overflow-x: auto;">
    <div class="tab-pane fade show active" id="msnUsrHome" role="tabpanel" aria-labelledby="msnUsrHome-tab">
      
      
    <div class="row" data-row="row-1">
      
      
      
      
      <div class="col-12 mb-0 col-md-6" data-column="col-1">
        
        
        <div class="col-12 mb-2 mb-md-4 " data-row-col="card-row1-column-1">
          
          
<div class="card shadow bg-opacity-10 overflow-hidden rounded-3">
  
  <div class="card-header border-0 ">
    <h5 class="d-flex justify-content-between align-items-center">About ${data.msnHosp?.missionHospitalName || data.msnHosp?.hospitalName || "Hospital"} <img
        class='img-thumbnail-rounded '
        src="./images/feather-solid.svg" width="25"
        height="25" ></h5>
  </div>
  
  <div class="card-body p-2 p-md-3">
    
    
    <div class="mb-0 " >
      <div class="cnt">${data.msnHosp?.aboutHospital ? data.msnHosp?.aboutHospital: "Details Awaited"}</div>
    </div>
    

    
  </div>
</div>

          
        </div>
        
        
        <div class="col-12 mb-2 mb-md-4 " data-row-col="card-row1-column-1">
          
          
<div class="card shadow bg-opacity-10 overflow-hidden rounded-3">
  
  <div class="card-body p-2 p-md-3">
    
    <div class="card-header text-center bg-transparent secondary-color">
      <h3> ${data.msnHosp?.missionHospitalName || data.msnHosp?.hospitalName || "Hospital"} Departments </h3>
    </div>
    <div class="card-content mt-3" style="max-height: 400px; overflow: auto;">
      <table class="table table-light table-striped">
        <thead class="connect-text-darkblue">
          <tr>
            <th scope="col">S.No</th>
            <th scope="col">Departments Name</th>
          </tr>
        </thead>
        <tbody>
          
          ${data.specializationsTable ? data.specializationsTable : "Details Awaited"}
          
        </tbody>
      </table>
    </div>
    

    
  </div>
</div>

          
        </div>
        
      </div>
      
      <div class="col-12 mb-0 col-md-6" data-column="col-2">
        
        
        <div class="col-12 mb-2 mb-md-4 " data-row-col="card-row1-column-2">
          
          
<div class="d-flex flex-wrap w-100 justify-content-around">
  
  ${data.statusCardsData}
  
</div>

          
        </div>
        
        
        <div class="col-12 mb-2 mb-md-4 " data-row-col="card-row1-column-2">
          
          
<div class="card shadow bg-opacity-10 overflow-hidden rounded-3">
  
  <div class="card-header border-0 ">
    <h5 class="d-flex justify-content-between align-items-center">Gallery <img
        class='img-thumbnail-rounded '
        src="./images/feather-solid.svg" width="25"
        height="25" ></h5>
  </div>
  
  <div class="card-body p-2 p-md-3">
    
    
     <!-- Gallery for images  -->
    <div class="d-flex pt-2 pb-2" style="overflow: auto;">
      ${data.galleryTable}
    </div>
    

    <div class="d-flex flex-wrap justify-content-start pt-2 pb-2" style="max-height: 400px; overflow: auto;">
      


      

      
      
    </div>
    

    
  </div>
</div>

          
        </div>
        
        
        <div class="col-12 mb-2 mb-md-4 " data-row-col="card-row1-column-2">
          
          
<div class="card shadow bg-opacity-10 overflow-hidden rounded-3">
  
  <div class="card-header border-0 ">
    <h5 class="d-flex justify-content-between align-items-center">Location <img
        class='img-thumbnail-rounded '
        src="./images/feather-solid.svg" width="25"
        height="25" ></h5>
  </div>
  
  <div class="card-body p-2 p-md-3">
    
     <!-- Location for maps  -->
    <div id="mapOnCard" class="w-100" style="min-height: 300px;"></div>
    
    

    <div class="d-flex flex-wrap justify-content-start pt-2 pb-2" style="max-height: 400px; overflow: auto;">
      


      

      
      
    </div>
    

    
  </div>
</div>

          
        </div>
        
        
        <div class="col-12 mb-2 mb-md-4 " data-row-col="card-row1-column-2">
          
          
<div class="card shadow bg-opacity-10 overflow-hidden rounded-3">
  
  <div class="card-header border-0 ">
    <h5 class="d-flex justify-content-between align-items-center">Contact Us <img
        class='img-thumbnail-rounded '
        src="./images/feather-solid.svg" width="25"
        height="25" ></h5>
  </div>
  
  <div class="card-body p-2 p-md-3">
    
    
    

    <div class="d-flex flex-wrap justify-content-start pt-2 pb-2" style="max-height: 400px; overflow: auto;">
      


      

      
      <div class="d-flex flex-column">
        
        <div class="text-start mb-2 d-flex">
          <i class="fa-solid fs-4 me-3 fa-address-book secondary-color"></i>
          <span class="connect-text-darkblue listData">${data.msnHosp.hospitalAddress ? data.msnHosp.hospitalAddress : "Details Awaited"}</span>
        </div>
        
        <div class="text-start mb-2 d-flex">
          <i class="fa-solid fs-4 me-3 fa-envelope secondary-color"></i>
          <span class="connect-text-darkblue listData">${data.msnHosp.hospitalEmail ? data.msnHosp.hospitalEmail : "Details Awaited"}</span>
        </div>
        
        <div class="text-start mb-2 d-flex">
          <i class="fa-solid fs-4 me-3 fa-globe secondary-color"></i>
          <span class="connect-text-darkblue listData">${data.msnHosp.hospitalWebsite ? data.msnHosp.hospitalWebsite : "Details Awaited"}</span>
        </div>
        
      </div>

      
      
    </div>
    

    
  </div>
</div>

          
        </div>
        
      </div>
      
    </div>
     
           

    </div>

  </div>
   
  </div>`;
  },
"learningResources": function(data) {
    return `<div class="bg-white" style="min-height: 100%;">
    <div class="text-center py-3 position-relative">
        <i class="bg-opacity-10 fa-arrow-left fas fa-2x rounded position-absolute start-0 top-0 m-3" onclick="${data.redirectFun}"></i>
        <img class="me-3" src="../images/file.svg" alt="" width="50">
        <span class="fs-3"> Learning Resources</span>
    </div>
    <div class="col-12 p-2 position-relative" style="background-color: transparent;">
        <input type="text" id="allResourceFilter" placeholder="Search for meta tags and title" class="w-100 rounded-pill border ps-3 p-1">
        <button id="closeSearch" class="btn fs-3 top-0 end-0 position-absolute pe-3 p-0" style="display: none;">&times;</button>
    </div>
    <div id="resourceFilter" class="d-flex flex-wrap container-lg" style="transition: all ease-in-out 0.5s;"></div>
    <div id="resource" class="d-flex flex-wrap container-lg">${data.streamCards}</div>
</div>
`;
  },
"mentor": function(data) {
    return `

<div class="container-fluid">
    <div class="border mb-2 mb-md-3 p-2 p-md-4 rounded-2 text-center bg-white fs-4 fw-medium"> Mission mentors</div>
    
    <div class="row" data-row="row-1">
        
        
        
        
        <div class="col-12 mb-0 col-md-6" data-column="col-1">
            
            
            <div class="col-12 mb-2 mb-md-4 col-12" data-row-col="card-row1-column-1">
                
                
<div class=" mb-2 mb-md-4 profile-card-3 shadow rounded w-100 position-relative overflow-hidden h-100 bg-white style="
  min-height: 300px;" onclick="dataCardClickManager('${data.userType}','${data.mentorId}')" >
  <div class="d-flex justify-content-center align-items-center w-100 position-relative" style="height: 200px;">
    <button
      class="fw-bold bg-warning btn end-0 me-2 mt-2 position-absolute px-2 py-0 top-0 z-2">Edit</button>
    <img src=${data.cardData.mentorAvatar} alt="profile-image" class="profile rounded-circle z-1"
      onerror="this.onerror=null; this.src='https://s3.amazonaws.com/img.studenthub.in/CMCVConnect_Portal/Pictures/_43782473c4ed75b1e167091821a4d700_Pictures.png'" />
  </div>
  <div class="text-center px-2 pb-3">
    <h2 class="connect-text-darkblue text-capitalize">${data.cardData.mentorName}</h2>
    <small class="text-secondary">${data.cardData.mentorCourse}</small>
  </div>
</div>

                
            </div>
            
        </div>
        
        <div class="col-12 mb-0 col-md-6" data-column="col-2">
            
            
            <div class="col-12 mb-2 mb-md-4 " data-row-col="card-row1-column-2">
                
                
<div class="card shadow bg-opacity-10 overflow-hidden">
  
  <div class="card-header border-0 ">
    <h5 class="d-flex justify-content-between align-items-center">Mentor Instructions <img
        class='img-thumbnail-rounded  pe-pointer '
        src=" ./images/arrow-up-right-from-square-solid.svg" width="25"
        height="25"  onclick="instructionHandler('${data.userType}')" ></h5>
  </div>
  
  <div class="card-body p-2 p-md-3">
    
    
    <div class="mb-0  text-line full_width pe-pointer" 
      onclick="instructionHandler('${data.userType}')" >
      <div class="cnt">${data.cardData.mentorInstruction}</div>
    </div>
    

    
    <div class=" fw-medium text-end text-danger pe-2 pe-pointer">Read more..</div>
    
  </div>
</div>

                
            </div>
            
        </div>
        
    </div>
    
    <div class="row" data-row="row-2">
        
        
        
        
        <div class="col-12 mb-0 col-md-6" data-column="col-1">
            
            
            <div class="col-12 mb-2 mb-md-4 " data-row-col="card-row2-column-1">
                
                
<div class="card shadow bg-opacity-10 overflow-hidden">
  
  <div class="card-header border-0 ">
    <h5 class="d-flex justify-content-between align-items-center">My Mentees <img
        class='img-thumbnail-rounded '
        src="./images/feather-solid.svg" width="25"
        height="25" ></h5>
  </div>
  
  <div class="card-body p-2 p-md-3">
    
    
    

    <div class="d-flex flex-wrap justify-content-start pt-2 pb-2" style="max-height: 400px; overflow: auto;">
      
      ${data.cardData.menteeList}
      


      

      
      
    </div>
    

    
  </div>
</div>

                
            </div>
            
        </div>
        
        <div class="col-12 mb-0 col-md-6" data-column="col-2">
            
            
            <div class="col-12 mb-2 mb-md-4 " data-row-col="card-row2-column-2">
                
                
<div class="card shadow bg-opacity-10 overflow-hidden">
  
  <div class="card-header border-0 ">
    <h5 class="d-flex justify-content-between align-items-center">Mentor Meetings <img
        class='img-thumbnail-rounded '
        src="./images/feather-solid.svg" width="25"
        height="25" ></h5>
  </div>
  
  <div class="card-body p-2 p-md-3">
    
    
    

    <div class="d-flex flex-wrap justify-content-start pt-2 pb-2" style="max-height: 400px; overflow: auto;">
      


      

      
      
      <div class="w-100 px-3">
        <table id="formTableallMeetings" class="display"></table>
      </div>
      
    </div>
    

    
  </div>
</div>

                
            </div>
            
        </div>
        
    </div>
    
</div>


  `;
  },
"mentee": function(data) {
    return `

<div class="container-fluid">
    <div class="border mb-2 mb-md-3 p-2 p-md-4 rounded-2 text-center bg-white fs-4 fw-medium"> Mission mentees</div>
    
    <div class="row" data-row="row-1">
        
        
        
        
        <div class="col-12 mb-0 col-md-6" data-column="col-1">
            
            
            <div class="col-12 mb-2 mb-md-4 col-12" data-row-col="card-row1-column-1">
                
                
<div class=" mb-2 mb-md-4 profile-card-3 shadow rounded w-100 position-relative overflow-hidden h-100 bg-white style="
  min-height: 300px;" onclick="dataCardClickManager('${data.userType}','${data.menteeId}')" >
  <div class="d-flex justify-content-center align-items-center w-100 position-relative" style="height: 200px;">
    <button
      class="fw-bold bg-warning btn end-0 me-2 mt-2 position-absolute px-2 py-0 top-0 z-2">Edit</button>
    <img src=${data.cardData.menteeAvatar} alt="profile-image" class="profile rounded-circle z-1"
      onerror="this.onerror=null; this.src='https://s3.amazonaws.com/img.studenthub.in/CMCVConnect_Portal/Pictures/_43782473c4ed75b1e167091821a4d700_Pictures.png'" />
  </div>
  <div class="text-center px-2 pb-3">
    <h2 class="connect-text-darkblue text-capitalize">${data.cardData.menteeName}</h2>
    <small class="text-secondary">${data.cardData.menteeCourse}</small>
  </div>
</div>

                
            </div>
            
        </div>
        
        <div class="col-12 mb-0 col-md-6" data-column="col-2">
            
            
            <div class="col-12 mb-2 mb-md-4 " data-row-col="card-row1-column-2">
                
                
<div class="card shadow bg-opacity-10 overflow-hidden">
  
  <div class="card-header border-0 ">
    <h5 class="d-flex justify-content-between align-items-center">Mentee Instructions <img
        class='img-thumbnail-rounded  pe-pointer '
        src=" ./images/arrow-up-right-from-square-solid.svg" width="25"
        height="25"  onclick="instructionHandler('${data.userType}')" ></h5>
  </div>
  
  <div class="card-body p-2 p-md-3">
    
    
    <div class="mb-0  text-line full_width pe-pointer" 
      onclick="instructionHandler('${data.userType}')" >
      <div class="cnt">${data.cardData.menteeInstruction}</div>
    </div>
    

    
    <div class=" fw-medium text-end text-danger pe-2 pe-pointer">Read more..</div>
    
  </div>
</div>

                
            </div>
            
        </div>
        
    </div>
    
    <div class="row" data-row="row-2">
        
        
        
        
        <div class="col-12 mb-0 col-md-6" data-column="col-1">
            
            
            <div class="col-12 mb-2 mb-md-4 " data-row-col="card-row2-column-1">
                
                
<div class="card shadow bg-opacity-10 overflow-hidden">
  
  <div class="card-header border-0 ">
    <h5 class="d-flex justify-content-between align-items-center">My Mentors <img
        class='img-thumbnail-rounded '
        src="./images/feather-solid.svg" width="25"
        height="25" ></h5>
  </div>
  
  <div class="card-body p-2 p-md-3">
    
    
    

    <div class="d-flex flex-wrap justify-content-start pt-2 pb-2" style="max-height: 400px; overflow: auto;">
      
      ${data.cardData.mentorList}
      


      

      
      
    </div>
    

    
  </div>
</div>

                
            </div>
            
        </div>
        
        <div class="col-12 mb-0 col-md-6" data-column="col-2">
            
            
            <div class="col-12 mb-2 mb-md-4 " data-row-col="card-row2-column-2">
                
                
<div class="card shadow bg-opacity-10 overflow-hidden">
  
  <div class="card-header border-0 ">
    <h5 class="d-flex justify-content-between align-items-center">Mentee Meetings <img
        class='img-thumbnail-rounded '
        src="./images/feather-solid.svg" width="25"
        height="25" ></h5>
  </div>
  
  <div class="card-body p-2 p-md-3">
    
    
    

    <div class="d-flex flex-wrap justify-content-start pt-2 pb-2" style="max-height: 400px; overflow: auto;">
      


      

      
      
      <div class="w-100 px-3">
        <table id="formTableallMeetings" class="display"></table>
      </div>
      
    </div>
    

    
  </div>
</div>

                
            </div>
            
        </div>
        
    </div>
    
</div>


  `;
  },
"footer": function(data) {
    return `<footer class="py-2 w-100 position-absolute bg-primarycolor">
  <div class="mx-auto text-white text-center small-xl">
    <span class="d-none d-md-inline">Version ${data} </span> 
    <span> &copy; 2026 CMC </span>
  </div>
</footer>`;
  },
"modal": function(data) {
    return `
<div
  class="w-100 h-100 d-flex justify-content-center position-relative z-3 py-2 bg-dark bg-opacity-50 overflow-x-hidden overflow-y-auto">
  ${data.content?.msgModal? `
  <img
    src="https://s3.amazonaws.com/img.studenthub.in/CMCVConnect_Portal/Pictures/_a4d1b50eb124d3d2e7365190f7b2928d_Pictures.gif"
    alt="">
  ` : '' }
  <div class="modal fade show d-block bg-dark bg-opacity-50 align-content-center">
    <div
      class="modal-dialog ${ (data.content?.grantsList?.length || data.content?.mmsApprovedPanel || data.content?.eBook ) ? 'modal-xl' : (data.content?.confirmModal || data.content?.msgModal || data.content?.selectListModal ) ? ' ' : (data.content?.fovAppDocs ) ? 'modal-xxl' : 'modal-lg' }">
      ${data.content.avatarCard
      ? `<div class="d-flex justify-content-center" style="pointer-events: auto;">${data.content.renderedCard}</div>`

      : `
      <div class="modal-content" id="modalContent">
        <div class="modal-header">
          <h5 class="modal-title">
            ${data.content?.title || ''}
            ${data.content?.request ? `
            ${data.content.request.missionHospitalName
            ? 'Request from ' + data.content.request.missionHospitalName
            : 'Request for ' + data.content.request.specialization}
            ` : ''}
          </h5>
          <button type="button" class="btn-close" onclick="closeModal()"></button>
        </div>
        <div class="modal-body d-flex flex-column">
          <div class="position-relative">
            <!-- Comming Soon -->
            ${data.content?.cmgSoon ? `
            Coming Soon
            `:''}

            <!-- news modal -->
            ${data.content?.image ? `
            <div id="navbar" class="d-flex justify-content-end gap-1 mb-1 d-none d-md-flex">
              <button type="button" onclick="imageZoomIn()" class="btn secondary-bg-color text-white"><i
                  class="fa-solid fa-magnifying-glass-plus"></i></button>
              <button type="button" onclick="imageZoomOut()" class="btn secondary-bg-color text-white"><i
                  class="fa-solid fa-magnifying-glass-minus"></i></button>
            </div>
            <img class="z-1 rounded-3 border-bottom pb-3" src="${data.content.image}" id="modalImage" width="100%"
              alt="Image">` : ''}
            ${data.content?.subTitle ? `
            <p class="${!data.content?.subTitle ? 'd-none' : ''}" style="overflow-wrap: break-word;">
              ${data.content.subTitle }</p>`:''}
            ${data.content?.description ? `<p style="overflow-wrap: break-word;">${data.content.description}</p>` :
            ''}
          </div>

          <!-- manpower request modal Table -->
          ${data.content?.table ? `
          <div class=" d-flex flex-column flex-md-row flex-wrap ">
            ${data.content?.request.tableData}
          </div>`:''}

          <!-- mission request modal -->
          ${data.content?.chat ? `
          <div class=" d-flex flex-column flex-md-row flex-wrap justify-content-between mb-3">
            <div class="col-12 col-lg-5">${data.content?.request.tableData}</div>
            <div class="vr border-end "></div>
            <hr>
            <div id="msgCont" class="col-12 col-lg-6 px-2 d-flex flex-column" style="max-height: 60vh; overflow: auto">
              ${data.content?.request.chatTable}</div>
          </div>
          <div class="input-group">
            <input id="chatInput" type="text" class="form-control" placeholder="Type message and hit [Enter] to send."
              autocomplete="off"
              onkeydown="if(event.key === 'Enter'){ chatupdate($('#chatInput').val(),'${data.content.request.reqId}');this.value = '';}">
            <div class="input-group-append">
              <button type="button" class="btn btn-warning"
                onclick="chatupdate($('#chatInput').val(),'${data.content.request.reqId}');$('#chatInput').val('')">Send</button>
            </div>
          </div>
          `:''}

          ${data.content.confirmModal ? `
          <div class="confirmModal">
            <div class="confirmModal-content">
              <div class="confirmModal-body">
                <p>${data.content.message}</p>
              </div>
              <div class="confirmModal-footer">
                <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancel</button>
                <button type="button" class="btn btn-primary" id="finalConfirmBtn">${data.content.btnText}</button>
              </div>
            </div>
          </div>
          `:''}

          ${data.content.msgModal ? `
          <div class="msgModal">
            <div class="msgModal-content">
              <div class="msgModal-body">
                <p>🎉 ${data.content.msgModal.message}</p>
              </div>
              <div class="msgModal-footer">
                <button type="button" class="btn btn-primary"
                  onclick="closeModal()">${data.content.msgModal.btnText}</button>
              </div>
            </div>
          </div>
          `:''}

          ${data.content.contactList ?`
          <div class="content d-flex flex-column justify-content-start ps-1 ps-md-5">
            ${data.content.contactList.map(item => `
            <div class="text-start mb-2">
              <i class="fa-solid fs-5 me-2 ${item.iconImage} secondary-color"></i>
              <span class="align-top connect-text-darkblue">${item.detail}</span>
            </div>
            `).join('')}
          </div>
          `:''}
          ${data.content.cardData ? `
          
<div class="card">
  
  <div class="card-header border-0 ">
    <h5 class="d-flex justify-content-between align-items-center">Mission Office Members <img
        class='img-thumbnail-rounded '
        src="${ data.content.cardData.icon}" width="25"
        height="25" ></h5>
  </div>
  
  <div class="card-body p-2 p-md-3">
    
    
    

    <div class="d-flex flex-wrap justify-content-start pt-2 pb-2" style="max-height: 400px; overflow: auto;">
      
      ${data.content.cardData.data.memberCardTable}
      


      

      
      
    </div>
    

    
  </div>
</div>

          ` : ''}

          <!-- Form IO -->
          ${data.content.formIO ? `
          <div class="" id="missionsFormIOAdd"></div>
          <div class="" id="fileStatus"></div>
          <div class="" id="downloadLinks"></div>
          <div class="" id="genFormIO"></div>
          `:''}

          ${data.content.infoModal ? `
          <div class="${data.content.infoModal.className}">
            ${data.content.infoModal.title ? `<h4 class="text-center fw-bold mb-3">${data.content.infoModal.title}</h4>
            `:' '}
            ${data.content.infoModal.imgUrl ? `<img src="${data.content.infoModal.imgUrl}" alt="Image"
              class="img-fluid rounded-3">
            `:' '}
            ${data.content.infoModal.endText ? `<p class="text-end fw-bold mt-3">${data.content.infoModal.endText}</p>
            `:' '}
            <div class="mt-3"> ${data.content.infoModal.data}</div>
          </div>
          `:''}

          ${data.content.grandRoundsCal ? `
          <div class="" id="grandRoundsCal"></div>`: ' '}

          <!-- pdf viewer -->
          ${data.content.pdf ?`<div class="mb-3 mt-0 text-center">
            <button class="btn bg-transparent" onclick="zoomOut()"><i
                class="fa-solid fa-magnifying-glass-minus fs-1 secondary-color"></i></button>
            <button class="btn bg-transparent" onclick="zoomIn()"><i
                class="fa-solid fa-magnifying-glass-plus fs-1 secondary-color"></i></button>
            <button class="btn bg-transparent" onclick="onPrevPage()"><i
                class="fa-solid fa-circle-arrow-left fs-1 secondary-color"></i></button>
            <button class="btn bg-transparent" onclick="onNextPage()"><i
                class="fa-solid fa-circle-arrow-right fs-1 secondary-color"></i></button>
            <button class="btn bg-transparent" onclick="downloadPdf()"><i
                class="fa-solid fa-download fs-1 secondary-color"></i></button>
            <span class="mt-2"><span>Page <input type="number" id="page_num" min="1" style="width: 50px;" value="1"
                  onkeydown="handlePageInput(event)" />
              </span> of <span id="page_count"></span></span></span>
          </div>
          <div class="text-center" id="pdfViewer" style="min-height: calc(100vh - 210px); overflow-y: auto;"></div> `
          :''}

          <!-- audio viewer -->
          ${data.content.audio ?`<div>
            <h5>${data.content.audioData.title}</h5>
            <iframe width="100%" scrolling="no" frameborder="no" allow="autoplay"
              src="https://w.soundcloud.com/player/?url=${data.content.audioData.url}&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true">
            </iframe>
            <div>
              <a href="${data.content.audioData.url}" title="${data.content.audioData.author}" target="_blank"
                style="color: #cccccc; text-decoration: none">${data.content.audioData.author}</a>
            </div>
            <hr>
          </div>`:''}

          <!-- video viewer -->
          ${data.content.video ?`<div>
            <h5>${data.content.videoData.title}</h5>
            <iframe width="100%" style="min-height: 400px;" scrolling="no" src="${ data.content.videoData.url}"
              title="${ data.content.videoData.title }" frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowfullscreen>
            </iframe>
            <div>
              <a href="${ data.content.videoData.url}" title="${ data.content.videoData.author }" target="_blank"
                style="color: #cccccc; text-decoration: none">${ data.content.videoData.author }</a>
            </div>
          </div>`:''}


          <!-- mentor mentee Instructions -->
          ${data.content.instructions ?`
          <div>${data.content.instructionData}</div>
          `:''}

          <!-- gallery Image -->
          ${data.content.gallery ? `
          <div id="carouselExampleFade" class="carousel slide carousel-fade" data-bs-ride="carousel">
            <div class="carousel-inner">
              ${data.content.imageTable}
              <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleFade"
                data-bs-slide="prev">
                <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                <span class="visually-hidden">Previous</span>
              </button>
              <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleFade"
                data-bs-slide="next">
                <span class="carousel-control-next-icon" aria-hidden="true"></span>
                <span class="visually-hidden">Next</span>
              </button>
            </div>
          </div>` :''}
          <!--weekly Manna-->
          ${data.content.weeklyManna ?`
          <div class="container mt-4">
            <div class="row">
              <div class="col-md-5 text-center">
                <img
                  src="${data.content.weMannaData.uploadImage?.url || '.https://s3.amazonaws.com/img.studenthub.in/CMCVConnect_Portal/Pictures/_43782473c4ed75b1e167091821a4d700_Pictures.png'}"
                  alt="Weekly Manna" class="img-fluid rounded-2">
              </div>
              <div class="col-md-7">
                <p class="text-end"><strong>Date:</strong> ${data.content.weMannaData.formattedDate}</p>
                <div class="mt-5">
                  <h3 class="text-center text-md-start"> ${data.content.weMannaData.devotionalTitle}</h3>
                  <p><strong>Key Verse:</strong> ${data.content.weMannaData.devotionalKeyVerse}
                  </p>
                </div>
              </div>
            </div>

            <div class="mt-4">
              <p><strong>Description:</strong></p>
              <p style="white-space: pre-line;">${data.content.weMannaData.devotionalDescription}</p>
              <hr class="my-4" style="width: 50%; margin: 0px auto;">
              <p><strong>Prayer Points:</strong></p>
              <p style="white-space: pre-line; margin-left: 35px;">${data.content.weMannaData.prayerpoints}</p>
            </div>
          </div>

          `:''}

          ${data.content.researchNews? `
          <img class="z-1 rounded-3 border-bottom pb-3" src="${data.content.researchNews.image}">
          <h5 class="text-center"> ${data.content.researchNews.newsTitle}</h5>
          <div class="d-flex justify-content-end">
            <a href="${data.content.researchNews.link}" target="_blank" class="btn  btn-sm bg-primary-subtle mb-3">Visit
              site</a>
          </div>
          <p style="white-space: pre-line;">${data.content.researchNews.newsBody}</p>
          `: ''}


          ${data.content.timeline ? `
          <div id="timelineCarousel" class="carousel slide mb-3" data-bs-ride="false">
            <div class="carousel-inner">
              ${data.content.timeline.modalPicture?.map((img, i) => `
              <div class="carousel-item ${i === 0 ? " active" : "" }">
                <img src="${img.data?.url || img.url || " placeholder.jpg"}"
                  class="d-block w-100 rounded-3 border-bottom pb-3" style="object-fit:cover;"
                  alt="Timeline Image ${i + 1}">
              </div>
              `).join("")}
            </div>
            ${data.content.timeline.modalPicture?.length > 1 ? `
            <button class="carousel-control-prev" type="button" data-bs-target="#timelineCarousel" data-bs-slide="prev">
              <span class="carousel-control-prev-icon"
                style="background-color: rgba(0, 0, 0, 0.5); border-radius: 50%;"></span>
            </button>
            <button class="carousel-control-next" type="button" data-bs-target="#timelineCarousel" data-bs-slide="next">
              <span class="carousel-control-next-icon"
                style="background-color: rgba(0, 0, 0, 0.5); border-radius: 50%;"></span>
            </button>
            ` : ""}
          </div>

          <h5 class="text-center">${data.content.timeline.pictureCaption || ""}</h5>
          <p style="white-space: pre-line;">${data.content.timeline.summary || ""}</p>
          <p style="white-space: pre-line;">${data.content.timeline.listOfPublicationsFurtherReading || ""}</p>
          ` : ""}

          ${data.content.grandRounds ?`
          <img class="z-1 rounded-3 border-bottom pb-3" src="${data.content.grandRounds.poster.url}">
          <div class="d-flex justify-content-start">
            <a href="${data.content.grandRounds.zoomLink}" target="_blank"
              class="btn  btn-sm bg-primary-subtle mb-3">Register</a>
          </div>

          `:''}

          ${data.content.grantsList ?`
          <div class="overflow-auto scrollBar-thin">
            <table id="grantsListTable" class="display"></table>
          </div>
          `:''}

          ${data.content.grantsAwardee ?`
          <div class="container mt-4">
            <div class="row align-items-center">
              <div class="col-md-4 text-center">
                <img
                  src="${data.content.grantsAwardee.awardeePhoto[0]?.url || '.https://s3.amazonaws.com/img.studenthub.in/CMCVConnect_Portal/Pictures/_43782473c4ed75b1e167091821a4d700_Pictures.png'}"
                  alt="Awardee Profile" class="img-fluid rounded-2">
              </div>
              <div class="col-md-8">
                <p class="text-end"><strong>Year Awarded:</strong> ${data.content.grantsAwardee.yearAwarded}</p>
                <div class="mt-5">
                  <h5 class="text-center text-md-start"> ${data.content.grantsAwardee.titleOfResearchProject}</h5>
                  <p class="fw-bold fst-italic">- ${data.content.grantsAwardee.facultyName.profile?.name || "Awardee"}
                  </p>

                </div>
              </div>
            </div>
            <p>${data.content.grantsAwardee.summaryOfResearchProposal}</p>
          </div>
          `:''}

          ${data.content.connectOneOnOne ?`
          <img
            src="${'https://s3.amazonaws.com/img.studenthub.in/CMCVConnect_Portal/Pictures/_a49525242f6ec522c99ddefb0d163dd2_Pictures.png' || '.https://s3.amazonaws.com/img.studenthub.in/CMCVConnect_Portal/Pictures/_43782473c4ed75b1e167091821a4d700_Pictures.png'}"
            alt="Connect Flyer" class="img-fluid rounded-2">
          `:''}

          ${data.content.preMmsVisits ? `
          <div class="container mt-4">
            <div class="row align-items-center">
              <div class="col-md-6 d-flex flex-column align-items-center">
                <img
                  onclick="openModal('image', ' ', '${data.content.preMmsVisits.imageUrl || data.content.preMmsVisits.uploadPicture[0].data.url }')"
                  src="${data.content.preMmsVisits.imageUrl || data.content.preMmsVisits.uploadPicture[0].data.url || '.https://s3.amazonaws.com/img.studenthub.in/CMCVConnect_Portal/Pictures/_43782473c4ed75b1e167091821a4d700_Pictures.png'}"
                  alt="Picture" class="img-fluid rounded-2" style="max-height: 200px; object-fit: cover;">
                <h4 class="fw-bold text-center mt-3"> Dr. ${data.content.preMmsVisits.name || data.content.name || ""}
                </h4>

              </div>

              <div class="col-md-6 text-md-end text-center mt-3 mt-md-0">
                <h5 class="fw-bold mb-1">
                  ${data?.content?.preMmsVisits?.missionHospital?.missionHospitalName ||
                  data?.content?.preMmsVisits?.missionHospitalName || ''}
                </h5>
                <p class="text-muted mb-0">
                  <strong>Date:</strong>
                  ${data?.content?.preMmsVisits?.formattedDate?.fromDate ||
                  data?.content?.preMmsVisits?.fromDateFormatted || '-'}
                  -
                  ${data?.content?.preMmsVisits?.formattedDate?.toDate || data?.content?.preMmsVisits?.toDateFormatted
                  || '-'}
                </p>
              </div>
            </div>
            <div class="row">
              <div class="col-12">
                <p class="mt-3" style="line-height: 1.6; text-align: justify;">
                  ${ data.content.preMmsVisits.finalReportForPublicaions || data.content.preMmsVisits.briefReport ||
                  data.content.summary || ""}
                </p>
              </div>
            </div>
          </div>
          ` : ''}

          ${data.content.whatsNew ? `
          <div class="whats-new-container">
            ${data.content.whatsNew.link ?
            `<a href="${data.content.whatsNew.link}" target="_blank" rel="noopener noreferrer">` : ''}
              <img class="z-1 rounded-3 border-bottom pb-3 w-100" src="${data.content.whatsNew.image}"
                alt="${data.content.whatsNew.title}">
              ${data.content.whatsNew.link ? `</a>` : ''}

            <h5 class="text-center mt-2">${data.content.whatsNew.title}</h5>

            <div class="d-flex justify-content-end">
              ${data.content.whatsNew.link ? `
              <a href="${data.content.whatsNew.link}" target="_blank" rel="noopener noreferrer"
                class="btn btn-sm bg-primary-subtle mb-3">
                Learn more
              </a>` : ''}
            </div>

            <p style="white-space: pre-line;">${data.content.whatsNew.description}</p>
          </div>
          ` : ''}

          ${data.content.grandRoundSchedule? `
          <div class="fs-md-5">
            <p style="white-space: pre-line;">${data.content.grandRoundSchedule.dateTime}</p>
          </div>
          `: ''}


          ${data?.content?.mmsApprovedPanel ?

          (Array.isArray(data.content.mmsApprovedPanel)
          ? data.content.mmsApprovedPanel
          : [data.content.mmsApprovedPanel]
          ).map(visit => `

          <div class="mms-approved-card border rounded-4 overflow-hidden mb-4">

            <div class="row g-0">

              <!-- Left Panel -->
              <div
                class="col-lg-5 col-md-5 col-12 bg-primarycolor mms-left-panel d-flex flex-column justify-content-center align-items-center text-white p-4 pt-0">
                <div class="visit-star">
                  <div class="visit-text text-center">Your<br>Upcoming<br>Visit</div>
                </div>
                <img src="${visit.hospitalImg || ''}" alt="Hospital Image"
                  class="mms-hospital-img img-fluid rounded-3 shadow-sm" style="max-width: 75%">
              </div>

              <!-- Right Panel -->
              <div class="col-lg-7 col-md-7 col-12 bg-white p-4 p-md-5">

                <h3 class="fw-bold mb-4" style="font-family: 'Playfair Display', serif;">
                  Dear Dr. ${visit.name || ''}
                </h3>

                <div class="info-row">
                  <p>Your Mandatory Mission Service visit is</p>
                  <span class="info-badge approved
                                ${visit.status === 'Approved' ? 'bg-success text-white' : 
                visit.status === 'Submitted' ? 'bg-warning text-dark' : 'bg-secondary'}">
                    ${visit.status || '-'}
                  </span>
                </div>

                <div class="info-row">
                  <p>Date of Visit</p>
                  <span class="info-badge">
                    ${visit.from || '-'} -
                    ${visit.to || '-'}
                  </span>
                </div>

                <div class="info-row">
                  <p>Hospital chosen for MMS</p>
                  <span class="info-badge">
                    ${visit.hospitalName || '-'}
                  </span>
                </div>

                ${
                String(visit.status).toLowerCase() === "approved"
                ? `
                <div class="d-flex justify-content-end align-items-center gap-3 mb-4 flex-wrap">
                  <span class="fs-md-4 fw-medium">
                    Please upload your indemnity certificate here
                  </span>
                  <button class="mms-btn bg-primarycolor" onclick="openModal('formIO', null, 'Application');
                  loadMmsApplication('indemnityCertificatePanel', '${visit._id}')">
                    Upload
                  </button>
                </div>

                <div class="d-flex justify-content-end align-items-center gap-3 flex-wrap">
                  <span class="fs-md-4 fw-medium blink">
                    Please update the status of your visit by clicking here...
                  </span>
                  <button class="mms-btn bg-primarycolor" onclick="openModal('formIO', null, 'Application');
                  loadMmsApplication('visitStatusPanel', '${visit._id}')">
                    Update Visit
                  </button>
                </div>
                `
                : `
                <p class="text-center fs-5 fw-medium mt-5">
                  Your application is submitted and is being processed.
                </p>
                `
                }

              </div>
            </div>
          </div>

          `).join("")

          : ''}

          ${data?.content?.conclaveSummary ? `
          <div class="bg-primarycolor rounded fs-md-5 p-3 text-white" style="font-family: sans-serif;">
            <h4 class="text-center fw-bold">${data.content.conclaveSummary.title}</h4>
            <p style="white-space: pre-line;">${data.content.conclaveSummary.content}</p>
          </div>
          `: ''}

          ${data?.content?.eBook ?`

          <div id="loading">Loading PDF and initializing flipbook...</div>
          <div id="controls" style="display: none;" class="d-flex justify-content-center align-items-center gap-2 mb-2">
            <button id="prev-btn" class="btn btn-primary"><i class="fa-solid fa-caret-left"></i></button>
            <button id="next-btn" class="btn btn-primary"><i class="fa-solid fa-caret-right"></i></button>

            <button id="zoom-out" class="btn btn-primary"><i class="fa-solid fa-minus"></i></button>
            <span id="zoom-label">100%</span>
            <button id="zoom-in" class="btn btn-primary"><i class="fa-solid fa-plus"></i></button>

            <button id="zoom-reset" class="btn btn-primary">Reset</button>

            <button id="fullscreen-btn" class="btn btn-primary"><i class="fa-solid fa-expand"></i></button>

            <span id="page-num"></span>
          </div>

          <div id="viewer" class="flipbook-wrapper">
            <div id="flipbook" class="foo">
            </div>
          </div>
          `: ' '}

          <!-- select list modal -->

          ${data?.content?.selectListModal ? `
          <div class="row align-items-end" id="selectListModal">
            <div class="col-md-8">
              <div class="form-group">
                <select id="modalDropdown" class="form-control">
                  <option value="">${data.content.selectListModal.title || 'Select'}</option>

                  ${data.content.selectListModal.list.map(item => {
                  // Helper to safely get nested values (e.g., "cmcDepartments.name")
                  const getNestedValue = (obj, path) => {
                  if (!path) return '';
                  return path.split('.').reduce((acc, part) => acc && acc[part], obj) || '';
                  };

                  const value = item[data.content.selectListModal.valueField] || '';
                  const field1 = item[data.content.selectListModal.displayField] || '';
                  const field2 = getNestedValue(item, data.content.selectListModal.displayField2);

                  return `
                  <option value="${value}">
                    ${field1} ${field2 ? `- ${field2}` : ''}
                  </option>
                  `;
                  }).join('')}
                </select>
              </div>
            </div>
            <div class="col-md-4">
              <button type="button" class="btn btn-primary d-none addBtn">Allot</button>
            </div>
          </div>
          ` : ' '}

          ${data.content?.fovAppDocs ? `
          <div class="" id="fovAppDocs"></div>
          <div id="fovAppComment">
          </div>
          <div id="fovNewComment" class="fov-editor"></div>

          ` : ''}

          ${data.content.samAppDocs ? `
<div class="" id="samAppDocs"></div>
<div class="" id="samAppComment"></div>
` : ''}

        </div>
      </div>`
      }

    </div>
  </div>
</div>`;
  },
"popup": function(data) {
    return `<div
    class=" w-100 h-100 d-flex justify-content-center position-relative z-3 py-2 bg-dark bg-opacity-50 overflow-x-hidden overflow-y-auto">
    <div class="modal fade show d-block bg-dark bg-opacity-50">
        <div class="modal-dialog">
            <div class="modal-content">
                ${data}
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" onclick="closePopup()">Close</button>
                </div>
            </div>
        </div>
    </div>
</div>`;
  },
"detailedNews": function(data) {
    return `<div class="d-flex flex-wrap bg-white">
    <div class="text-center p-1 p-md-2 col-12  bg-light position-relative">
        <i class="bg-opacity-10 fa-arrow-left fas fs-2 rounded position-absolute start-0 top-0 m-3"
            onclick="${data.redirectFun}"></i>
        <p class="fw-semibold fs-5 mb-1">CMC Connect News</p>
        <p class=" fw-medium ">Welcome to CMC News page. A place to connect people </p>
    </div>
    <div class="col-12 p-2 position-relative" style="background-color: transparent;">
        <input type="text" id="allNewsFilterInput" placeholder="Search for news.."
            class="w-100 rounded-pill border ps-3 p-1">
        <button id="closeSearch" class="btn fs-3 top-0 end-0 position-absolute pe-3 p-0"
            style="display: none;">&times;</button>
    </div>

    <div id="searchFilter" class="w-100 px-3" style="transition: all ease-in-out 0.5s;"></div>
    <div id="mainNews" class="w-100 d-flex flex-wrap">
        <div class="col-12 col-lg-4 px-3 py-2">
            <span class="fs-5 ">Latest News</span>
            <div class="shadow border rounded-3 overflow-hidden pe-pointer"
                onclick="openModal('News','${data.latestNews._id}')">
                <img class="w-100" src="${data.latestNews.newsImage}" style="max-height: 80vh;" alt=""
                    onerror="this.onerror=null; this.src='https://s3.amazonaws.com/img.studenthub.in/CMCVConnect_Portal/Pictures/_43782473c4ed75b1e167091821a4d700_Pictures.png'">
                <div class="px-2 py-3">
                    <h5>${data.latestNews.newsTitle}</h5>
                    <p class="mb-1 fw-semibold fs-5">${data.latestNews.newsSubTitle}</p>
                    <p class="mb-1 text-end text-secondary">${moment(data.latestNews.newsDate).format('MMMM Do, YYYY')}
                    </p>
                </div>

            </div>
        </div>

        <div class="col-12 col-lg-5 px-3 py-2">
            <span class="fs-5 ">Top News</span>
            ${data.topNews}
        </div>

        <div class="col-12 col-lg-3 px-3 py-2">
            <span class="fs-5 ">Recent News</span>
            ${data.recentNews}
        </div>
    </div>

    <div class="col-12 px-3 mt-2" id="archive">
        <span class="fs-5 mt-2">Archived news</span>
        ${data.archiveNews}
        <div id="archiveNews"></div>
    </div>
</div>`;
  },
"detailedResources": function(data) {
    return `<div class="d-flex flex-wrap bg-white">
    <div class="text-center p-1 p-md-2 col-12  bg-light position-relative">
      <i class="bg-opacity-10 fa-arrow-left fas fa-2x rounded position-absolute start-0 top-0 m-3" onclick="renderLoadResources('learningResources','${data.redirectFun}')"></i>
      <img class="" src=${data.thumb} alt=""  onerror="this.onerror=null; this.src='./images/icons/module.png';">
      <p class=" fw-medium ">${data.streamName}(${data.streameCode}) Resources</p>
    </div>
    <div class="col-12 p-2 position-relative" style="background-color: transparent;">
        <input type="text" id="allResourceFilter" placeholder="Search for meta tags and title" class="w-100 rounded-pill border ps-3 p-1">
        <button id="closeSearch" class="btn fs-3 top-0 end-0 position-absolute pe-3 p-0" style="display: none;">&times;</button>
    </div>
    <div id="resourceFilter" class="d-flex flex-wrap container-lg" style="transition: all ease-in-out 0.5s;"></div>
    <div id="mainResources" class="w-100 d-flex flex-wrap">
        <div class="col-12 col-lg-4 px-3 py-2">
          <span class="fs-5 ">Latest Resources</span>
          ${data.latestResource}
        </div>
    
        <div class="col-12 col-lg-5 px-3 py-2">
          <span class="fs-5 ">Top Resources</span>
          ${data.topResource}
        </div>
    
        <div class="col-12 col-lg-3 px-3 py-2">
          <span class="fs-5 ">Recent Resources</span>
          ${data.recentResource}
        </div>
    </div>

    <div class="col-12 px-3 mt-2" id="archivedResource">
        <span class="fs-5 mt-2">Archived Resources</span>
        <div id="archivedOnFetch" class="d-flex flex-wrap"> ${data.archivedResource}</div>
      </div>
  </div>`;
  },
"legalHelp": function(data) {
    return `

<div class="bg-white h-100 py-4">
  <div class="position-relative">
    <h2 class="text-center bg-white p-3 rounded msnHospTitle connect-primary-border">My Requests for Legal Help</h2>
    <i class="bg-opacity-10 fa-arrow-left fas rounded position-absolute start-0 top-0 m-3 fs-2 pe-pointer"onclick="renderMissionsPage(); clearGlobalFilters();"></i>
  </div>

  <div class="container-fluid px-3">
    <div class="row">

      <!-- Left column: card -->
      <div class="col-md-4 mt-5 pe-0">
        <div class="container-fluid pt-3 z-1">
          
          <div class="row" data-row="row-undefined">
            
            
            
            
            <div class="col-12 mb-0 col-md-12" data-column="col-undefined">
              
              <div class="col-12 mb-2 mb-md-4 "
                data-row-col="card-rowundefined-column-undefined">
                
                
<p class="fst-italic text-info" style="font-size: 15px;">
  <button id="clearStatusFilters" class="btn btn-sm secondary-bg-color text-white ms-2">Clear All</button>* Reclick the
  cards to unselect
</p>
<div class="d-flex flex-wrap w-100 justify-content-around">
  
  <button type="button" class="p-1 p-md-2 d-flex flex-column flex-wrap align-items-center justify-content-center subcard z-1
         mb-2
        d-flex align-items-center shadow rounded-3 status-filter-btn btn" data-status="submitted"
    style="border-top: 5px solid #addae6 !important; background-color: white;">

    <div class="d-flex align-items-center gap-3">
      <i class="fas fa-paper-plane" style="color: #addae6;"></i>
      <div class="fs-2 text-dark" id="legalHelpStatus1"></div>
    </div>
    <p class="fw-light text-dark mb-0">Submitted</p>
  </button>
  
  <button type="button" class="p-1 p-md-2 d-flex flex-column flex-wrap align-items-center justify-content-center subcard z-1
         mb-2
        d-flex align-items-center shadow rounded-3 status-filter-btn btn" data-status="in progress"
    style="border-top: 5px solid #b0e694 !important; background-color: white;">

    <div class="d-flex align-items-center gap-3">
      <i class="fas fa-subway" style="color: #b0e694;"></i>
      <div class="fs-2 text-dark" id="legalHelpStatus2"></div>
    </div>
    <p class="fw-light text-dark mb-0">In Progress</p>
  </button>
  
  <button type="button" class="p-1 p-md-2 d-flex flex-column flex-wrap align-items-center justify-content-center subcard z-1
         mb-2
        d-flex align-items-center shadow rounded-3 status-filter-btn btn" data-status="completed"
    style="border-top: 5px solid #e57171 !important; background-color: white;">

    <div class="d-flex align-items-center gap-3">
      <i class="fas fa-download" style="color: #e57171;"></i>
      <div class="fs-2 text-dark" id="legalHelpStatus3"></div>
    </div>
    <p class="fw-light text-dark mb-0">Completed</p>
  </button>
  
</div>

                

              </div>
              
            </div>
            
          </div>
          
        </div>
      </div>

      <!-- Right column: Table -->
      <div class="col-md-8 mb-3 ps-0">
        <div class="overflow-auto p-3 ">
        <table id="missionLegalHelp" class="display mb-3" width="100%"></table>
      </div></div>

    </div>
  </div>

  <div class="text-end px-3">Please write to us: <a href="mailto:missionsoffice@cmcvellore.ac.in">missionsoffice@cmcvellore.ac.in</a><br>Or call: +91 416 228 6117</div>

  <div id="viewLegalForm"></div>
</div>
`;
  },
"equipment": function(data) {
    return `<!-- ============ Inline styles for the new bits below ============
     No SCSS file was supplied alongside this page, so these are kept
     scoped to the classes introduced here rather than touching the
     stylesheet blind. Move these into the real SCSS whenever that file
     is available — nothing here depends on being inline.
     (Partition / bottom-requests styling now lives in the real SCSS
     file — see the accompanying equipment-styles.css. It's not
     page-specific glue like the bits below, it's a general layout
     pattern, so it belongs with the rest of the section styles.) -->
<style>
  /* Full width / full height — the page previously sat in whatever
     narrower max-width .wrap carried from the site's own stylesheet
     (not supplied to us), and the outer container only guaranteed
     500px, so a short list left blank space below it. */
  .eqp-page{ width:100%; min-height:100vh; box-sizing:border-box; }
  .eqp-page .wrap{ max-width:100% !important; width:100%; box-sizing:border-box; }
  .eqp-page .view{ min-height:100%; }

  /* ============ Hero carousel + overlaid intro ============
     Bigger than before, and the intro text sits on top of the rotating
     photo (fixed in place — only the background changes) instead of its
     own box above the carousel. */
  .eqp-page .hero-carousel.hero-intro-merged{ position:relative; height:600px; min-height:420px; overflow:hidden; border-radius:16px; }
  .eqp-page .hero-carousel.hero-intro-merged .hc-track{ height:100%; }
  .eqp-page .hero-carousel.hero-intro-merged .hc-slide{ height:100%; }
  .eqp-page .hero-carousel.hero-intro-merged .hc-slide img{ width:100%; height:100%; object-fit:cover; display:block; }
  .eqp-page .hero-intro-overlay{
    position:absolute; inset:0; z-index:5; display:flex; flex-direction:column; justify-content:center;
    padding:40px 48px; max-width:640px; pointer-events:none;
    background:linear-gradient(90deg, rgba(20,48,79,0.90) 0%, rgba(20,48,79,0.68) 55%, rgba(20,48,79,0.05) 100%);
  }
  .eqp-page .hero-intro-overlay .page-intro-icon{ width:44px; height:44px; margin-bottom:14px; color:#D9A62B; }
  .eqp-page .hero-intro-overlay .page-intro-icon .icon{ width:100%; height:100%; }
  .eqp-page .hero-intro-overlay .page-intro-kicker{ color:#D9A62B; font-weight:700; letter-spacing:.04em; text-transform:uppercase; font-size:12.5px; margin:0 0 8px; }
  .eqp-page .hero-intro-overlay .page-intro-lead{ font-size:clamp(24px,3.4vw,38px); font-weight:800; margin:0 0 12px; color:#fff; line-height:1.15; }
  .eqp-page .hero-intro-overlay .page-intro-sub{ font-size:14.5px; line-height:1.5; color:rgba(255,255,255,0.92); margin:0; max-width:520px; }
  @media (max-width:800px){
    .eqp-page .hero-carousel.hero-intro-merged{ height:300px; min-height:300px; }
    .eqp-page .hero-intro-overlay{ padding:22px 20px; max-width:none; background:linear-gradient(180deg, rgba(20,48,79,0.15) 0%, rgba(20,48,79,0.88) 78%); }
  }

  /* ============ Compact request cards (My Requests / Requests) ============
     A wide multi-column table row doesn't fit a narrow side-by-side
     column, so each request renders as a small stacked card instead. */
  .eqp-page .req-card-list{ display:flex; flex-direction:column; gap:10px; }
  .eqp-page .req-card{ border:1px solid #eceef2; border-radius:10px; padding:10px 12px; cursor:pointer; }
  .eqp-page .req-card:hover{ border-color:#c9d0db; background:#FAFBFC; }
  .eqp-page .req-card-top{ display:flex; align-items:flex-start; justify-content:space-between; gap:8px; }
  .eqp-page .req-card-name{ font-weight:600; font-size:13.5px; color:#14304F; }
  .eqp-page .req-card-meta{ font-size:12px; color:#6b7280; margin:4px 0 8px; }
  .eqp-page .req-card .rin-note{ display:block; font-size:11px; color:#6b7280; margin-top:2px; }

  /* Bigger + visually highlighted so it reads as its own action, not a
     minor icon tacked onto the row — gold border/tint echoes the site's
     accent color (same gold used in the hero overlay icon). Requests with
     unread messages get a stronger highlight still (gold fill) so an
     unread conversation is easy to spot at a glance, on top of the count
     badge. */
  .eqp-page .chat-icon-btn{ position:relative; display:inline-flex; align-items:center; justify-content:center; width:42px; height:42px; border-radius:999px; border:1.5px solid #D9A62B; background:#FBF3DE; color:#14304F; cursor:pointer; padding:0; flex:none; transition:transform .12s ease, background .12s ease, box-shadow .12s ease; }
  .eqp-page .chat-icon-btn:hover{ background:#F5E4B4; transform:scale(1.06); box-shadow:0 2px 10px rgba(217,166,43,0.35); }
  .eqp-page .chat-icon-btn:active{ transform:scale(0.97); }
  .eqp-page .chat-icon-btn .icon{ width:20px; height:20px; }
  .eqp-page .chat-icon-btn .chat-unread-badge{ position:absolute; top:-7px; right:-7px; margin-left:0; }
  .eqp-page .chat-icon-btn.has-unread{ background:#D9A62B; border-color:#C9971F; color:#fff; }
  .eqp-page .chat-icon-btn.has-unread:hover{ background:#C9971F; }

  /* ============ Chat popup (small modal) ============
     Fixed, centered, self-contained — deliberately NOT reusing
     .drawer/.drawer-overlay (that's an external bottom-sheet pattern from
     the site's own stylesheet, not something meant for a quick chat). */
  .chat-popup-overlay{ position:fixed; inset:0; background:rgba(20,48,79,0.45); z-index:60; display:none; }
  .chat-popup-overlay.open{ display:block; }
  .chat-popup{
    position:fixed; top:50%; left:50%; transform:translate(-50%,-50%);
    width:min(420px, calc(100vw - 32px)); max-height:min(560px, calc(100vh - 64px));
    background:#fff; border-radius:16px; box-shadow:0 20px 60px rgba(20,48,79,0.35);
    z-index:61; display:none; flex-direction:column; overflow:hidden;
  }
  .chat-popup.open{ display:flex; }
  .chat-popup-head{ display:flex; align-items:flex-start; justify-content:space-between; gap:10px; padding:16px 18px; border-bottom:1px solid #e5e7eb; flex:none; }
  .chat-popup-title{ font-size:15px; font-weight:700; color:#14304F; }
  .chat-popup-sub{ font-size:12px; color:#6b7280; margin-top:2px; }
  .chat-popup-close{ appearance:none; border:none; background:none; font-size:22px; line-height:1; color:#6b7280; cursor:pointer; padding:0 2px; flex:none; }
  .chat-popup-close:hover{ color:#14304F; }
  .chat-popup-thread{ flex:1; overflow-y:auto; padding:16px 18px; display:flex; flex-direction:column; gap:8px; min-height:120px; }
  .chat-popup-editor{ display:flex; gap:8px; align-items:flex-end; padding:14px 18px; border-top:1px solid #e5e7eb; flex:none; }
  .chat-popup-editor textarea{ flex:1; min-height:44px; max-height:110px; resize:vertical; border:1px solid #d1d5db; border-radius:8px; padding:8px 10px; font:inherit; }
  .chat-popup #chat-popup-error{ margin:0 18px 12px; }
  @media (max-width:480px){
    .chat-popup{ width:calc(100vw - 24px); }
  }

  .eqp-page .pagination{ display:flex; align-items:center; justify-content:center; gap:14px; padding:16px 0; }
  .eqp-page .pagination:empty{ padding:0; }
  .eqp-page .page-btn{ appearance:none; border:1px solid #d7dbe3; background:#fff; color:#14304F; font-weight:600; font-size:13px; padding:6px 14px; border-radius:8px; cursor:pointer; }
  .eqp-page .page-btn:disabled{ opacity:0.4; cursor:not-allowed; }
  .eqp-page .page-indicator{ font-size:13px; color:#6b7280; }

  .eqp-page .section-head-actions{ display:flex; gap:10px; flex-wrap:wrap; }
  .eqp-page .field-hint{ margin:6px 0 0; font-size:12.5px; color:#6b7280; }
  .eqp-page .field-error{ margin:6px 0 0; font-size:12.5px; color:#b3261e; }
  .eqp-page .checkbox-field{ display:flex; align-items:flex-start; gap:8px; cursor:pointer; font-weight:600; }
  .eqp-page .checkbox-field input[type="checkbox"]{ margin-top:3px; width:16px; height:16px; flex:none; }
  .eqp-page .optional-tag{ font-weight:400; color:#6b7280; }

  .eqp-page .drawer-chat{ margin-top:20px; padding-top:16px; border-top:1px solid #e5e7eb; }
  .eqp-page .drawer-chat-title{ margin:0 0 10px; font-size:14px; font-weight:700; color:#14304F; }
  .eqp-page .drawer-chat-thread{ max-height:240px; overflow-y:auto; display:flex; flex-direction:column; gap:8px; margin-bottom:10px; }
  .eqp-page .chat-bubble-row{ display:flex; }
  .eqp-page .chat-bubble-row.mine{ justify-content:flex-end; }
  .eqp-page .chat-bubble-row.theirs{ justify-content:flex-start; }
  .eqp-page .chat-bubble{ max-width:80%; padding:8px 12px; border-radius:12px; font-size:13.5px; line-height:1.4; }
  .eqp-page .chat-bubble-row.mine .chat-bubble{ background:#14304F; color:#fff; border-bottom-right-radius:3px; }
  .eqp-page .chat-bubble-row.theirs .chat-bubble{ background:#F1F3F6; color:#1f2937; border-bottom-left-radius:3px; }
  .eqp-page .chat-bubble-meta{ font-size:11px; opacity:0.75; margin-bottom:2px; }
  .eqp-page .chat-empty-note{ font-size:13px; color:#6b7280; padding:8px 0; }
  .eqp-page .drawer-chat-editor{ display:flex; gap:8px; align-items:flex-end; }
  .eqp-page .drawer-chat-editor textarea{ flex:1; min-height:44px; max-height:120px; resize:vertical; border:1px solid #d1d5db; border-radius:8px; padding:8px 10px; font:inherit; }
  .eqp-page .chat-unread-badge{ display:inline-flex; align-items:center; justify-content:center; min-width:18px; height:18px; padding:0 5px; margin-left:6px; border-radius:999px; background:#b3261e; color:#fff; font-size:11px; font-weight:700; vertical-align:middle; }
</style>

<div class="position-relative text-white eqp-page" style="min-height: 100vh; width: 100%;">
  <i class="fa-arrow-left fas eqp-back position-absolute start-0 top-0 m-3 fs-2"
     style="z-index: 10; cursor: pointer; pointer-events: auto;"
     onclick="renderMissionsPage();"></i>

     <!-- ============ VIEW: ASSET REGISTER ============ -->
  <section class="view active" id="view-register">
    <div class="wrap">
      <!-- Intro text is now a fixed overlay on the carousel itself (stays
           put while the background photo rotates underneath) instead of
           its own box above/below it — see hero-intro-overlay in the
           style block. renderCarousel() in formLoad.js no longer draws a
           per-slide caption, so there's only ever one headline on screen. -->
      <div class="hero-carousel hero-intro-merged" id="hero-carousel">
        <div class="hc-track" id="hc-track"></div>
        <div class="hero-intro-overlay">
          <!-- <div class="page-intro-icon">
            <svg class="icon" viewBox="0 0 24 24"><path d="M21 8v13H3V8" stroke-linejoin="round"/><path d="M1 3h22v5H1z" stroke-linejoin="round"/><path d="M12 3v18"/><path d="M12 3C9 2 5 3 5 5.5S9 8 12 3Z" stroke-linejoin="round"/><path d="M12 3c3-1 7 0 7 2.5S15 8 12 3Z" stroke-linejoin="round"/></svg>
          </div> -->
          <h1 class="page-intro-lead">Equipment &amp; Resources</h1>
          <p class="page-intro-kicker">A shared shelf for mission hospitals</p>
          <p class="page-intro-sub">CMC lists equipment it no longer needs here first. Each listing stays open for a couple of weeks, so if something below helps, don't wait too long to ask.</p>
        </div>
        <button type="button" class="hc-nav prev" id="hc-prev" aria-label="Previous slide">
          <svg class="icon" viewBox="0 0 24 24"><path d="M15 6l-6 6 6 6"/></svg>
        </button>
        <button type="button" class="hc-nav next" id="hc-next" aria-label="Next slide">
          <svg class="icon" viewBox="0 0 24 24"><path d="M9 6l6 6-6 6"/></svg>
        </button>
        <div class="hc-dots" id="hc-dots"></div>
      </div>

      <!-- ============ PARTITION 1: Available Equipment ============
           Everything about browsing/adding equipment lives inside this
           one highlighted panel (navy accent) — heading, toolbar, the
           register itself, and the "how allocation works" banner — so
           it reads as one clearly bounded block rather than blending
           into "Equipment You Want" below it. -->
      <div class="eqp-partition eqp-partition-available">
        <div class="section-head">
          <h2 class="partition-heading">Available Equipment</h2>
          <div class="section-head-actions">
            <button type="button" class="btn btn-outline" id="history-btn">
              <svg class="icon" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2" stroke-linecap="round" stroke-linejoin="round"/></svg>
              History
            </button>
            <button type="button" class="btn btn-outline add-asset-btn" id="add-asset-btn">
              <svg class="icon" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>
              Add Equipment
            </button>
          </div>
        </div>

        <div class="toolbar">
          <div class="search-box">
            <svg class="icon" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>
            <input type="text" id="search" placeholder="Search...">
          </div>
          <select class="filter-select" id="cat-filter">
            <option value="all">All types</option>
            <option value="Computer">Computer</option>
            <option value="Furniture">Furniture</option>
            <option value="Accessory">Accessory</option>
            <option value="Spare">Spare</option>
            <option value="Consumables">Consumables</option>
            <option value="Instrument">Instrument</option>
          </select>
          <div class="view-switch" id="view-switch" role="group" aria-label="Change layout">
            <button type="button" data-view="table" title="Table view" aria-label="Table view">
              <svg class="icon" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="16" rx="1.5"/><path d="M3 10h18M9 4v16"/></svg>
            </button>
            <button type="button" class="active" data-view="tiles" title="Tiles view" aria-label="Tiles view">
              <svg class="icon" viewBox="0 0 24 24"><rect x="3" y="3" width="8" height="8" rx="1.5"/><rect x="13" y="3" width="8" height="8" rx="1.5"/><rect x="3" y="13" width="8" height="8" rx="1.5"/><rect x="13" y="13" width="8" height="8" rx="1.5"/></svg>
            </button>
            <button type="button" data-view="list" title="List view" aria-label="List view">
              <svg class="icon" viewBox="0 0 24 24"><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/></svg>
            </button>
          </div>
        </div>

        <div class="eqp-col eqp-col-items" id="col-items">
          <div class="register mode-tiles" id="register-panel">
            <div class="reg-row reg-head">
              <div>Item</div>
              <div>Available</div>
              <div>Status</div>
              <div></div>
            </div>
            <div id="register-body"></div>
          </div>
          <div class="pagination" id="register-pagination"></div>
        </div>

        <!-- ============ How allocation works ============
             Used to sit behind the (i) button as a popover; shown
             directly instead — the same information, no tap required. -->
        <div class="allocation-info">
          <div class="allocation-info-text">
            <h3>How allocation works</h3>
            <p>Every application is reviewed against the same criteria we use for grants — so hospitals with the greatest need and the clearest impact are prioritised, not whoever applies first.</p>
          </div>
          <div class="allocation-info-criteria">
            <div class="ac-item">
              <span class="ac-icon"><svg class="icon" viewBox="0 0 24 24"><path d="M12 20s-7-4.35-9.5-8.8C.9 8 2.3 4.5 5.8 4c2.1-.3 3.9.8 6.2 3 2.3-2.2 4.1-3.3 6.2-3 3.5.5 4.9 4 3.3 7.2C19 15.65 12 20 12 20Z"/></svg></span>
              <span class="ac-label">Level of Need</span>
            </div>
            <div class="ac-item">
              <span class="ac-icon"><svg class="icon" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="4"/></svg></span>
              <span class="ac-label">Expected Impact</span>
            </div>
            <div class="ac-item">
              <span class="ac-icon"><svg class="icon" viewBox="0 0 24 24"><rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 8h6M9 12h6M9 16h3"/></svg></span>
              <span class="ac-label">Readiness to Deploy</span>
            </div>
            <div class="ac-item">
              <span class="ac-icon"><svg class="icon" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg></span>
              <span class="ac-label">Fair Distribution</span>
            </div>
          </div>
        </div>
      </div>

      <!-- ============ PARTITION 2: Equipment You Want ============
           Its own separately highlighted panel (gold accent, distinct
           from the navy "Available Equipment" panel above) so it's
           unmistakably a different kind of thing: not stock to browse,
           but a request form for what isn't listed. -->
      <div class="eqp-partition eqp-partition-want">
        <div class="section-head">
          <h2 class="partition-heading">Equipment You Want</h2>
          <button type="button" class="info-btn" data-info="info-want" aria-expanded="false" aria-label="About this form">
            <svg class="icon" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 11v5" stroke-linecap="round"/><circle cx="12" cy="7.6" r="1" fill="currentColor" stroke="none"/></svg>
          </button>
          <div class="info-pop" id="info-want" hidden>
            <p>Can't find what you need above? Tell us and we'll look into it.</p>
            <ul>
              <li><b>Reviewed regularly</b> — checked every few months.</li>
              <li><b>Urgent needs first</b> — mark it Critical for faster follow-up.</li>
              <li><b>Track it anytime</b> — see its status under My Requests.</li>
            </ul>
          </div>
        </div>

        <div class="form-panel">
          <form id="request-form">
            <div class="field">
              <label>Test Hospital</label>
              <!-- <select id="req-hospital" required>
                <option value="" disabled selected>Select your hospital</option>
              </select> -->
            </div>
            <div class="field-row" style="margin-bottom:16px;">
              <div class="field" style="margin-bottom:0;">
                <label>What do you need?</label>
                <input type="text" id="req-name" placeholder="" required>
              </div>
              <div class="field" style="margin-bottom:0;">
                <label>Category</label>
                <select id="req-category">
                  <option>Computer</option>
                  <option>Furniture</option>
                  <option>Accessory</option>
                  <option>Spare</option>
                  <option>Consumables</option>
                  <option>Instrument</option>
                  <option>Other</option>
                </select>
              </div>
            </div>
            <div class="field-row" style="margin-bottom:16px;">
              <div class="field" style="margin-bottom:0;">
                <label>How many?</label>
                <input type="number" min="1" id="req-qty" placeholder="" required>
              </div>
              <div class="field" style="margin-bottom:0;">
                <label>Urgency</label>
                <select id="req-urgency">
                  <option>Critical — patient care affected now</option>
                  <option>High — needed within weeks</option>
                  <option>Medium — planned improvement</option>
                  <option>Low — would be useful eventually</option>
                </select>
              </div>
            </div>
            <div class="field">
              <label>Could you tell us a little about why this would help?</label>
              <textarea id="req-why" placeholder="Tell us about the situation this would help solve..." required></textarea>
            </div>
            <div class="form-actions">
              <button type="button" class="btn btn-outline" id="req-draft">Save for later</button>
              <button type="submit" class="btn btn-gold">Send Request</button>
            </div>
            <div class="toast" id="req-toast" style="margin:14px 0 0;">
              <svg class="icon" viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5"/></svg>
              <span id="req-toast-text">Sent — check My Requests to see it.</span>
            </div>
          </form>
        </div>
      </div>

      <!-- ============ Bottom: My Requests / Requests ============
           Moved out from beside the item register (that grid used to
           put Available Equipment and someone's own request history
           side by side, which is what made the whole area read as one
           confusing block) and down here instead, below both partitions
           above. Column 1 (My Requests) shows for role="Missions";
           column 2 (Requests) shows for role="Admin" — see
           showMyRequestsCol/showRequestsCol in formLoad.js, unchanged.
           data-cols on this element (still id="eqp-columns", still set
           from JS) drives whether one or both columns are visible; it
           always stacks to one below 900px regardless. -->
      <div class="eqp-columns eqp-requests-bottom" id="eqp-columns" data-cols="1">
        <div class="eqp-col eqp-col-side" id="col-myrequests" hidden>
          <div class="eqp-col-head">
            <h3>My Requests</h3>
            <span class="tab-badge" id="tab-badge-myrequests" hidden></span>
          </div>
          <p class="eqp-col-sub">Everything you've asked for, and where it stands.</p>
          <div id="apps-empty" class="apps-empty">You haven't asked for anything yet. Tap View &amp; Apply on an item.</div>
          <div id="apps-table-wrap" style="display:none;">
            <div id="apps-list" class="req-card-list"></div>
            <div class="pagination" id="apps-pagination"></div>
          </div>
        </div>

        <div class="eqp-col eqp-col-side" id="col-requests" hidden>
          <div class="eqp-col-head">
            <h3>Requests</h3>
            <span class="tab-badge" id="tab-badge-connectview" hidden></span>
          </div>
          <p class="eqp-col-sub">Every request and application, from every hospital.</p>
          <div id="connect-empty" class="apps-empty">No requests have come in yet.</div>
          <div id="connect-table-wrap" style="display:none;">
            <div id="connect-list" class="req-card-list"></div>
            <div class="pagination" id="connect-pagination"></div>
          </div>
        </div>
      </div>

    </div>
  </section>



</div>

<!-- ============ Chat popup (small modal) ============
     A dedicated small popup for the request chat, separate from the full
     request-detail drawer below. The per-row chat icon opens THIS instead
     of the full drawer now — tapping the row itself still opens the full
     detail. Self-contained markup + CSS (see .chat-popup rules in the
     style block above) rather than reusing .drawer/.drawer-overlay, since
     those come from the site's own stylesheet (not supplied to us) and
     are a bottom-sheet pattern, not a small centered popup. -->
<div class="chat-popup-overlay" id="chat-popup-overlay"></div>
<div class="chat-popup" id="chat-popup" role="dialog" aria-modal="true" aria-labelledby="chat-popup-title">
  <div class="chat-popup-head">
    <div>
      <div class="chat-popup-title" id="chat-popup-title">Messages</div>
      <div class="chat-popup-sub" id="chat-popup-sub"></div>
    </div>
    <button type="button" class="chat-popup-close" id="chat-popup-close" aria-label="Close">&times;</button>
  </div>
  <div class="chat-popup-thread" id="chat-popup-thread"></div>
  <div class="chat-popup-editor">
    <textarea id="chat-popup-input" placeholder="Write a message..."></textarea>
    <button type="button" class="btn btn-gold" id="chat-popup-send">Send</button>
  </div>
  <p class="field-error" id="chat-popup-error" hidden></p>
</div>

<div class="drawer-overlay eqp-page" id="drawer-overlay"></div>
<div class="drawer eqp-page" id="drawer" role="dialog" aria-modal="true" aria-labelledby="drawer-title">
  <div class="drawer-grabber" aria-hidden="true"></div>
  <div class="drawer-head">
    <div>
      <div class="drawer-title" id="drawer-title"></div>
      <div class="drawer-sub" id="drawer-sub"></div>
    </div>
    <button type="button" class="drawer-close" id="drawer-close" aria-label="Close">&times;</button>
  </div>
  <div class="drawer-body">
    <div class="drawer-columns">

      <div class="drawer-photos" id="drawer-photos">
        <div class="drawer-gallery" id="drawer-gallery">
          <div class="gallery-grid" id="gallery-grid"></div>
        </div>
        <p class="drawer-desc" id="drawer-desc"></p>
        <span class="status-chip open drawer-status" id="drawer-avail-chip"><span class="dot"></span>Available to request</span>
      </div>

      <div class="drawer-main">

        <!-- Shown instead of the form when viewing an existing request from
             My Requests (openRequestDetail) rather than applying for a new
             one (openDrawer). Hidden by default / in apply mode. -->
        <div class="drawer-status-block" id="drawer-status-block" hidden>
          <span class="status-chip" id="drawer-req-status-chip"><span class="dot"></span><span id="drawer-req-status-label"></span></span>
          <p class="drawer-status-msg" id="drawer-status-msg"></p>
          <div class="drawer-status-meta" id="drawer-status-meta"></div>

          <!-- ============ Two-way chat on this request ============
               Shared by both the hospital side and the Missions Office /
               connect side — which "side" is posting is decided by
               isConnectSide() in formLoad.js, not by anything in this
               markup. -->
          <div class="drawer-chat" id="drawer-chat" hidden>
            <h4 class="drawer-chat-title">Messages about this request</h4>
            <div class="drawer-chat-thread" id="drawer-chat-thread"></div>
            <div class="drawer-chat-editor">
              <textarea id="drawer-chat-input" placeholder="Write a message..."></textarea>
              <button type="button" class="btn btn-gold" id="drawer-chat-send">Send</button>
            </div>
            <p class="field-error" id="drawer-chat-error" hidden></p>
          </div>
        </div>

        <form id="apply-form">
          <div class="field">
            <label>Test Hospital</label>
            <!-- <select id="apply-hospital" required>
              <option value="" disabled selected>Select your hospital</option>
            </select> -->
          </div>
          <div class="field">
            <label>How many do you need?</label>
            <input type="number" min="1" id="apply-qty" placeholder="e.g. 1" required>
          </div>
          <div class="field">
            <label>Could you tell us a little about why this would help?</label>
            <textarea id="apply-situation" required></textarea>
          </div>
          <div class="field">
            <label>How will you collect it?</label>
            <textarea id="apply-collection" required></textarea>
          </div>
        </form>
      </div>

    </div>
  </div>
  <div class="toast" id="apply-toast">
    <svg class="icon" viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5"/></svg>
    <span id="apply-toast-text">Sent — check My Requests to see it.</span>
  </div>
  <div class="drawer-foot" id="drawer-foot">
    <button type="button" class="btn btn-outline" id="apply-draft">Save for later</button>
    <button type="submit" form="apply-form" class="btn btn-gold">Send Request</button>
  </div>
</div>

<div class="drawer-overlay eqp-page" id="asset-form-overlay"></div>
<div class="drawer eqp-page" id="asset-form-drawer" role="dialog" aria-modal="true" aria-labelledby="asset-form-title">
  <div class="drawer-grabber" aria-hidden="true"></div>
  <div class="drawer-head">
    <div>
      <div class="drawer-title" id="asset-form-title">Add equipment to the register</div>
      <div class="drawer-sub">Fill this in once — it shows up in Available Equipment right away.</div>
    </div>
    <button type="button" class="drawer-close" id="asset-form-close" aria-label="Close">&times;</button>
  </div>
  <div class="drawer-body">
    <form id="asset-form">
      <div class="field">
        <label>Item name</label>
        <input type="text" id="asset-name" placeholder="e.g. Oxygen Concentrator" required>
      </div>
      <div class="field-row">
        <div class="field">
          <label>Category</label>
          <select id="asset-category" required>
            <option value="" disabled selected>Select a category</option>
            <!-- Matches the "What type is this?" filter above (cat-filter)
                 so anything added here can actually be found by it. -->
            <option>Computer</option>
            <option>Furniture</option>
            <option>Accessory</option>
            <option>Spare</option>
            <option>Consumables</option>
            <option>Instrument</option>
          </select>
        </div>
        <div class="field">
          <label>Condition</label>
          <select id="asset-condition" required>
            <option value="" disabled selected>Select condition</option>
            <option>New</option>
            <option>Excellent</option>
            <option>Good — Serviced</option>
            <option>Fair — Functional</option>
            <option>Needs Repair</option>
          </select>
        </div>
      </div>
      <div class="field-row">
        <div class="field">
          <label>Brand / model</label>
          <input type="text" id="asset-model" placeholder="e.g. Philips EverFlo, 2019">
        </div>
        <div class="field">
          <label>Units available</label>
          <input type="number" min="0" id="asset-units" placeholder="e.g. 2" required>
        </div>
      </div>
      <div class="field">
        <label>Description</label>
        <textarea id="asset-description" placeholder="Condition notes, what it's suited for, anything a hospital should know..." required></textarea>
      </div>
      <div class="field-row">
        <div class="field">
          <label>Listing closes on</label>
          <input type="date" id="asset-close-date" required>
          <p class="field-hint">Listings need to stay open for at least 2 months, so the earliest close date you can pick is 2 months from today.</p>
          <p class="field-error" id="asset-close-date-error" hidden></p>
        </div>
        <div class="field">
          <label>Photo URL (optional)</label>
          <input type="text" id="asset-photo-url" placeholder="Paste an image link — leave blank for a placeholder picture">
        </div>
      </div>
      <div class="field">
        <label class="checkbox-field">
          <input type="checkbox" id="asset-has-deadline">
          <span>Set a deadline to collect it by? <span class="optional-tag">(optional)</span></span>
        </label>
      </div>
      <div class="field" id="asset-deadline-field" hidden>
        <label>Deadline to collect</label>
        <input type="date" id="asset-collect-deadline">
        <p class="field-hint">Only needed if collection has to happen by a specific date. Leave the box above unchecked if not.</p>
        <p class="field-error" id="asset-collect-deadline-error" hidden></p>
      </div>
    </form>
  </div>
  <div class="toast" id="asset-form-toast">
    <svg class="icon" viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5"/></svg>
    <span id="asset-form-toast-text">Added — it's now showing in Available Equipment.</span>
  </div>
  <div class="drawer-foot">
    <button type="button" class="btn btn-outline" id="asset-form-cancel">Cancel</button>
    <button type="submit" form="asset-form" class="btn btn-gold">Add to register</button>
  </div>
</div>

<!-- ============ History of equipment ============
     Every item ever added to the register, whether it's still open,
     closing soon, fully allotted or closed — nothing drops out of this
     list the way it drops out of Available Equipment. -->
<div class="drawer-overlay eqp-page" id="history-overlay"></div>
<div class="drawer eqp-page" id="history-drawer" role="dialog" aria-modal="true" aria-labelledby="history-title">
  <div class="drawer-grabber" aria-hidden="true"></div>
  <div class="drawer-head">
    <div>
      <div class="drawer-title" id="history-title">Equipment history</div>
      <div class="drawer-sub">Everything that's been listed here, past and present.</div>
    </div>
    <button type="button" class="drawer-close" id="history-close" aria-label="Close">&times;</button>
  </div>
  <div class="drawer-body">
    <div class="register" id="history-table-wrap">
      <div class="log-row log-head">
        <div>Item</div>
        <div>Added / Closes</div>
        <div>Status</div>
        <div></div>
      </div>
      <div id="history-list"></div>
    </div>
    <div class="pagination" id="history-pagination"></div>
    <div class="empty-note" id="history-empty" hidden>Nothing has been added to the register yet.</div>
  </div>
</div>

<!-- ============ Photo viewer (opened from the drawer's gallery) ============ -->
<div class="lightbox eqp-page" id="lightbox" role="dialog" aria-modal="true" aria-label="Photo viewer">
  <button type="button" class="lightbox-close" id="lightbox-close" aria-label="Close photo viewer">&times;</button>
  <button type="button" class="lightbox-nav prev" id="lightbox-prev" aria-label="Previous photo">
    <svg class="icon" viewBox="0 0 24 24"><path d="M15 6l-6 6 6 6"/></svg>
  </button>
  <img class="lightbox-img" id="lightbox-img" src="" alt="">
  <button type="button" class="lightbox-nav next" id="lightbox-next" aria-label="Next photo">
    <svg class="icon" viewBox="0 0 24 24"><path d="M9 6l6 6-6 6"/></svg>
  </button>
  <div class="lightbox-count" id="lightbox-count"></div>
</div>`;
  },
"weeklyManna": function(data) {
    return `<div class="bg-white">
  <div class="position-relative">
    <h2 class="text-center bg-white p-3 rounded msnHospTitle connect-primary-border">Weekly Manna</h2>
    <i class="bg-opacity-10 fa-arrow-left fas rounded position-absolute start-0 top-0 m-3 fs-2 pe-pointer"onclick="renderMissionsPage()"></i>
  </div>

        <div class="overflow-auto p-3 ">
        <table id="weeklyMannaTable" class="display mb-3" width="100%"></table>
      </div>
  <div class="text-end px-3">Please write to us: <a href="mailto:missionsoffice@cmcvellore.ac.in">missionsoffice@cmcvellore.ac.in</a><br>Or call: +91 416 228 6117</div>


</div>
`;
  },
"finance": function(data) {
    return `

<div class="bg-white h-100 py-4">
  <div class="position-relative">
    <h2 class="text-center bg-white p-3 rounded msnHospTitle connect-primary-border">My Requests for Finance</h2>
    <i class="bg-opacity-10 fa-arrow-left fas rounded position-absolute start-0 top-0 m-3 fs-2 pe-pointer"
      onclick="renderMissionsPage(); clearGlobalFilters();"></i>
  </div>

  <div class="container-fluid px-3">
    <div class="row">

      <!-- Left column: card -->
      <div class="col-md-4 mt-5 pe-0">
        <div class="container-fluid pt-3 z-1">
          
          <div class="row" data-row="row-undefined">
            
            
            
            
            <div class="col-12 mb-0 col-md-12" data-column="col-undefined">
              
              <div class="col-12 mb-2 mb-md-4 "
                data-row-col="card-rowundefined-column-undefined">
                
                
<p class="fst-italic text-info" style="font-size: 15px;">
  <button id="clearStatusFilters" class="btn btn-sm secondary-bg-color text-white ms-2">Clear All</button>* Reclick the
  cards to unselect
</p>
<div class="d-flex flex-wrap w-100 justify-content-around">
  
  <button type="button" class="p-1 p-md-2 d-flex flex-column flex-wrap align-items-center justify-content-center subcard z-1
         mb-2
        d-flex align-items-center shadow rounded-3 status-filter-btn btn" data-status="submitted"
    style="border-top: 5px solid #addae6 !important; background-color: white;">

    <div class="d-flex align-items-center gap-3">
      <i class="fas fa-paper-plane" style="color: #addae6;"></i>
      <div class="fs-2 text-dark" id="financeStatus1"></div>
    </div>
    <p class="fw-light text-dark mb-0">Submitted</p>
  </button>
  
  <button type="button" class="p-1 p-md-2 d-flex flex-column flex-wrap align-items-center justify-content-center subcard z-1
         mb-2
        d-flex align-items-center shadow rounded-3 status-filter-btn btn" data-status="in progress"
    style="border-top: 5px solid #b0e694 !important; background-color: white;">

    <div class="d-flex align-items-center gap-3">
      <i class="fas fa-subway" style="color: #b0e694;"></i>
      <div class="fs-2 text-dark" id="financeStatus2"></div>
    </div>
    <p class="fw-light text-dark mb-0">In Progress</p>
  </button>
  
  <button type="button" class="p-1 p-md-2 d-flex flex-column flex-wrap align-items-center justify-content-center subcard z-1
         mb-2
        d-flex align-items-center shadow rounded-3 status-filter-btn btn" data-status="completed"
    style="border-top: 5px solid #e57171 !important; background-color: white;">

    <div class="d-flex align-items-center gap-3">
      <i class="fas fa-download" style="color: #e57171;"></i>
      <div class="fs-2 text-dark" id="financeStatus3"></div>
    </div>
    <p class="fw-light text-dark mb-0">Completed</p>
  </button>
  
</div>

                

              </div>
              
            </div>
            
          </div>
          
        </div>
      </div>

      <!-- Right column: Table -->
      <div class="col-md-8 mb-3 ps-0">
        <div class="overflow-auto p-3 ">
          <table id="missionFinance" class="display mb-3" width="100%"></table>
        </div>
      </div>

    </div>
  </div>

  <div class="text-end px-3">Please write to us: <a
      href="mailto:missionsoffice@cmcvellore.ac.in">missionsoffice@cmcvellore.ac.in</a><br>Or call: +91 416 228 6117
  </div>
</div>`;
  },
"libraryAccess": function(data) {
    return `<div class="position-relative text-white" style="min-height: 500px;">
  <i class="fa-arrow-left fas position-absolute start-0 top-0 m-3 fs-2"
    style="z-index: 10; cursor: pointer; pointer-events: auto;" onclick="renderMissionsPage();"></i>

  <div style="background: url('https://s3.amazonaws.com/img.studenthub.in/CMCVConnect_Portal/Pictures/_ec3043ca05a909a7b05cf914d71e6bc5_Pictures.jpg') center center / cover no-repeat;
              opacity: 0.6; position: absolute; top: 0; left: 0;
              height: 100%; width: 100%; z-index: 1;"></div>

  <div class="container h-100 position-relative" style="z-index: 2; max-width: 1500px;">
    <div class="d-flex align-items-center justify-content-center h-100">
      <div class="row justify-content-center align-items-center text-white w-100">

        <!-- Left Text -->
        <div class="col-md-6 mb-4 mb-md-0 text-md-start" style="margin-top: 80px;">
          <h1 class="fw-bold display-4">Our Library Services</h1>
          <p class="lead" style="line-height: 1.8; word-spacing: 2px; font-weight: 300; font-family: math;">
            Welcome to CMC's E-Library! We offer an extensive collection of digital resources, including academic
            journals, e-books, and various learning materials.
            This selection is designed to support the needs of students, professionals, and researchers in their
            academic, clinical, and research endeavors.
            Dive in and explore!
          </p>
        </div>

        <!-- Right Login Box -->
        <div class="col-md-3 mb-4" style="margin-top: 80px;">
          <div class="bg-white text-dark p-4 px-0 rounded shadow text-center">
            <h5 class="mb-3">If you have access, please login here</h5>
            <img
              src="https://s3.amazonaws.com/img.studenthub.in/CMCVConnect_Portal/Pictures/_94562e09af771a965697738fc1514fe7_Pictures.png"
              class="img-fluid mx-auto d-block w-50 mb-3" alt="Library Access Image">
            <a href="https://app.myloft.xyz/user/login?institute=ckr0hexbsvrcd0927d54m0cbi" class="btn btn-primary w-25"
              target="_blank">Login</a>
          </div>
        </div>

      </div>
    </div>
  </div>
</div>

<!-- Dodd Library Section -->
<div class="py-4" style="background-color: rgb(255, 232, 203);">
  <div class="container" style="max-width: 1110px;">
    <p class="mb-0 fs-5" style="word-spacing: 2px;">
      <strong class="fs-4">CMC Library</strong><br>
      <br>
      To access free journals and books available in the Dodd Library, please click the link:<br>
      <a href="https://dodd.cmcvellore.ac.in/" target="_blank">https://dodd.cmcvellore.ac.in/</a>
    </p>
  </div>
</div>

<div class="position-relative text-white" style="min-height: 680px;">

  <div style="background: url('https://s3.amazonaws.com/img.studenthub.in/CMCVConnect_Portal/Pictures/_56dd2c06687d44fa93422717f686d21f_Pictures.jpg') center center / cover no-repeat; opacity: 0.6; position: absolute; top: 0; 
    left: 0; height: 100%; width: 100%; z-index: 1;"></div>

  <div class="container h-100 position-relative" style="z-index: 2;">
    <div class="row align-items-center h-100 py-5">

      <!-- Left Text -->
      <div class="col-md-6 p-1" style=" border-radius: 15px; 
                                  background-color: rgba(40, 40, 40, 0.4); backdrop-filter: blur(6px);">
        <h2 class="fw-bold text-center">Subscribed Journals</h2>
        <br>
        <div class="p-3 lead" style="line-height: 1.8; word-spacing: 2px; font-weight: 300;">
          <p>
            To obtain access to subscribed journals, please follow these guidelines:<br><br>
            1. Before submitting a new form, please verify with your Hospital Administrator whether your hospital or
            organization has already been granted access. <br>
            2. To request new access or to renew your existing access, kindly complete the designated short form
            provided.<br>
            <br>
          <p class="text-center" style="color: bisque;">Access will be granted based on institutional affiliation and
            is subject to the approval of the Library Services team.</p>
          </p>
        </div>

      </div>

      <!-- Request Form Panel -->
      <div class="col-md-6">
        <div class="bg-white text-dark p-4 rounded shadow">
          <h5 class="text-center mb-3">If you don't have access, please fill the form here</h5>
          <div class="overflow-auto p-3" style="max-height: 450px;">
            <div id="missionLibraryAccess" class="display" style="width: 100%;"></div>
          </div>
        </div>
      </div>

    </div>
  </div>
</div>

</div>`;
  },
"research": function(data) {
    return `<div class="bg-black text-center">
  <h1 class="text-danger mb-0 m-2 fs-md-1"
    style="position: relative; font-size: clamp(0.8rem, 5vw, 2.8rem); left: 5px;">Research</h1>
  <p class="text-warning fst-italic mb-0 fs-md-5" style="position: relative; font-size: 18px;">“It is He
    who reveals the profound and hidden things; He knows what is in the darkness,​ And the light dwells with Him”<br>
  <p class="text-end text-warning fst-italic mb-0 w-75 fs-md-5"> Daniel 2:22​</p>

</div>
<div class="text-center py-5 position-relative"
  style="background: url('https://s3.amazonaws.com/img.studenthub.in/CMCVConnect_Portal/Pictures/_3eaa82c4e0fc4be5d0d410c4de18cf9a_Pictures.jpg') center center / cover no-repeat; min-height: 250px; font-family: math;">
  <div style=" position: absolute; top: 0; left: 0; width: 100%; height: 100%;"></div>
  <i class="fa-arrow-left fas text-white position-absolute start-0 top-0 m-3 fs-2 pe-pointer" style="z-index: 2;"
    onclick="renderPostHomePage();"></i>

  <!-- Offcanvas Toggle Button - Visible Only on Mobile -->
  <div class="d-block d-md-none position-relative text-end p-3">
    <button class="btn secondary-bg-color text-white fw-bold" type="button" data-bs-toggle="offcanvas"
      data-bs-target="#mobileMenu" aria-controls="mobileMenu">
      <i class="fas fa-bars me-2"></i> Menu
    </button>
  </div>

  <!-- Offcanvas Menu -->
  <div class="offcanvas offcanvas-start" tabindex="-1" id="mobileMenu" aria-labelledby="mobileMenuLabel">
    <div class="offcanvas-header">
      <h5 class="offcanvas-title" id="mobileMenuLabel">Research Menu</h5>
      <button type="button" class="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
    </div>
    <div class="offcanvas-body d-flex flex-column border gap-2">
      <button class="btn border w-100" onclick="navigateTo('grants', {}, ['loadGrantsListTable',[]])">Grants</button>
      <button class="btn border w-100"
        onclick="navigateTo('publications', {}, ['loadPublicationsMap', []])">Publications</button>
      <button class="btn border w-100" onclick="navigateTo('grandRounds', {}, [
  ['loadGrandRoundsTable', []],
  ['loadGrandRoundsVideos', [10]]
]);
">Grand
        Rounds</button>
      <button class="btn fs-4 text-black bg-warning fw-bold rounded-3 shadow-sm position-relative"
        onclick="openModal('formIO', null, 'Research Request Form'); loadResearchRequest();"> Research Request
        Form</span>
        <i class="fa-brands fa-wpforms fs-1"></i>
      </button>
    </div>
  </div>

  <!-- Desktop View Button Grid (hidden on mobile) -->
  <div class="px-5 d-none d-md-block h-100 position-relative d-flex align-items-center justify-content-center"
    style="z-index: 2; margin-top: 260px;">
    <div class="d-flex flex-wrap gap-4 w-100 justify-content-between align-items-center">

      <!-- Left buttons -->
      <div class="d-flex flex-wrap gap-4">
        <button class="btn fs-4 text-black bg-body-secondary fw-bold px-4 py-3 rounded-3 shadow-sm"
          onclick="navigateTo('researchGrant', {}, [['loadGrantsAwardee',[]]])" style="min-width: 180px; height: 70px;">
          Grants
        </button>
        <button class="btn fs-4 text-black bg-body-secondary fw-bold px-4 py-3 rounded-3 shadow-sm"
          onclick="navigateTo('publications', {}, ['loadPublicationsMap', []])" style="min-width: 180px; height: 70px;">
          Publications
        </button>
        <button class="btn fs-4 text-black bg-body-secondary fw-bold px-4 py-3 rounded-3 shadow-sm" onclick="navigateTo('grandRounds', {backTo: 'loadResearchCards()'}, [
  ['loadGrandRoundsTable', []],
  ['loadGrandRoundsVideos', [10]]
]);
" style="min-width: 180px; height: 70px;">
          Grand Rounds
        </button>
      </div>

      <!-- Right button -->
      <div class="ms-auto">
        <button class="btn px-4 pt-2 text-black fw-bold rounded-3 shadow-sm position-relative"
          style="background: linear-gradient(180deg, #eee04f, #f5dc5c86);"
          onclick="openModal('formIO', null, 'Research Request Form'); loadResearchRequest();">
          <h3 class=" text-center">Research Request Form</h3>
          <p class="text-start"><i class="fa-brands fa-wpforms" style="font-size: 60px;"></i> Click Here</p>
          <p class="text-start mb-0">Further Queries: </p>
          <p>Email - missions.research@cmcvellore.ac.in </p>
        </button>
      </div>
    </div>
  </div>


</div>

<!-- Two Empty Panels -->
<div class="">
  <div class="container-fluid py-4" style="position: relative; z-index: 3;">
    <div class="row g-4 mb-5">
      <div class="col-12 col-md-6">
        <div
          class="bg-secondary-subtle shadow-sm rounded-3 px-2 py-3 h-100 border align-items-start fixed-card-container">
          <h5 class="fw-semibold d-flex align-items-center">
            Recent Interesting Publications
            <i class="fas fa-info-circle ms-2 text-muted" data-bs-toggle="tooltip" data-bs-placement="right"
              title="Curated by the Missions Office from around the world"></i>
          </h5>
          <div class="col-12">
            <div class="bg-white rounded-3" id="recentPublicCards"></div>
          </div>
        </div>
      </div>

      <div class="col-12 col-md-6">
        <div
          class="bg-secondary-subtle shadow-sm rounded-3 px-2 py-3 h-100 border align-items-start fixed-card-container">
          <h5 class="fw-semibold d-flex align-items-center">
            Latest Public Health News
            <i class="fas fa-info-circle ms-2 text-muted" data-bs-toggle="tooltip" data-bs-placement="right"
              title="Curated by the Missions Office from around the world"></i>
          </h5>
          <div class="col-12">
            <div class="bg-white rounded-3" id="recentNewsCards"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>


<div class="position-relative align-content-center justify-content-center"
  style="background: url('https://s3.amazonaws.com/img.studenthub.in/CMCVConnect_Portal/Pictures/_b925445e5e3904f4edb0cf9b687f6280_Pictures.jpg') center center / cover no-repeat; height: 70%; font-family: math;">
  <div style="background: rgba(69, 68, 68, 0.532); position: absolute; top: 0; left: 0; width: 100%; height: 100%;">
  </div>
  <h4 class="text-center text-white position-relative" style="font-size: 4vmin;"> Research Legacies</h4>
  <div class="timeline-wrapper clearfix">
    <div id="timelineContainer"></div>
  </div>
</div>`;
  },
"academicConclave": function(data) {
    return `<div class="container-fluid p-0 " style="font-family: sans-serif;">

  <header class="position-relative shadow-sm">

    <div class="d-flex align-items-center bg-white text-black justify-content-center p-3">
      <i class="fas fa-arrow-left position-absolute start-0 ms-3 cursor-pointer" onclick="renderMissionsPage()"></i>
    </div>
    <div class="bg-dark py-5">
      <div class="container">
        <div class="row text-center g-4 row-cols-2 row-cols-md-3 row-cols-lg-5 justify-content-center">

          <div class="col col-4">
            <a onclick="document.querySelector('#aboutConclave').scrollIntoView({ behavior: 'smooth' });"
              class="nav-item-circle">
              <i class="fa-solid fa-users-line border rounded-circle fs-2 nav-icon-circle text-white"></i>
              <h6 class="fw-bold text-white">About Conclave</h6>
            </a>
          </div>

          <div class="col col-4">
            <a onclick="document.querySelector('#agenda').scrollIntoView({ behavior: 'smooth' });"
              class="nav-item-circle">
              <i class="fa fa-calendar-check border rounded-circle fs-2 nav-icon-circle text-white"></i>
              <h6 class="fw-bold text-white">Agenda</h6>
            </a>
          </div>

          <div class="col col-4">
            <a onclick="document.querySelector('#participant').scrollIntoView({ behavior: 'smooth' });"
              class="nav-item-circle">
              <i class="fa fa-handshake border rounded-circle fs-2 nav-icon-circle text-white"></i>
              <h6 class="fw-bold text-white">Participants</h6>
            </a>
          </div>

          <div class="col col-6">
            <a onclick="document.querySelector('#faq-section').scrollIntoView({ behavior: 'smooth' });"
              class="nav-item-circle">
              <i class="fa fa-comments border rounded-circle fs-2 nav-icon-circle text-white"></i>
              <h6 class="fw-bold text-white">Discussions</h6>
            </a>
          </div>

          <div class="col col-6">
            <a onclick="document.querySelector('#wayForward').scrollIntoView({ behavior: 'smooth' });"
              class="nav-item-circle">
              <i class="fa fa-hand-point-right border rounded-circle fs-2 nav-icon-circle text-white"></i>
              <h6 class="fw-bold text-white">The Way Forward</h6>
            </a>
          </div>

        </div>
      </div>
    </div>

  </header>

  <section class="vision-section bg-secondary py-md-5 py-3">
    <div class="container-fluid px-md-5">
      <div class="row align-items-center">

        <div class="col-lg-5 col-md-12">
          <div class="overlap-card p-3 p-lg-5">
            <h2 class="fw-bold mb-4" style="font-family: serif;">Vision & Objective</h2>
            <p class="lh-lg ms-md-4 fs-md-5">
              - That we can work together to improve Medical Education, Service Delivery & Medical Research, and
              Community
              Outreach in India by sharing and adopting best practices and thereby generate a critical mass of
              competent,
              ethical, and socially responsible health workforce by strengthening Education, Service, Research &
              Outreach.
            </p>
          </div>
        </div>

        <div class="col-lg-7 col-md-12">
          <div class="vision-image-bg rounded shadow">
            <div class="text-white text-end pe-lg-5">
              <p class="fs-2 fw-bold italic-quote text-center">“So they strengthened their hands for this good work.”
              </p>
              <footer class="text-white mt-2 fs-5">- Nehemiah 2:18</footer>
            </div>
          </div>
        </div>

      </div>
    </div>
  </section>

  <section class="bg-dark py-5 px-3 text-white" id="aboutConclave">
    <div class="container">
      <div class="row justify-content-center mb-5">
        <div class="col-lg-10">
          <img
            src="https://s3.amazonaws.com/img.studenthub.in/CMCVConnect_Portal/Pictures/_4446db68fab7ae554bc8088e78514154_Pictures.jpeg"
            class="img-fluid rounded shadow" alt="Group">
          <h5 class="text-center mt-4 fs-md-5 fw-light px-md-3" style="font-family: math;">
            Approximately 100,000 doctors graduate annually from over 700 medical colleges in India.
            Yet ‘Health for All’ is a distant reality for many in this nation. As a handful of Christian
            minority institutions, do we have a mandate to be change-makers and bridge
            this gap?
          </h5>
        </div>
      </div>

  </section>

  <section class="py-4 bg-white">
    <div class="container">
      <div class="row align-items-center">
        <div class="col-md-6 text-center">
          <h1 class="fw-bold" style="font-family: Trirong;">Medical Colleges <br>Conclave 2025</h1>
        </div>
        <div class="col-md-6">
          <img
            src="https://s3.amazonaws.com/img.studenthub.in/CMCVConnect_Portal/Pictures/_db86b4ec3f698a72719353c484a73213_Pictures.png"
            class="rounded img-fluid shadow" alt="125 Years">
        </div>
      </div>

      <div class="container px-md-5 p-0 my-3">
        <div class="card border-0 shadow-sm p-3 mx-auto bg-body-secondary">
          <div class="row align-items-center">
            <div class="col-auto mx-auto mb-3 mb-md-0">
              <img
                src="https://s3.amazonaws.com/img.studenthub.in/CMCVConnect_Portal/Pictures/_b99f9fb4bc0a4c7969ec0888ebf61d18_Pictures.png"
                class="rounded" width="120" alt="Dr. Vikram">
            </div>
            <div class="col">
              <p class="mb-0">
                In his welcome address, <strong>Dr. Vikram Mathews</strong> encouraged all institutions to come together
                as
                minority institutions in the face of unique challenges in a rapidly changing environment and share
                experiences and explore ways of collaborating in areas of complementary strengths.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div class="row g-4 text-dark mt-3 p-3 mx-md-5" style="background-color: #FDFBF6;">
        <div class="col-md-6 col-lg-3">
          <p class="h-100 p-4 shadow-sm text-center rounded-3" style="background-color: #E8DCD8;">Currently, there are
            12 Christian
            Minority
            Medical
            Colleges each with a legacy of making transformational impact in terms of medical service, education,
            research, and outreach.</p>
        </div>
        <div class="col-md-6 col-lg-3">
          <div class="bg-black text-white h-100 p-4 shadow-sm text-center rounded-3">The conclave was a first step
            toward
            understanding each
            institution's strengths and identifying colloboration opportunities.</div>
        </div>
        <div class="col-md-6 col-lg-3">
          <div class="bg-white h-100 p-4 shadow-sm text-center rounded-3">A major takeaway was the need for a
            formal
            body to
            nurture collaborative initiatives, advocacy, joint government representations and research.</div>
        </div>
        <div class="col-md-6 col-lg-3">
          <div class="bg-body-secondary h-100 p-4 shadow-sm text-center rounded-3">Key proposals included creating
            referral
            channels for
            tertiary care, developing a missions innovation hub, and sharing manpower.</div>
        </div>
      </div>
    </div>


  </section>

  <section class="agenda-section py-5 bg-white" id="agenda">
    <div class="container-fluid p-3 d-flex flex-column align-items-center">

      <h2 class="text-center fw-bold mb-4">Agenda at a glance…</h2>
      <h4 class="text-center fw-bold mb-4 border bg-body-secondary p-2 px-4">Presentations</h4>

      <div class="row g-4 mt-2"
        style="background: url(https://s3.amazonaws.com/img.studenthub.in/CMCVConnect_Portal/Pictures/_77ebe6540ae3f4da6d10fb40d240c3b8_Pictures.JPG)center center/cover no-repeat;">

        <!-- Medical Education -->
        <div class="col-12 col-md-6 col-lg-3 m-0 p-0" style="opacity: 0.8;">
          <div class="agenda-card h-100 align-items-center">
            <img
              src="https://s3.amazonaws.com/img.studenthub.in/CMCVConnect_Portal/Pictures/_77ebe6540ae3f4da6d10fb40d240c3b8_Pictures.JPG"
              class="agenda-img" alt="">
            <h4>Medical Education</h4>
            <ol>
              <li>Christian Medical College, Vellore – Dr. Solomon Sathiskumar, Principal</li>
              <li>Pondicherry Institute of Medical Sciences - Dr. Renu G’Boy Varghese, Director- Principal</li>
              <li>Father Muller Medical College, Mangalore - Dr Antony Sylvan D Souza, Dean</li>
              <li>Amala Institute of Medical Sciences, Thrissur - Dr. Betsy Thomas</li>
            </ol>
            <button class="btn btn-summary pe-4"
              onclick="openModal('infoModal', null, { className: 'bg-primarycolor text-white p-3 rounded fs-md-5',
               title: 'Overview of Medical Education',
              data: '<ul><li>Varying college fee structures create mindset challenges that impact student motivation for missions.</li><li>There is a need for an advocacy body to represent medical education to the government.</li><li>Integrating humanities and communication workshops fosters empathy through behavioral modeling.</li><li>The INSPIRE program at Believer’s Medical College exposes students early to healthcare operations, promoting appreciation for all hospital roles.</li><li>An Interns Exit Exam is proposed to ensure qualitative assessment of graduates.</li></ul>' } )">
              Read the Summary</button>
          </div>
        </div>

        <!-- Medical Services -->
        <div class="col-12 col-md-6 col-lg-3 m-0 p-0" style="opacity: 0.9;">
          <div class="agenda-card h-100 align-items-center">
            <img
              src="https://s3.amazonaws.com/img.studenthub.in/CMCVConnect_Portal/Pictures/_1f4f6db30d2ca8071f96bcea0a9d6a24_Pictures.jpg"
              class="agenda-img" alt="">
            <h4>Medical Services</h4>
            <ol>
              <li>Christian Medical College, Vellore - Dr. I Rajesh, Medical Superintendent</li>
              <li> Malankara Orthodox Syrian Church Medical College Hospital, Kolenchery - Dr. Vergis Paul, Medical
                Superintendent</li>
              <li> Dr. Somervell Memorial CSI Hospital & Medical College, Thiruvananthapuram - Dr. Bennet Abraham –
                Director</li>
              <li>Pushpagiri Medical College, Thiruvalla -Dr. Vikram Gowda</li>
            </ol>
            <button class="btn btn-summary pe-4"
              onclick="openModal('infoModal', null, { className: 'bg-primarycolor text-white p-3 rounded fs-md-5', 
              title: 'Overview of Medical Services', data: '<h5>Modeling & Integrating Service and Education</h5><ul><li>Engage students early through hospital visits and shadowing</li><li>Support diverse learners by identifying and nurturing training needs</li><li>Empower junior faculty via mission postings and mentoring</li><li>Prioritize outreach to high school students</li></ul><h5>Cultivating Compassion & Empathy: The Role Model Effect</h5><ul><li>Emphasize soft skills through humanities and reflective sessions</li><li>Foster holistic health understanding via patient journey tracking and narratives</li><li>Affirm faith and Christ-centered role modeling</li><li>Recommend soft skills assessment in internship exams</li></ul><h5>Collaboration Ideas</h5><ul><li>Facilitate high school student engagement in mission hospitals and Christian medical colleges</li></ul><h5>Key Takeaways and Next Steps</h5><ul><li>Recognize evolving academic environments and student attitudes</li><li>Invest in mentorship, as students learn more from seniors than lectures</li><li>Involve churches and families in student engagement programs</li></ul>' } )">
              Read the Summary</a>
          </div>
        </div>

        <!-- Research -->
        <div class="col-12 col-md-6 col-lg-3 m-0 p-0" style="opacity: 0.8;">
          <div class="agenda-card h-100 align-items-center">
            <img
              src="https://s3.amazonaws.com/img.studenthub.in/CMCVConnect_Portal/Pictures/_52bd79b9c0c5f15833211b241f834aa2_Pictures.jpg"
              class="agenda-img" alt="">
            <h4>Research</h4>
            <ol>
              <li>Christian Medical College Vellore - Dr Suceena Alexander</li>
              <li>Christian Medical College, Ludhiana - Dr William Bhatti</li>
              <li>Jubilee Mission Medical College and Research Institute, Thrissur - Dr. Benny Joseph, CEO</li>
            </ol>
            <button class="btn btn-summary pe-4"
              onclick="openModal('infoModal', null, { className: 'bg-primarycolor text-white p-3 rounded fs-md-5', 
              title: 'Overview of Research', data: '  <ul><li>Prioritize socially relevant research topics that address community needs and national impact.</li><li>Balance basic science with public health priorities in research agendas.</li><li>Initiate collaborations early in the proposal process for greater effectiveness.</li><li>Target underexplored research areas to maximize impact.</li><li>Draw inspiration from institutional examples in geriatric care, autism, and leprosy.</li><li>Adopt a comprehensive ten-point action plan:<ol><li>Engage stakeholders,</li><li>Identify problems,</li><li>Assess impact,</li><li>Evaluate resources,</li><li>Develop roadmaps,</li><li>Monitor progress,</li><li>Conduct interim analyses,</li><li>Encourage publication,</li><li>Disseminate results,</li><li>Maintain post-implementation surveillance.</li></ol><li>Emphasize multidisciplinary approaches, such as integrating rehabilitation in research on alcoholic pancreatitis.</li><li>Establish robust research systems (e.g., IRB) to teach ethics and sound methodology from the outset.</li><li>Foster a culture of research integrity and community-driven motivation, moving beyond career advancement.</li><li>Improve student research through: encouraging publication of negative results, ensuring regular supervision, setting realistic targets, and adhering to CONSORT guidelines.</li>' } ) ">
              Read the Summary</a>
          </div>
        </div>

        <!-- Outreach -->
        <div class="col-12 col-md-6 col-lg-3 m-0 p-0" style="opacity: 0.9;">
          <div class="agenda-card h-100 align-items-center">
            <img
              src="https://s3.amazonaws.com/img.studenthub.in/CMCVConnect_Portal/Pictures/_123190f1cce8a26bbad018fb27689c0a_Pictures.jpg"
              class="agenda-img" alt="">
            <h4>Outreach</h4>
            <ol>
              <li>Christian Medical College Vellore: Urban Outreach - Dr Venkatesan S, HOD, Family Medicine</li>
              Rural Outreach - Dr Venkata Raghava, HOD, Community Medicine</li>
              Mission Outreach - Dr Jachin Velavan, Associate Director (Missions)</li>
              <li>St. Johns Medical College, Bangalore - Dr. George D’Souza, Dean</li>
              <li>Believers Church Medical College Hospital, Thiruvalla - Dr. George Chandy, Director</li>
            </ol>
            <button class="btn btn-summary pe-4"
              onclick="openModal('infoModal', null, { className: 'bg-primarycolor text-white p-3 rounded fs-md-5', 
              title: 'Overview of Outreach', data: '<ul><li>Revise the medical curriculum to immerse students in underserved communities from the beginning, fostering responsibility and understanding of community needs.</li><li>Integrate community engagement into education by creating opportunities for students to collaborate with local organizations and learn in real-world community settings.</li><li>Strengthen the Family Adoption Program as mandated by the NMC to deepen student connections with families in need.</li><li>Expand student learning beyond hospitals to include community health centers and clinics in underserved or needy areas through targeted postings.</li><li>Encourage student research on community health issues such as disparities, access to care, and social determinants of health.</li><li>Align community-based educational experiences with the actual health needs and priorities of local populations.</li><li>Promote interdisciplinary collaboration by involving various departments in community outreach and helping students understand broader impacts of illness and treatment.</li><li>Emphasize the teaching of social determinants of health—such as poverty, housing, education, and food security—within the curriculum.</li><li>Highlight the importance of ethical conduct, compassion, and role modeling for students to inspire a genuine commitment to serving communities.</li><li>Discuss ethical considerations such as equity and disparities in healthcare access.</li><li>Facilitate partnerships between medical colleges and mission hospitals by sharing best practices, creating common frameworks, and identifying key contacts.</li><li>Plan collaborative outreach by sharing information well in advance to maximize support and effectiveness.</li><li>Develop model initiatives (e.g., SHP, MMS) to expose students and faculty to mission hospitals, ensuring realistic and relevant training.</li><li>Aim for a socially responsible, community-focused medical education system through ongoing collaboration and innovation.</li></ul>' } )">
              Read the Summary</a>
          </div>
        </div>

      </div>
    </div>
  </section>

  <section class="container-fluid py-5" id="participant" style="background-color: #0d1124;">
    <h2 class="text-center mb-5 fw-bold text-white">Conclave Participants</h2>

    <div class="d-flex justify-content-center mb-3">
      <button id="layoutToggleBtn" class="btn fs-md-5 secondary-bg-color text-white">
        Show Interactive Map
      </button>
    </div>

    <div class="row justify-content-center mb-5 mt-2 me-0">

      <!-- MAP COLUMN -->
      <div id="mapColumn" class="col-12 col-md-8 d-none">
        <div id="conclaveHsptlMap" class="w-100 shadow border rounded-3" style="height: 70vh;">
        </div>
      </div>

      <!-- CARD COLUMN -->
      <div id="cardColumn" class="col-12">
        <div id="hospitalCards" class="row justify-content-center overflow-auto scrollBar-thin">
        </div>
      </div>

    </div>
  </section>

  <section class="way-forward-section" id="wayForward">
    <div class="way-forward-overlay">
      <h3 class="section-title">The Way Forward</h3>

      <div class="way-forward-grid">
        <div class="wf-card card-hover">
          <h5>1. Common Consortium</h5>
          <ol>
            <li>Identify a single point of contact in each Medical College for HR needs.</li>
            <li>To form a common consortium of all Christian Medical Colleges and to explore CCH as a possible body to
              expand its scope of engagement.</li>
          </ol>
        </div>

        <div class="wf-card card-hover">
          <h5>2. Sharing Best Practices</h5>
          <ol>
            <li>Developing a Common Minimum on various verticals – Resources, manpower, Ethics, Values.</li>
            <li>Colleges to exchange experiences and strategies for effective outreach.</li>
            <li>Common Research Journal.</li>
            <li>Research training/educational workshops.</li>
          </ol>
        </div>

        <div class="wf-card card-hover">
          <h5>3. Engaging Students</h5>
          <ol>
            <li>Meeting High School Students and organising Open College Days.</li>
            <li>Engaging students through Mission Hospitals – expand SHP/MMP like programs.</li>
            <li>Facilitate Educational Webinars.</li>
          </ol>
        </div>

        <div class="wf-card card-hover">
          <h5>4. Bettering Patient Care</h5>
          <ol>
            <li>Create channels for referral of patients for Tertiary Care.</li>
            <li>Platform for Centralized Resource Facilitation – Pharmacy, Equipment.</li>
            <li>Establish a Missions Innovation Hub.</li>
          </ol>
        </div>
      </div>
    </div>
  </section>

</div>`;
  },
"secondOpinionModule": function(data) {
    return `<div class="text-center py-5 position-relative" style="background: url('https://s3.amazonaws.com/img.studenthub.in/CMCVConnect_Portal/Pictures/_7159bea2bcba1f2cc85bdb4e92487e7c_Pictures.jpeg') center center / cover no-repeat; height: 420px;">
  <div style="background: rgba(255, 255, 255, 0.675); position: absolute; top: 0; left: 0; width: 100%; height: 100%;"></div>
  <i class="fa-arrow-left fas position-absolute start-0 top-0 m-3 fs-2 pe-pointer" style="z-index: 2;" onclick="renderMissionsPage();"></i>

  <div class="container position-relative" style="z-index: 2; max-width: 1150px;">
    <h1 class="fs-md-3 fw-bold display-4">SECOND-OPINION CONNECT</h1>
    <p class="fs-md-6 fw-medium text-end" style="font-size: larger;">A Provider-to-Provider Teleconsultation program</p>
    <br>
    <br>
    <p class="fw-bold fs-md-5 lead mx-auto" style="max-width: 800px; line-height: 1.8; font-family: math;">
      Welcome to Second-opinion Connect! We are thankful for this opportunity to offer virtual support and guidance through this dedicated platform.
    </p>
    <a class="btn bg-dark text-white fs-md-5 mt-3 shadow" href='https://www.cognitoforms.com/DistanceEducationCMCVellore/SECONDOPINIONCONNECT' target="_blank" style="--bs-btn-font-size: 18px;">Register</a>
  </div>
</div>


<div class="bg-dark text-white text-center py-5">
  <h2 class="fw-bold mb-4">Consultants</h2>
  <div class="container">
    <div class="row justify-content-center gy-4">
      <!-- Card -->
      <div class="col-md-4 col-12">
        <div class="rounded-circle overflow-hidden mx-auto" style="width: 150px; height: 150px;">
          <img src="https://s3.amazonaws.com/img.studenthub.in/CMCVConnect_Portal/Pictures/_a3e8ae805b3772951ac09d3d770abbb9_Pictures.png" alt="Dr Rajshekhar" class="img-fluid h-100 w-100 object-fit-cover">
        </div>
        <h5 class="mt-3 mb-0 fw-bold">Dr Rajshekhar Vedantam</h5>
        <p>Neurosurgery / Neurology</p>
      </div>

      <div class="col-md-4 col-12">
        <div class="rounded-circle overflow-hidden mx-auto" style="width: 150px; height: 150px;">
          <img src="https://s3.amazonaws.com/img.studenthub.in/CMCVConnect_Portal/Pictures/_b9c80142dff7b782c66381fbcbfcd100_Pictures.png" alt="Dr Rupa" class="img-fluid h-100 w-100 object-fit-cover">
        </div>
        <h5 class="mt-3 mb-0 fw-bold">Dr Rupa Vedantam</h5>
        <p>ENT</p>
      </div>

      <div class="col-md-4 col-12">
        <div class="rounded-circle overflow-hidden mx-auto" style="width: 150px; height: 150px;">
          <img src="https://s3.amazonaws.com/img.studenthub.in/CMCVConnect_Portal/Pictures/_3c088b62d9a132b9fc21bbfc24f08b0d_Pictures.png" alt="Dr Antony" class="img-fluid h-100 w-100 object-fit-cover">
        </div>
        <h5 class="mt-3 mb-0 fw-bold">Dr Antony Devasia</h5>
        <p>Urology</p>
      </div>

      <div class="col-md-4 col-12">
        <div class="rounded-circle overflow-hidden mx-auto" style="width: 150px; height: 150px;">
          <img src="https://s3.amazonaws.com/img.studenthub.in/CMCVConnect_Portal/Pictures/_35bb956f48e06776526ae5cfcefb32f4_Pictures.png" alt="Dr OC ABRAHAM " class="img-fluid h-100 w-100 object-fit-cover">
        </div>
        <h5 class="mt-3 mb-0 fw-bold">Dr OC Abraham</h5>
        <p>General Medicine</p>
      </div>

      <div class="col-md-4 col-12">
        <div class="rounded-circle overflow-hidden mx-auto" style="width: 150px; height: 150px;">
          <img src="https://s3.amazonaws.com/img.studenthub.in/CMCVConnect_Portal/Pictures/_f01a1caf2e4a4efd8ca3c9d1d23110eb_Pictures.png" alt="Dr KS JACOB " class="img-fluid h-100 w-100 object-fit-cover">
        </div>
        <h5 class="mt-3 mb-0 fw-bold">Dr KS Jacob</h5>
        <p>Psychiatry</p>
      </div>
    </div>
  </div>
</div>

<!-- SCHEDULE SECTION -->
<div class="bg-body-secondary py-5 text-dark text-center">
  <h2 class="fw-bold mb-4">Our Schedule</h2>
  <div class="container">
    <div class="row row-cols-1 row-cols-md-4 g-4">
      <!-- Monday -->
      <div class="col">
        <div class="border bg-white p-3 h-100 shadow-sm">
          <h4>Monday</h4>
          <hr>
          <p><strong>11 am - 12 pm:</strong> Psychiatry</p>
          <p><strong>2 pm - 3 pm:</strong> Neurosurgery / Neurology</p>
        </div>
      </div>
      <!-- Tuesday -->
      <div class="col">
        <div class="border bg-white p-3 h-100 shadow-sm">
          <h4>Tuesday</h4>
          <hr>
          <p><strong>11 am - 12 pm:</strong> Neurosurgery / Neurology</p>
          <p><strong>3 pm - 4 pm:</strong> General Medicine</p>
        </div>
      </div>
      <!-- Wednesday -->
      <div class="col">
        <div class="border bg-white p-3 h-100 shadow-sm">
          <h4>Wednesday</h4>
          <hr>
          <p><strong>2 pm - 3 pm:</strong> Urology</p>
        </div>
      </div>
      <!-- Thursday -->
      <div class="col">
        <div class="border bg-white p-3 h-100 shadow-sm">
          <h4>Thursday</h4>
          <hr>
          <p><strong>11 am - 12 pm:</strong> Psychiatry</p>
          <p><strong>2 pm - 3 pm:</strong> ENT</p>
        </div>
      </div>
    </div>
  </div>
</div>
<!-- HOW IT WORKS SECTION -->
<div class="bg-dark-subtle py-5 text-center">
  <h2 class="fw-bold mb-5">How does this work?</h2>

  <div class="container" style="max-width: 1500px;">
<div class="d-flex flex-column flex-md-row align-items-center justify-content-center gap-4">

      <!-- Step 1 -->
      <div class="step-wrapper d-flex flex-column align-items-center">
        <div class="step-box p-4 bg-white shadow rounded text-dark text-center">
          <h5 class="fw-bold">Patient Assessment</h5>
          <p class="mt-3 p-3" style="border: solid 1px; border-radius: 15px;">The physician at the spoke evaluates a patient who may require specialized consultation.</p>
        </div>

        <!-- Mobile Arrow -->
        <div class="d-flex d-md-none">
          <i class="fas fa-arrow-down fs-3 my-2"></i>
        </div>
      </div>

      <!-- Desktop Arrow -->
      <div class="d-none d-md-flex align-items-center justify-content-center">
        <i class="fas fa-arrow-right fs-2 mx-3"></i>
      </div>

      <!-- Step 2 -->
      <div class="step-wrapper d-flex flex-column align-items-center">
        <div class="step-box p-4 bg-white shadow rounded text-dark text-center">
          <h5 class="fw-bold">Teleconsultation</h5>
          <p class="mt-3 p-3" style="border: solid 1px; border-radius: 15px;">Please complete an e-request form to consult with any specialist you'd like to connect with.</p>
        </div>

        <!-- Mobile Arrow -->
        <div class="d-flex d-md-none">
          <i class="fas fa-arrow-down fs-3 my-2"></i>
        </div>
      </div>

      <!-- Desktop Arrow -->
      <div class="d-none d-md-flex align-items-center justify-content-center">
        <i class="fas fa-arrow-right fs-2 mx-3"></i>
      </div>

      <!-- Step 3 -->
      <div class="step-wrapper d-flex flex-column align-items-center">
        <div class="step-box p-4 bg-white shadow rounded text-dark text-center">
          <h5 class="fw-bold">Expert Advice</h5>
          <p class="mt-3 p-3" style="border: solid 1px; border-radius: 15px;">Once confirmed, the consultant offers advice, diagnoses, and guidance on treatment or tests.</p>
        </div>

        <!-- Mobile Arrow -->
        <div class="d-flex d-md-none">
          <i class="fas fa-arrow-down fs-3 my-2"></i>
        </div>
      </div>

      <!-- Desktop Arrow -->
      <div class="d-none d-md-flex align-items-center justify-content-center">
        <i class="fas fa-arrow-right fs-2 mx-3"></i>
      </div>

      <!-- Step 4 -->
      <div class="step-wrapper d-flex flex-column align-items-center">
        <div class="step-box p-4 bg-white shadow rounded text-dark text-center">
          <h5 class="fw-bold">Implementation</h5>
          <p class="mt-3 p-3" style="border: solid 1px; border-radius: 15px;">The physician at the spoke implements the recommended advice into the patient's care plan.</p>
        </div>
      </div>

    </div>
  </div>
</div>
`;
  },
"researchGrant": function(data) {
    return `<div class="container-fluid position-relative bg-white py-4">
    <h2 class="text-center bg-white p-3 rounded msnHospTitle connect-primary-border"> Grants</h2>
    <i class="bg-opacity-10 fa-arrow-left fas rounded position-absolute start-0 fs-2 top-0 m-3"
        onclick="navigateTo('research', {}, ['loadResearchCards', []]);"></i>

    <div class="row mt-4">

        <!-- Grant Awardee Panel -->
        <div class="col-md-6 mb-4">
            <div class="card shadow rounded-3 h-100">
                <div class="card-header text-center text-black">
                    <h4 class="mb-0">Awardee</h4>
                </div>
                <div class="card-body" style="min-height: 400px; font-family: math;">
                    <div class="row mb-3 justify-content-between">
                        <div class="col-md-4">
                            <input type="text" id="awardeeSearch" class="form-control border border-black p-1"
                                placeholder="Search by Name, Department">
                        </div>
                        <div class="col-md-2">
                            <select id="awardeeYearFilter" class="form-select">
                                <option value="">All Years</option>
                            </select>
                        </div>
                    </div>
                    <div id="grantsAwardeeList" class="overflow-x-hidden scrollBar-thin" style="max-height: 620px;">
                    </div>
                </div>
            </div>
        </div>

        <!-- Grants Panel -->
        <div class="col-md-6 mb-4">
            <div class="Grant-card-3 position-relative">
                <div class="position-relative align-items-end d-flex shadow rounded-3"
                    onclick="openModal('grantsList', '', 'Grants List' ); loadGrantsListTable();"
                    style="height: 370px;">
                    <div class="px-2 pb-3">
                        <h4 class="fs-md-1 ms-3" style="font-size: xxx-large;"></h4>
                    </div>
                </div>

            </div>
        </div>
    </div>
</div>`;
  },
"grandRounds": function(data) {
    return `<div class="bg-white position-relative">

  <i class="fa fa-arrow-left position-absolute start-0 top-0 m-3 fs-2 text-white" style="cursor: pointer; z-index: 10;"
    onclick="${data.backTo}">
  </i>
  <div class="text-center py-5 mb-4"
    style="background: url('https://s3.amazonaws.com/img.studenthub.in/CMCVConnect_Portal/Pictures/_2269f308e1a93aea5d3eb315fd52cb07_Pictures.jpg') center center / cover no-repeat; border-bottom: 1px solid #dee2e6;">
    <div class="container pb-5">
      <h3 class="display-6 fw-bold text-dark mb-3">Welcome to Grand Rounds!</h3>
      <div class="mx-auto mb-5 px-4" style="max-width: 700px;">
        <p class="lead fw-normal fs-md-5 pb-3">A webinar series by senior clinicians, addressing key clinical topics
          relevant to practitioners in peripheral hospital settings.
        </p>
      </div>
    </div>
  </div>
  <div class="container-fluid mt-2">

    <div class="row g-4">

      <div class="col-lg-4 col-md-6 col-12">
        <h4 class="text-center mb-3">Ongoing Grand Rounds</h4>
        <div id="ongoingGrandRounds" class="border rounded p-3 shadow-sm bg-white"></div>
      </div>

      <div class="col-lg-5 col-md-12 col-12">
        <h4 class="text-center mb-3">Schedule</h4>

        <div class="table-responsive shadow-sm rounded bg-white p-3 border">
          <table id="grandRoundsTable" class="table table-striped border w-100"></table>
        </div>
      </div>

      <div class="col-lg-3 col-md-6 col-12">
        <div class="align-items-center mb-3">
          <h4 class="text-center mb-0"> Recent Videos</h4>
          <button class="btn btn-sm btn-primary" style="position: absolute; right: 1%;"
            onclick="navigateTo('grandRoundsVideos', {}, ['loadGrandRoundsVideos', []]);">
            All Videos
          </button>
        </div>

        <div id="grandRoundsVideos" class="overflow-auto border rounded p-2 shadow-sm mt-5" style="max-height: 800px;">
        </div>
      </div>

    </div>

  </div>
</div>`;
  },
"publications": function(data) {
    return `
<div class="bg-white">
    <div class="position-relative">
        <!-- <h2 class="text-center bg-white p-3 rounded msnHospTitle connect-primary-border">Publications</h2> -->
                              <i class="bg-opacity-10 fa-arrow-left fas rounded position-absolute start-0 top-0 m-3 fs-2 pe-pointer" style="z-index: 2;"
    onclick="renderPostHomePage();"></i>
    </div>
    <div class="overflow-auto px-3 text-center">

    <section class="publications-section">

        <div class="container">

            <div class="section-title">
                <h1>Publications</h1>
            </div>

            <div class="publication-grid">

                <!-- Publication 1 -->
                <div class="publication-card">

                    <div class="publication-title">
                        Current Medical Issues
                    </div>

                    <div class="publication-divider"></div>

                    <div class="publication-image">
                        <img src="https://s3.amazonaws.com/img.studenthub.in/CMCVConnect_Portal/Pictures/_df1c1f905aaef2cdaa87610a9f823637_Pictures.jpg" alt="Current Medical Issues">
                    </div>

                    <div class="publication-footer">
                        <a href="https://journals.lww.com/cmii/pages/default.aspx"
                           target="_blank"
                           class="read-link"
                           title="Open Publication">
                            <span class="arrow">→</span>
                        </a>
                    </div>

                </div>

                <!-- Publication 2 -->
                <div class="publication-card">

                    <div class="publication-title">
                        Pushpagiri Medical Journal
                    </div>

                    <div class="publication-divider"></div>

                    <div class="publication-image">
                        <img src="https://s3.amazonaws.com/img.studenthub.in/CMCVConnect_Portal/Pictures/_f12521345b5b72df713332d43c1500d3_Pictures.jpg" alt="Pushpagiri Medical Journal">
                    </div>

                    <div class="publication-footer">
                        <a href="https://www.pmedjournal.com/journalDetails/PMJ"
                           target="_blank"
                           class="read-link"
                           title="Open Publication">
                            <span class="arrow">→</span>
                        </a>
                    </div>

                </div>

                <!-- Publication 3 -->
                <div class="publication-card">

                    <div class="publication-title">
                        Indian Journal of Continuing Nursing Education (IJCNE)
                    </div>

                    <div class="publication-divider"></div>

                    <div class="publication-image">
                        <img src="https://s3.amazonaws.com/img.studenthub.in/CMCVConnect_Portal/Pictures/_2523ab3419c8a7e6b759bdb4dca79045_Pictures.jpg" alt="IJCNE">
                    </div>

                    <div class="publication-footer">
                        <a href="https://journals.lww.com/ijcn/pages/default.aspx"
                           target="_blank"
                           class="read-link"
                           title="Open Publication">
                            <span class="arrow">→</span>
                        </a>
                    </div>

                </div>

                <!-- Publication 4 -->
                <div class="publication-card">

                    <div class="publication-title">
                        CHRISMED Journal of Health and Research
                    </div>

                    <div class="publication-divider"></div>

                    <div class="publication-image">
                        <img src="https://s3.amazonaws.com/img.studenthub.in/CMCVConnect_Portal/Pictures/_08a5dfe550540a75b5a82b4af9e5c5a5_Pictures.jpg" alt="CHRISMED Journal">
                    </div>

                    <div class="publication-footer">
                        <a href="https://journals.lww.com/chri/pages/default.aspx"
                           target="_blank"
                           class="read-link"
                           title="Open Publication">
                            <span class="arrow">→</span>
                        </a>
                    </div>

                </div>

                <!-- Publication 5 -->
                <div class="publication-card">

                    <div class="publication-title">
                        Journal of Current Research in Scientific Medicine (JCRSM)
                    </div>

                    <div class="publication-divider"></div>

                    <div class="publication-image">
                        <img src="https://s3.amazonaws.com/img.studenthub.in/CMCVConnect_Portal/Pictures/_462d03175b18f78e9032abd061ee7205_Pictures.jpg" alt="JCRSM">
                    </div>

                    <div class="publication-footer">
                        <a href="https://journals.lww.com/jcsm/pages/default.aspx"
                           target="_blank"
                           class="read-link"
                           title="Open Publication">
                            <span class="arrow">→</span>
                        </a>
                    </div>

                </div>

                <!-- Publication 6 -->
                <div class="publication-card">

                    <div class="publication-title">
                        Muller Journal of Medical Sciences and Research
                    </div>

                    <div class="publication-divider"></div>

                    <div class="publication-image">
                        <img src="https://s3.amazonaws.com/img.studenthub.in/CMCVConnect_Portal/Pictures/_54e8e193775892c45d94c71e1d959bcd_Pictures.jpg" alt="Muller Journal">
                    </div>

                    <div class="publication-footer">
                        <a href="https://journals.lww.com/mjmr/pages/default.aspx"
                           target="_blank"
                           class="read-link"
                           title="Open Publication">
                            <span class="arrow">→</span>
                        </a>
                    </div>

                </div>

                <!-- Publication 7 -->
                <div class="publication-card">

                    <div class="publication-title">
                        Journal of Advanced Health Research & Clinical Medicine
                    </div>

                    <div class="publication-divider"></div>

                    <div class="publication-image">
                        <img src="https://s3.amazonaws.com/img.studenthub.in/CMCVConnect_Portal/Pictures/_aa16b33301780b36be8803b07b9f03bb_Pictures.jpg" alt="Advanced Health Research">
                    </div>

                    <div class="publication-footer">
                        <a href="https://journals.lww.com/hrcm/pages/default.aspx"
                           target="_blank"
                           class="read-link"
                           title="Open Publication">
                            <span class="arrow">→</span>
                        </a>
                    </div>

                </div>

            </div>

        </div>

    </section>

</div>
</div>`;
  },
"mmService": function(data) {
    return `<div class="container-fluid py-4 px-0" style="background:#e7dfd4;">
    <h2 class="text-center p-3 rounded connect-primary-border fs-md-1" style="font-size: 50px;
            margin: 0; background-image: url('https://s3.amazonaws.com/img.studenthub.in/CMCVConnect_Portal/Pictures/_23e47d08d1a6ff0dfb5f9b54189d735a_Pictures.jpg'); background-repeat: no-repeat;
            background-size: cover; background-position: center; color: transparent;
            background-clip: text; -webkit-background-clip: text; font-family: fantasy;">
        Mandatory Missions Service </h2>

    <section id="aboutMms">

        <div class="d-flex justify-content-end mb-4" style="position: relative; right: 10%;">
            <button class="btn btn-dark rounded-pill px-4 fs-md-5"
                onclick="document.querySelector('#faq-section').scrollIntoView({ behavior: 'smooth' });">
                FAQ
            </button>
        </div>
        <div class="container">
            <div class="row align-items-center">

                <div class="col-6 col-md-3 text-center mb-4 mb-md-0 mx-auto">
                    <img src="https://s3.amazonaws.com/img.studenthub.in/CMCVConnect_Portal/Pictures/_05342fdcf032ad476b022c764cdde6d3_Pictures.jpg"
                        class="img-fluid rounded shadow" style="max-height: 400px; width: 100%; object-fit: cover;"
                        alt="Service Image 1" />
                </div>

                <div class="col-12 col-md-6 px-lg-5">
                    <p class="fw-bold text-center"
                        style="font-size: clamp(0.9rem, 2.5vw, 1.1rem); line-height: 1.6; color: #ada05d;">
                        The Christian Medical College, Vellore is governed by the Christian Medical College Vellore
                        Association—representing over 50 diverse Indian churches and organizations. With more than
                        164 hospitals in our network, many serve as lifelines for rural communities in need.
                    </p>

                    <p class="mt-3"
                        style="font-size: clamp(0.85rem, 2vw, 1rem); line-height: 1.5; color: #6f5f40; text-align: justify;">
                        Our institution stands as a powerful symbol of hope and healing. At the heart of our mission is
                        our commitment to nurture compassionate healthcare professionals devoted to serving others in
                        the spirit of Christ. To ensure our faculty are equipped to tackle the pressing healthcare
                        challenges faced by our nation, and to immerse themselves in the invaluable resources and
                        practices found within our mission hospitals, those seeking confirmation or promotion to
                        professorship are encouraged to dedicate at least two weeks of service within this vital
                        network. This transformative experience is not just a requirement but a profound opportunity for
                        growth, ensuring our faculty remain deeply connected to our mission and the communities we serve
                        with unwavering dedication.
                    </p>
                </div>

                <div class="col-6 col-md-3 text-center mt-4 mt-md-0 mx-auto">
                    <img src="https://s3.amazonaws.com/img.studenthub.in/CMCVConnect_Portal/Pictures/_cb590cfd47ad18cbff24c74a6c16b14f_Pictures.jpg"
                        class="img-fluid rounded shadow" style="max-height: 400px; width: 100%; object-fit: cover;"
                        alt="Service Image 2" />
                </div>

            </div>
        </div>
    </section>

    <div class="container-fluid mb-5" style="background:#e7dfd4;">
        <div class="container">
            <div id="mmsApprovedPanel">
            </div>
        </div>
    </div>
    <h5 class="container fw-bold text-center mb-2">
        "Greatness begins where comfort ends"
    </h5>
    <p class="container text-center mb-5">
        Will you go to a state where only a few have gone and make a
        difference?
    </p>
    <div class="container text-center mb-5">
        <canvas id="mmsUsersChart" style="width:100%;max-width:100%; height: 400px; max-height:100%"></canvas>
    </div>

    <h3 class="text-center mb-5">Mission Hospital Visit Approval & Logistics Flow​</h3>
    <div class="flow-container mb-5">

        <!-- STEP 1 -->
        <div class="flow-step">
            <div class="step-number">
                <div class="step-circle">1</div>
            </div>
            <div class="step-card">
                <div class="step-header">
                    <h3>Planning and Selection</h3>
                    <span><i class="fa-solid fa-angle-down"></i></span>
                </div>
                <div class="step-content">
                    <ul>
                        <li><strong>Obtain Initial Permission:</strong> Secure authorization from the Head of
                            Department/Unit (HOD/HOU) to pursue the visit.​</li>
                        <li><strong>Identify Eligible Hospitals :</strong> Use the interactive map provided below to
                            view the
                            list of eligible Mission Hospitals for MMS.</li>
                        <li><strong>Consult and Choose Hospital:</strong> Select a Mission Hospital with guidance from
                            the Missions Office. The team responds to queries within 1 week. </li>
                        <li><strong>Contact the Hospital Administrator:</strong> Connect with the Mission Hospital
                            administrator to confirm scheduling and coordinate visit logistics.</li>
                    </ul>
                </div>
            </div>
        </div>

        <!-- STEP 2 -->
        <div class="flow-step">
            <div class="step-number">
                <div class="step-circle">2</div>
            </div>
            <div class="step-card">
                <div class="step-header">
                    <h3>Application and Approval</h3>
                    <span><i class="fa-solid fa-angle-down"></i></span>
                </div>
                <div class="step-content">
                    <ul>
                        <li><strong>Submit Application Form:</strong> Fill out and submit the official Application form
                            on the portal, after assessing the needs of the hospital, to make the best use of your
                            visit.</li>
                        <li><strong>Application Review & Decision:</strong> The Missions Office will approve/reject the
                            application within a week.</li>
                        <li><strong>Monitor Application Status:</strong> Monitor the application status in the portal
                            for updates.</li>
                    </ul>
                </div>
            </div>
        </div>

        <!-- STEP 3 -->
        <div class="flow-step">
            <div class="step-number">
                <div class="step-circle">3</div>
            </div>
            <div class="step-card">
                <div class="step-header">
                    <h3>Upcoming Visit Preparation</h3>
                    <span><i class="fa-solid fa-angle-down"></i></span>
                </div>
                <div class="step-content">
                    <ul>
                        <li><strong>Apply for Deputation Leave:</strong> Upon receiving the Missions Office approval
                            email, request deputation leave from the Associate Director (Medical)</li>
                        <li><strong> Issuing of Indemnity Certificate </strong> The MS Office will issue the Indemnity
                            Certificate.</li>
                        <li><strong>Final Visit Notification:</strong> The Missions Office will email you, your HOD, and
                            the Mission Hospital confirming the approved visit.</li>
                    </ul>
                </div>
            </div>
        </div>

        <!-- STEP 4 -->
        <div class="flow-step">
            <div class="step-number">
                <div class="step-circle">4</div>
            </div>
            <div class="step-card">
                <div class="step-header">
                    <h3>Visit and Post-Visit Report</h3>
                    <span><i class="fa-solid fa-angle-down"></i></span>
                </div>
                <div class="step-content">
                    <ul>
                        <li><strong>Hospital Information:</strong> Please collect information about the hospital that
                            may be useful for others who are visiting the same hospital.</li>
                        <li><strong>Update Visit Details:</strong> Please ensure that you update your visit details in
                            the form to record your visit for confirmation/promotion purposes.</li>
                        <li><strong>Incorporate Insights:</strong> Use information from these visits into teaching and
                            research to give future medical professionals a country-wide healthcare perspective.</li>
                    </ul>
                </div>
            </div>
        </div>

    </div>


    <div class="container-fluid py-md-5 mb-5" style="background:#0f101c;">
        <div class="row justify-content-center mx-0 g-4">

            <div class="col-md-2 p-4 p-md-0">
                <h5 class="mb-4 text-center text-tan">
                    <div class="deptName"></div>
                </h5>
                <div id="preMmsVisits"></div>
            </div>

            <div class="col-md-6 text-white text-center px-md-5">
                <h2 class="m-0 text-tan userName" style="font-family: 'Playfair Display', serif;"></h2>
                <p class="mt-3" style="line-height:1.6; font-size: 18px;">
                    If this is your first time applying for MMS, kindly go through the "Mission Hospital Visit Approval
                    and Logistics Flow" outlined above before clicking here to submit your application.
                </p>
                <div class="text-center my-4">
                    <button class="btn px-4 py-2 fw-medium secondary-bg-color text-white"
                        onclick="openModal('formIO', null, ''); loadMmsApplication();">Apply Here</button>
                    <div id="draftMsg"></div>
                </div>
                <div id="userMmsVisits" class="row justify-content-center"></div>
            </div>

            <div class="col-md-2 text-center">
                <h5 class="text-tan">Other Visits<br><small> (Within The Past Three Years)</small></h5>
                <p class="border p-2 bg-light rounded" style="line-height: 1.6;"> Please submit supporting documentation
                    for any Mission Hospital visits (camps, SHPs, or departmental activities) to be considered for
                    Mandatory Mission Service.</p>
                <button class="btn text-white secondary-bg-color fw-medium"
                    onclick="openModal('formIO', null, 'Application'); loadMmsOtherVisitApp();">Enter Other
                    Visit Details</button>

            </div>

        </div>
    </div>

    <div class="row justify-content-center g-4 mb-5 me-0">

        <div class="col-12 text-center">
            <h2>Mission Network Hospital</h2>
            <p class="text-center" style="font-weight: 500; line-height: 2;">
                Explore our interactive map and discover inspiring opportunities where your department's services are
                needed.
            </p>
        </div>

        <div class="col-12 col-md-8">
            <div id="msnHsptlMap" class="w-100 shadow border rounded-3" style="height: 70vh;"></div>
        </div>

        <div class="col-12 col-md-3">
            <div id="hospitalCards" class="w-100 overflow-auto rounded-3 p-2"
                style="max-height: 70vh; scrollbar-width: thin;">
            </div>
        </div>
    </div>

    <section class="faq-section" id="faq-section">
        <div class="container">
            <h2 class="faq-title">Some Frequently Asked Questions</h2>


            <div class="d-flex justify-content-end mb-4">
                <button class="btn btn-dark rounded-pill px-4 py-2 fs-md-5"
                    onclick="document.querySelector('#aboutMms').scrollIntoView({ behavior: 'smooth' });">
                    Back to Top
                </button>
            </div>

            <div class="row g-4">
                <div class="col-md-6 col-lg-4">
                    <div class="faq-card h-100">
                        <div class="faq-number">1</div>
                        <h5 class="fw-bold">How would I benefit?</h5>
                        <ul>
                            <li>You will receive an orientation to the country's healthcare needs.</li>
                            <li>You will learn to work in a resource-limited facility.</li>
                            <li>You will also learn healthcare practices in mission hospitals.</li>
                        </ul>
                    </div>
                </div>

                <div class="col-md-6 col-lg-4">
                    <div class="faq-card h-100">
                        <div class="faq-number">2</div>
                        <h5 class="fw-bold">When is it mandatory?</h5>
                        <ul>
                            <li>When you are due for confirmation.</li>
                            <li>When you are due for promotion to professorship.</li>
                            <li>Those completing their service obligation can finish the MMS with HOD consultation
                                during their service obligation period before confirmation.</li>
                        </ul>
                    </div>
                </div>

                <div class="col-md-6 col-lg-4">
                    <div class="faq-card h-100">
                        <div class="faq-number">3</div>
                        <h5 class="fw-bold">How many days should I go?</h5>
                        <ul>
                            <li>You should preferably go for a single visit of 2 weeks.</li>
                            <li>Or two visits of one week each.</li>
                            <li>Visit to mission hospitals undertaken within three years prior to confirmation and
                                promotion can also be considered. (See FAQ 10)</li>
                        </ul>
                    </div>
                </div>

                <div class="col-md-6 col-lg-4">
                    <div class="faq-card h-100">
                        <div class="faq-number">4</div>
                        <h5 class="fw-bold">How can it be done?</h5>
                        <ul>
                            <li>Accompanying medical students on a Secondary Hospital Program (SHP).</li>
                            <li>If the SHP duration is less than two weeks, the remaining duration needs to be
                                compensated by staying back in the MH for the required number of days post SHP or by
                                going for another SHP, or by visiting a Mission Hospital later.
                            </li>
                            <li>If you are not interested in going for SHP, you can directly apply for a service posting
                                in the application above based on the hospital's needs.</li>
                        </ul>
                    </div>
                </div>

                <div class="col-md-6 col-lg-4">
                    <div class="faq-card h-100">
                        <div class="faq-number">5</div>
                        <h5 class="fw-bold">Choosing a Hospital</h5>
                        <ul>
                            <li>MHs in areas of need and/or those that have requested HR may be highlighted in the list.
                            </li>
                            <li>Please note that mission hospitals in capital cities in South India / those located near
                                CMC, are excluded from this list, as the broad objective of MMP is for the faculty to
                                understand the health and socio-economic dynamics of various regions in our country.
                            </li>
                        </ul>
                    </div>
                </div>

                <div class="col-md-6 col-lg-4">
                    <div class="faq-card h-100">
                        <div class="faq-number">6</div>
                        <h5 class="fw-bold">Pre-clinical and Para-Clinical Departments</h5>
                        <ul>
                            <li>Pre-clinical and para-clinical department faculty should preferably go to centers with
                                teaching needs, as many Mission Hospitals run Nursing and Allied Health courses.</li>
                            <li> Para-clinical faculty may visit MHs for:
                                - Lab upgradation
                                - Staff training (based on MH’s existing needs and facilities)</li>
                            <li> Accompanying students for SHP also counts</li>
                        </ul>
                    </div>
                </div>

                <div class="col-md-6 col-lg-4">
                    <div class="faq-card h-100">
                        <div class="faq-number">7</div>
                        <h5 class="fw-bold">Subspecialty</h5>
                        <ul>
                            <li>If there aren’t enough hospitals with the subspecialty, a Mission Hospital with the
                                respective broad specialty may be chosen. </li>
                        </ul>
                    </div>
                </div>

                <div class="col-md-6 col-lg-4">
                    <div class="faq-card h-100">
                        <div class="faq-number">8</div>
                        <h5 class="fw-bold">Travel</h5>
                        <ul>
                            <li>Travel as per eligibility. </li>
                            <li>If air travel is inevitable, taxi travel (at institutional rates) from residence to the
                                nearest
                                airport may be claimed.</li>
                        </ul>
                    </div>
                </div>

                <div class="col-md-6 col-lg-4">
                    <div class="faq-card h-100">
                        <div class="faq-number">9</div>
                        <h5 class="fw-bold">Food</h5>
                        <ul>
                            <li>Faculty can enroll in the campus mess/food service, with charges reimbursed upon bill
                                submission.</li>
                            <li>If on-campus food isn't available, Z-city rates will apply to all faculty.</li>
                        </ul>
                    </div>
                </div>

                <div class="col-md-6 col-lg-4">
                    <div class="faq-card h-100">
                        <div class="faq-number">10</div>
                        <h5 class="fw-bold">Previous Mission Hospital camps/visits</h5>
                        <ul>
                            <li>Service in camps and activities organized by your department at a mission hospital can
                                count toward your MMS credits. (those which happened within the last 3 years).</li>
                            <li>However, you must spend at least 7 of the required 14 days working directly at a mission
                                hospital.</li>
                            <li>If you have participated in such work, you must submit a report detailing your
                                contributions and visit dates, signed by the HOD or HOU.</li>
                        </ul>
                    </div>
                </div>

                <div class="col-md-6 col-lg-4">
                    <div class="faq-card h-100">
                        <div class="faq-number">11</div>
                        <h5 class="fw-bold">Spouse and Children</h5>
                        <ul>
                            <li>Spouses and Children are welcome to join, but please inform the mission hospital in
                                advance for arrangements.</li>
                            <li>If the spouse is a clinician or healthcare worker, they can discuss their involvement
                                with the hospital.</li>
                            <li>Expenses for children and the spouse (if not visiting for MMP or at the hospital's
                                request) are the faculty's responsibility.</li>
                        </ul>
                    </div>
                </div>

                <div class="col-md-6 col-lg-4">
                    <div class="faq-card h-100">
                        <div class="faq-number">12</div>
                        <h5 class="fw-bold">Hospitals in the MMS list</h5>
                        <ul>
                            <li>Mission Hospitals in CMC’s network that have requested specialty assistance or have
                                potential for service delivery and educational activities are listed.</li>
                            <li>To maintain equitable faculty distribution, the list is updated periodically,
                                temporarily removing hospitals that have been previously visited until others are
                                visited.</li>
                        </ul>
                    </div>
                </div>

                <div class="col-md-6 col-lg-4">
                    <div class="faq-card h-100">
                        <div class="faq-number">13</div>
                        <h5 class="fw-bold">Accommodation</h5>
                        <ul>
                            <li>Faculty members are encouraged to stay on campus at the mission hospital when possible.
                                Some hospitals may provide free accommodation.
                                If there is a charge, faculty must submit the actual bill for reimbursement.</li>
                            <li>If on-campus accommodation is not available, the hospital will arrange off-campus
                                housing. Reimbursement will
                                follow Z-city rates for all eligible faculty members, requiring submission of the actual
                                bill.</li>
                        </ul>
                    </div>
                </div>

                <div class="col-md-6 col-lg-4">
                    <div class="faq-card h-100">
                        <div class="faq-number">14</div>
                        <h5 class="fw-bold">Communicating your visit to the hospital</h5>
                        <ul>
                            <li>While official correspondence from CMC communicates the dates and details of the faculty
                                visiting the mission hospital, to ensure optimal logistics, the faculty should contact
                                the Mission hospital's nodal person prior to the visit.</li>
                        </ul>
                    </div>
                </div>

                <div class="col-md-6 col-lg-4">
                    <div class="faq-card h-100">
                        <div class="faq-number">15</div>
                        <h5 class="fw-bold">What about leave?</h5>
                        <ul>
                            <li>Deputation leave can be used for visits, including travel days.</li>
                            <li>However, travel days are excluded from MMS, but Sundays within the service period can be
                                counted.</li>
                            <li>Annual leave can cover any remaining days if there aren’t enough deputation leaves.</li>
                        </ul>
                    </div>
                </div>

                <div class="col-md-6 col-lg-4">
                    <div class="faq-card h-100">
                        <div class="faq-number">16</div>
                        <h5 class="fw-bold">What about Expenses?</h5>
                        <ul>
                            <li>Expenses will be met from the respective department's special fund.</li>
                            <li>For SHP, travel expenses will be reimbursed according to SHP guidelines informed by the
                                principal’s office.</li>
                        </ul>
                    </div>
                </div>

                <div class="col-md-6 col-lg-4">
                    <div class="faq-card h-100">
                        <div class="faq-number">17</div>
                        <h5 class="fw-bold">Completion Report from Mission Hospital</h5>
                        <ul>
                            <li>The Mission Hospital is to provide the Missions department with a certificate of
                                completion for your posting, detailing the work done by you during MMS and the dates of
                                your visit.</li>
                        </ul>
                    </div>
                </div>

                <div class="col-md-6 col-lg-4">
                    <div class="faq-card h-100">
                        <div class="faq-number">18</div>
                        <h5 class="fw-bold">Updating Visit details on returning</h5>
                        <ul>
                            <li>Please update your visit on the portal with details of clinical/teaching/training work
                                undertaken by you during the posting, observations about healthcare practices at the MH,
                                and suggestions for changes.</li>
                            <li>Possible collaborations between your department and the MH in the future, as well as any
                                other relevant input, may also be included.</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </section>

</div>`;
  },
"shiloh": function(data) {
    return `<div class="bg-white position-relative min-vh-100">
  <i class="fa-arrow-left fas text-white position-absolute start-0 top-0 m-3 fs-2 pe-pointer" style="z-index: 2;"
    onclick="renderPostHomePage();"></i>

  <div class="shiloh-container">
    <section class="image-verse-section position-relative overflow-hidden">
      <!-- Background video -->
      <video autoplay muted loop playsinline class="banner-video">
        <source
          src="https://s3.amazonaws.com/img.studenthub.in/CMCVConnect_Portal/Pictures/_22fbf2fc49b3707a7fe2467919b872e7_Pictures.mp4"
          type="video/mp4">
      </video>

      <!-- Center title -->
      <div class="banner-center d-flex justify-content-center align-items-center text-center">
        <h1 class="quote-font display-3 fw-bold text-white">Shiloh</h1>
      </div>

      <!-- Bottom verse with wavy background -->
      <div class="verse-bottom text-center text-white">
        <p class="quote-font fst-italic fs-4 mb-0">
          "Then the whole congregation of the people of Israel assembled at Shiloh and set up the tent of meeting
          there."
        </p>
        <p class="quote-font fw-bold fs-5 mb-0">Joshua 18:1</p>
      </div>
    </section>




    <section class="bg-light py-5 px-3">
      <div class="container text-center">
        <div class="mx-auto bg-secondary mb-4" style="width: 60px; height: 3px;"></div>

        <div class="row g-3 justify-content-center">
          <!-- Row 1 -->
          <div class="col-12 col-sm-5 col-md-4">
            <img
              src="https://s3.amazonaws.com/img.studenthub.in/CMCVConnect_Portal/Pictures/_da4e8e8a3406ae932e577a0382bdf0b3_Pictures.jpg"
              class="img-fluid rounded shadow-sm" alt="Gallery Image 1">
          </div>
          <div class="col-12 col-sm-5 col-md-4">
            <img
              src="https://s3.amazonaws.com/img.studenthub.in/CMCVConnect_Portal/Pictures/_0ec91c693cfaf5f4c2beb0e74881ce54_Pictures.jpg"
              class="img-fluid rounded shadow-sm" alt="Gallery Image 2">
          </div>
          <div class="col-12 col-sm-5 col-md-4">
            <img
              src="https://s3.amazonaws.com/img.studenthub.in/CMCVConnect_Portal/Pictures/_c3edbe4caafd3306909f5eafe396a5d8_Pictures.jpg"
              class="img-fluid rounded shadow-sm" alt="Gallery Image 3">
          </div>

          <!-- Row 2 -->
          <div class="col-12 col-sm-5 col-md-4">
            <img
              src="https://s3.amazonaws.com/img.studenthub.in/CMCVConnect_Portal/Pictures/_a2371ed8244f1bb355520e17ee5bc165_Pictures.jpg"
              class="img-fluid rounded shadow-sm" alt="Gallery Image 4">
          </div>
          <div class="col-12 col-sm-5 col-md-4">
            <img
              src="https://s3.amazonaws.com/img.studenthub.in/CMCVConnect_Portal/Pictures/_7d61fc503077e2b9637bf607fa979606_Pictures.jpg"
              class="img-fluid rounded shadow-sm" alt="Gallery Image 5">
          </div>
          <div class="col-12 col-sm-5 col-md-4">
            <img
              src="https://s3.amazonaws.com/img.studenthub.in/CMCVConnect_Portal/Pictures/_f018b78709f8c32b7fcdab0908347119_Pictures.jpg"
              class="img-fluid rounded shadow-sm" alt="Gallery Image 6">
          </div>
        </div>
      </div>
    </section>


    <section class="py-5 position-relative d-flex align-items-center text-white overflow-hidden"
      style="min-height: 60vh;">
      <div class="position-absolute top-0 start-0 w-100 h-100"
        style="background-image: url('https://s3.amazonaws.com/img.studenthub.in/CMCVConnect_Portal/Pictures/_23e47d08d1a6ff0dfb5f9b54189d735a_Pictures.jpg'); background-size: cover; background-position: center; z-index: 0;">
        <div class="position-absolute w-100 h-100 bg-black opacity-50" style="z-index: 1;"></div>
      </div>

      <div class="container position-relative p-4 text-end" style="z-index: 2;">
        <h2 class="display-4 fw-semibold mb-4 text-white quote-font text-center">Shiloh</h2>
        <p class="mb-3 fs-5 text-start mx-md-5" style="white-space: pre-line;">
          Shiloh is a movement that seeks to nurture young students spiritually and develop leaders in the healing
          ministry of Christ.

          It is a forum where students can gain insight into Christian healthcare work within the country and abroad.

          Every year, nearly 1000 students (medical, dental, nursing, and paramedical) attend this conference from
          various medical colleges and institutions in India.

          Would you like to know more about Shiloh and see how you can be a part of us?
        </p>
        <button class="btn btn-outline-light btn-lg px-lg-5 py-lg-3 rounded-pill" style="left: 75%;"
          onclick="window.open('https://shilohcmc.org/', '_blank')">
          Read More...
        </button>
      </div>
    </section>

    <section class="banner-section" style="height: 50vh;">
      <video autoplay muted loop playsinline class="banner-video">
        <source
          src="https://s3.amazonaws.com/img.studenthub.in/CMCVConnect_Portal/Pictures/_df32442a8aef6d1b80928cc871b1c655_Pictures.mp4"
          type="video/mp4">
      </video>
      <div class="banner-overlay">
        <h1 class="quote-font display-3">Listen to some of our speakers</h1>
        <p class="mt-2 fs-6">From the Plenary sessions of Shiloh 2025</p>
      </div>
    </section>


    <section class="speakers-section">

      <div class="row g-0 overflow-hidden " style="background-color: #183A40">

        <div
          class="col-12 col-md-4 text-white p-4 d-flex flex-column align-items-center justify-content-center order-2 order-lg-1">
          <h3 class="quote-font fs-1 fw-light mb-3">Dr. Sedevi Angami</h3>
          <p class="fs-2 fw-bold mb-2">Morning Plenary</p>
          <p class="mb-1 fs-4">Day 1: <a href="https://www.youtube.com/live/0wsUFx7xhGY?si=evz_lIMBJatRp3By"
              class="text-white" target="_blank">Session 1</a></p>
          <p class="mb-1 fs-4">Day 2: <a href="https://www.youtube.com/live/I2nGyAAJN1Q?si=PIzT-0UtOle1gojl"
              class="text-white" target="_blank">Session 2</a></p>
          <p class="mb-1 fs-4">Day 3: <a href="https://www.youtube.com/live/p2w9mItwyMQ?si=enLzGCsqQhcBAkA6"
              class="text-white" target="_blank">Session 3</a></p>
        </div>

        <div
          class="col-12 col-md-4 bg-dark d-flex py-md-5 align-items-center justify-content-center p-3 order-1 order-lg-2">
          <img
            src="https://s3.amazonaws.com/img.studenthub.in/CMCVConnect_Portal/Pictures/_dc28034102efd353bf35394621e97e75_Pictures.png"
            alt="Dr. Sedevi Angami" class="img-fluid rounded shadow-sm" style="max-height: 400px; object-fit: cover;">
        </div>

        <div class="col-12 col-md-4 text-white p-4 d-flex align-items-center order-3 order-lg-3">
          <p class="fs-5 lh-base m-0" style="font-family: math;">
            Dr. Sedevi Angami is the Director of the Christian Institute of Health Sciences and Research (CIHSR) in
            Dimapur, Nagaland. He has earned a DM in Gastroenterology from the Christian Medical College and holds
            additional degrees in Bioethics and Hospital Management. He is passionate about coaching, encouraging, and
            enabling people to be creative and productive, reaching their full potential.
          </p>
        </div>
      </div>


      <div class="row g-0 overflow-hidden" style="background-color: #21010F;">

        <div
          class="col-12 col-md-4 text-white p-4 d-flex flex-column align-items-center justify-content-center order-2 order-lg-1">
          <h3 class="quote-font fs-1 fw-light mb-3">Dr. Prabhu Singh</h3>
          <p class="fs-2 fw-bold mb-2">Evening Plenary</p>
          <p class="mb-1 fs-4"> Day 1: <a href="https://www.youtube.com/live/jDghz2LP308?si=BLBWlk5-GHRMHwkG"
              class="text-white" target="_blank">Session 1</a></p>
          <p class="mb-1 fs-4">Day 2: <a href="https://www.youtube.com/live/Y_Km48uYG7g?si=C8n7QmGzoJsKfwub"
              class="text-white" target="_blank">Session 2</a></p>
          <p class="mb-1 fs-4">Day 3: <a href="https://www.youtube.com/live/aGiw4JeatJQ?si=G04_QKqksgp-vXuF"
              class="text-white" target="_blank">Session 3</a></p>
        </div>


        <div
          class="col-12 col-md-4 d-flex bg-dark py-md-5 align-items-center justify-content-center p-3 order-1 order-lg-2">
          <img
            src="https://s3.amazonaws.com/img.studenthub.in/CMCVConnect_Portal/Pictures/_875fe734c0b6deb2400a073e10a19145_Pictures.jpg"
            alt="Dr. Prabhu Singh" class="img-fluid rounded shadow-sm" style="max-height: 400px; object-fit: cover;">
        </div>

        <div class="col-12 col-md-4 text-white p-4 d-flex align-items-center order-3 order-lg-3">
          <p class="fs-5 lh-base m-0" style="font-family: math;">
            Dr. Prabhu Singh is a missiological anthropologist with a PhD in Intercultural Studies from Asbury Seminary,
            Kentucky. With over 30 years of ministry experience, he has worked with organizations like the Union of
            Evangelical Students of India and Ambassadors for Christ. He is a global speaker and currently focuses on
            mission mobilization and developing next-generation leaders through various initiatives.
          </p>
        </div>
      </div>

    </section>
  </div>
</div>`;
  },
"preMmsVisits": function(data) {
    return `<div class="bg-white">
  <div class="position-relative">
    <h2 class="text-center bg-white p-3 rounded msnHospTitle connect-primary-border">Previous Visits</h2>
    <i class="bg-opacity-10 fa-arrow-left fas rounded position-absolute start-0 top-0 m-3 fs-2 pe-pointer"onclick="navigateTo('mmService', {}, ['loadMmServicePage'])"></i>
  </div>

        <div class="overflow-auto p-3 ">
        <table id="preMmsVisitTable" class="display mb-3" width="100%"></table>
      </div>
  <div class="text-end px-3">Please write to us: <a href="mailto:missionsoffice@cmcvellore.ac.in">missionsoffice@cmcvellore.ac.in</a><br>Or call: +91 416 228 6117</div>


</div>
`;
  },
"grandRoundsVideos": function(data) {
    return `<div class="container-fluid bg-white position-relative">
    <h2 class="text-center bg-white p-3 rounded msnHospTitle connect-primary-border">Grand Rounds Videos</h2>
    <i class="bg-opacity-10 fa-arrow-left fas rounded position-absolute start-0 top-0 m-3 fs-2"
        onclick="navigateTo('grandRounds', {}, [['loadGrandRoundsTable', []], ['loadGrandRoundsVideos', [10]]]);
"></i>
    <div class="row mt-5">
        <div class="grand-rounds-container">
            <input type="text" id="grandRoundsSearch" placeholder="Search Grand Rounds by title, person, or tags..."
                style="width:100%; padding:10px; margin-bottom:15px; border:1px solid #ccc; border-radius:6px;">
            <div id="grandRoundsVideos" class="d-flex flex-wrap"></div>
        </div>
    </div>
</div>`;
  },
"networkConslt": function(data) {
    return `<!-- <div class="bg-white h-100 d-flex align-items-center justify-content-center">
  <h3 class="text-center connect-text-darkblue">Coming Soon</h3> -->

<nav class="navbar navbar-expand-lg nc-topbar px-3">

  <div class="container-fluid">
 
    <div class="d-flex align-items-center gap-3">
 
      <i class="fas fa-arrow-left fs-5 pe-pointer text-white" onclick="renderMissionsPage();"></i>
 
      <h5 class="mb-0 text-white fw-semibold">
        Network Consults
      </h5>
 
    </div>
 
    <button class="navbar-toggler border-0 shadow-none" type="button" data-bs-toggle="collapse"
      data-bs-target="#ncNavbar">
 
      <i class="fas fa-bars text-white"></i>
 
    </button>
 
    <div class="collapse navbar-collapse justify-content-end" id="ncNavbar">
 
      <div class="navbar-nav gap-lg-2 mt-3 mt-lg-0">
 
        <button class="nav-btn active" data-page="introPage">
          <i class="fa-solid fa-home"></i>
        </button>
 
        <button class="nav-btn" data-page="themesPage">
          Themes
        </button>
 
        <button class="nav-btn d-none" data-page="requestPage">
          Request
        </button>
 
        <button class="nav-btn d-none" data-page="consultPage">
          Consult
        </button>
 
        <button class="nav-btn d-none" data-page="nodalPage">
          Nodal
        </button>
 
      </div>
 
    </div>
 
  </div>
 
</nav>
 
<main class="nc-content">
  <div id="netConsltMainContainer" class="container-fluid"
    style="background-image: url(https://s3.amazonaws.com/img.studenthub.in/CMCVConnect_Portal/Pictures/_46dd2439429f103ec36ef124712f5240_Pictures.png); background-size: cover; background-position: center; z-index: 0;">
 
    <div id="introPage" class="content-page active-page">
      <h2>Welcome <span id="ncUserName" class="text-primary"></span> to Network Consults</h2>
      <p>This initiative provides an opportunity for our network doctors to engage directly
        with specialists at CMC to seek expert opinions on patient treatment and care.
      </p>
      <div class="mt-3" id="registrationTrigger">
        <p>We invite you to register to begin participating in this collaborative consultation process.</p>
        <button class="btn btn-primary px-4"
          onclick="openModal('formIO', null, ''); loadNetConsltRegForm()">Register</button>
      </div>



<div class="nc-dash d-none" id="ncDashboard">
 
  <div class="nc-dash-hero d-none">
    <div>
      <span class="nc-dash-kicker">Network Consults</span>
      <h5 class="nc-dash-title">Programme at a Glance</h5>
      <p class="nc-dash-sub">Live summary of consults, questions and registrations</p>
    </div>
    <button type="button" class="nc-dash-refresh" onclick="loadNcDashboard(true)">
      <i class="fas fa-rotate-right"></i> Refresh
    </button>
  </div>
 
  <!-- ---------- KPI tiles ---------- -->
  <div class="nc-kpi-row">
 
    <div class="nc-kpi-card accent-navy is-clickable" role="button" tabindex="0"
      onclick="ncShowDetail('cases')">
      <div class="kpi-top">
        <span class="kpi-label">Total patient cases</span>
        <span class="kpi-icon"><i class="fa-solid fa-notes-medical"></i></span>
      </div>
      <div class="kpi-value is-loading" id="ncKpiTotalCases">&mdash;</div>
      <div class="kpi-foot" id="ncKpiTotalCasesFoot">&nbsp;</div>
    </div>
 
    <div class="nc-kpi-card accent-amber is-clickable" role="button" tabindex="0"
      onclick="ncShowDetail('openQuestions')">
      <div class="kpi-top">
        <span class="kpi-label">Open questions</span>
        <span class="kpi-icon"><i class="fa-solid fa-comments"></i></span>
      </div>
      <div class="kpi-value is-loading" id="ncKpiOpenQueries">&mdash;</div>
      <div class="kpi-foot" id="ncKpiOpenQueriesFoot">&nbsp;</div>
    </div>
 
    <div class="nc-kpi-card accent-blue">
      <div class="kpi-top">
        <span class="kpi-label">Avg. response time</span>
        <span class="kpi-icon"><i class="fa-solid fa-stopwatch"></i></span>
      </div>
      <div class="kpi-value is-loading" id="ncKpiResponse">&mdash;</div>
      <div class="kpi-foot" id="ncKpiResponseFoot">&nbsp;</div>
    </div>
 
    <div class="nc-kpi-card accent-teal is-clickable d-none" role="button" tabindex="0"
      onclick="ncShowDetail('consultants')">
      <div class="kpi-top">
        <span class="kpi-label">Consultants</span>
        <span class="kpi-icon"><i class="fa-solid fa-user-doctor"></i></span>
      </div>
      <div class="kpi-value is-loading" id="ncKpiConsultants">&mdash;</div>
      <div class="kpi-foot" id="ncKpiConsultantsFoot">&nbsp;</div>
    </div>
 
    <div class="nc-kpi-card accent-gold is-clickable" role="button" tabindex="0"
      onclick="ncShowDetail('themes')">
      <div class="kpi-top">
        <span class="kpi-label">Consult themes</span>
        <span class="kpi-icon"><i class="fa-solid fa-layer-group"></i></span>
      </div>
      <div class="kpi-value is-loading" id="ncKpiThemes">&mdash;</div>
      <div class="kpi-foot" id="ncKpiThemesFoot">&nbsp;</div>
    </div>
 
    <div class="nc-kpi-card accent-orange is-clickable" role="button" tabindex="0"
      onclick="ncShowDetail('monthCases')">
      <div class="kpi-top">
        <span class="kpi-label">Cases this month</span>
        <span class="kpi-icon"><i class="fa-solid fa-calendar-check"></i></span>
      </div>
      <div class="kpi-value is-loading" id="ncKpiMonthCases">&mdash;</div>
      <div class="kpi-foot" id="ncKpiMonthCasesFoot">&nbsp;</div>
    </div>
 
  </div>
 
  <!-- ---------- charts row ---------- -->
  <div class="row g-3" hidden="hidden">
 
    <div class="col-lg-7">
      <div class="nc-panel h-100 accent-blue">
        <div class="nc-panel-head">
          <h6>Consults by Theme</h6>
          <span class="nc-panel-meta" id="ncThemeChartMeta"></span>
        </div>
        <div class="nc-panel-body">
          <div class="nc-bars" id="ncThemeChart">
            <div class="nc-empty">Loading&hellip;</div>
          </div>
        </div>
      </div>
    </div>
 
    <div class="col-lg-5">
 
      <div class="nc-panel mb-3 accent-navy">
        <div class="nc-panel-head">
          <h6>Patient Case Status</h6>
          <span class="nc-panel-meta" id="ncCaseStatusMeta"></span>
        </div>
        <div class="nc-panel-body">
          <div class="nc-status-bar" id="ncCaseStatusBar"></div>
          <div class="nc-legend" id="ncCaseStatusLegend">
            <div class="nc-empty">Loading&hellip;</div>
          </div>
        </div>
      </div>
 
      <div class="nc-panel accent-teal">
        <div class="nc-panel-head">
          <h6>Registration Applications</h6>
          <span class="nc-panel-meta" id="ncAppStatusMeta"></span>
        </div>
        <div class="nc-panel-body">
          <div class="nc-status-bar" id="ncAppStatusBar"></div>
          <div class="nc-legend" id="ncAppStatusLegend">
            <div class="nc-empty">Loading&hellip;</div>
          </div>
        </div>
      </div>
 
    </div>
  </div>
 
  <!-- ---------- activity + actions ---------- -->
  <div class="row g-3 mt-0">
 
    <div class="col-lg-7">
      <div class="nc-panel h-100 accent-gold">
        <div class="nc-panel-head">
          <h6>Recent Activity</h6>
          <span class="nc-panel-meta">Newest first</span>
        </div>
        <div class="nc-panel-body">
          <div class="nc-activity" id="ncActivityFeed">
            <div class="nc-empty">Loading&hellip;</div>
          </div>
        </div>
      </div>
    </div>
 
    <div class="col-lg-5 d-none">
      <div class="nc-panel h-100 accent-orange">
        <div class="nc-panel-head">
          <h6>Quick Actions</h6>
        </div>
        <div class="nc-panel-body">
          <div class="nc-quick">
            <button type="button" class="nc-quick-btn is-primary" onclick="ncNewPatient()">
              <i class="fa-solid fa-plus"></i> Enter New Patient
            </button>
            <button type="button" class="nc-quick-btn" onclick="ncGoToPage('requestPage')">
              <i class="fa-solid fa-list-check"></i> My Patient Requests
            </button>
            <button type="button" class="nc-quick-btn" onclick="ncGoToPage('themesPage')">
              <i class="fa-solid fa-layer-group"></i> Browse Themes
            </button>
            <button type="button" class="nc-quick-btn" id="ncQuickRegister"
              onclick="openModal('formIO', null, ''); loadNetConsltRegForm()">
              <i class="fa-solid fa-user-plus"></i> Register as Consultant
            </button>
          </div>
        </div>
      </div>
    </div>
 
  </div>
 
 
  <!-- ---------- detail popup (opened by the KPI tiles) ----------
       Self-contained Bootstrap modal. It does not use openModal() or
       views/modal.html, so no other screen is affected. -->
  <div class="modal fade nc-detail-modal" id="ncDetailModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
      <div class="modal-content">
 
        <div class="modal-header">
          <div>
            <h5 class="modal-title" id="ncDetailTitle">Details</h5>
            <p class="nc-detail-sub" id="ncDetailSub"></p>
          </div>
          <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
 
        <div class="modal-body">
          <div class="nc-detail-tools">
            <div class="nc-detail-search">
              <i class="fa-solid fa-magnifying-glass"></i>
              <input type="text" id="ncDetailSearch" placeholder="Search these rows"
                oninput="ncFilterDetail(this.value)">
            </div>
            <span class="nc-detail-count" id="ncDetailCount"></span>
          </div>
 
          <div class="nc-detail-scroll scrollBar-thin">
            <table class="table nc-detail-table">
              <thead id="ncDetailHead"></thead>
              <tbody id="ncDetailBody"></tbody>
            </table>
          </div>
        </div>
 
      </div>
    </div>
  </div>
 
</div>
    </div>

    <div id="themesPage" class="content-page d-none">
      <div id="ncThemesList"></div>
 
    </div>
 
    <div id="requestPage" class="content-page d-none">
      <h3 class="fw-semibold mb-3 bg-nc text-white rounded-3 text-center p-2">My Patient Requests</h3>
      <div class="row g-3">
        <div class="col-md-8">
          <div class="overflow-auto p-1 scrollBar-thin">
            <table id="ncPatientReqtable" class="table table-hover border custom-styled-table"></table>
          </div>
        </div>
        <div class="col-md-4">
          <div class="card">
            <div class="card-header bg-nc text-white rounded-top">
              <h5 class="text-center">Patient Summary</h5>
            </div>
            <div class="card-body">
              <div class="border border-black rounded-3 p-2 mb-2">
                <h6 class="fw-bold text-center">Demographics</h6>
                <p>Name: <strong id="ncPatientName"></strong></p>
                <p>Age: <strong id="ncPatientAge"></strong></p>
                <p>Place: <strong id="ncPatientPlace"></strong></p>
                <p>Start date: <strong id="ncPatientStartDate"></strong></p>
                <p>Last seen date: <strong id="ncPatientLastSeenDate"></strong></p>
              </div>
              <div class="border border-black rounded-3 p-2 mb-2">
                <h6 class="fw-bold text-center">History</h6>
                <span id="ncPatientHistory"></span>
              </div>
              <div class="border border-black rounded-3 p-2 mb-2">
                <h6 class="fw-bold text-center">Investigations</h6>
                <span id="ncPatientInvestigations"></span>
              </div>
              <div class="border border-black rounded-3 p-2 mb-2">
                <h6 class="fw-bold text-center">Plan</h6>
                <span id="ncPatientPlan"></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
 
    <div id="consultPage" class="content-page d-none">
      <h3 class="fw-semibold mb-3 bg-nc text-white rounded-3 text-center p-2" id="ncDepartmentName"></h3>
      <div class="row overflow-auto p-3 bg-body-secondary rounded scrollBar-thin mb-3">
        <div id="myApprovedPatient"></div>
      </div>
      <div class="bg-white overflow-auto p-3 scrollBar-thin rounded">
        <table id="ncMyDeptConsltTable" class="table table-hover border"></table>
      </div>
    </div>
 
    <div id="nodalPage" class="content-page d-none">
      <h3 class="fw-semibold mb-3 bg-nc text-white rounded-3 text-center p-2">Nodal Overview</h3>
      <div class="row overflow-auto p-3 bg-body-secondary rounded scrollBar-thin mb-3">
        <div id="newPatientReq"></div>
      </div>
      <div class="bg-white overflow-auto p-3 scrollBar-thin rounded">
        <table id="ncNodalsListTable" class="table table-hover"></table>
      </div>
    </div>
  </div>

</main>

`;
  },
"msnEngagement": function(data) {
    return `<div class="bg-white" style="text-align: justify;">
    <section class="section text-center py-5">
        <div class="container">
            <h2>Mission Engagement</h2>
            <p class="mt-4">
                Christian Medical College (CMC) Vellore, being a quaternary-level teaching hospital - providing the
                highest quality of patient care and medical training, also has a deep ethos of serving marginalized
                communities across India. This commitment is carried forward through its Mission Hospitals
                Network—encompassing over 170 mission hospitals that operate primarily in remote or resource-limited
                regions where access to quality healthcare is scarce.​​
            </p>

            <div class="row mt-5 g-4 align-items-stretch">
                <div class="col-lg-5">
                    <div class="dark-box rounded-3" style="text-align: justify;">
                        <p>

                            Mission Engagement encompasses various programs designed by CMC to foster collaborative
                            engagements that enable faculty from the Institution to engage with various mission
                            hospitals. Currently, there are 3 broad programs that involve engagements at the department
                            level as well as at the individual faculty level.
                        </p>
                        <ul>
                            <li>Mandatory Mission Service</li>
                            <li>Missions Sabbatical</li>
                            <li>Mission Hospital Visits</li>
                        </ul>
                    </div>
                </div>

                <div class="col-lg-7 ms-auto">
                    <div class="folded-rectangle align-content-center bg-body-secondary mx-auto">
                        <p class="px-md-5 fs-md-5">
                            The Missions Department coordinates these engagements and has facilitated hundreds of
                            deputations to mission hospitals for clinical and operational support, enabling staff from
                            CMC to contribute across a wide spectrum of healthcare disciplines.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- ================= Mandatory Mission Service ================= -->
    <section class="section bg-light py-5">
        <div class="container">
            <h3 class="text-center mb-4">Mandatory Mission Service</h3>

            <div class="row g-4 align-items-center">
                <div class="col-lg-6">
                    <img src="https://s3.amazonaws.com/img.studenthub.in/CMCVConnect_Portal/Pictures/_ad7b8fbd975e61bc645281d17768ff4a_Pictures.jpg" class="img-fluid rounded" alt="">
                </div>

                <div class="col-lg-6">
                    <p>
                        The Mandatory Mission Service is part of a Faculty Engagement Program with Mission Hospitals and
                        is designed for medical faculty to have an orientation to healthcare needs in the country,
                        resources available and healthcare practice in mission hospitals.
                        All medical faculty (preclinical, paraclinical and clinical) are required to spend 14 days in
                        select mission hospitals twice during their career period; once before confirmation and later
                        before promotion to Professor level.
                    </p>

                    <div class="row g-3 mt-3">
                        <div class="col-md-6">
                            <div class="info-card">Broadens faculty exposure to regional disease patterns and care
                                practices.</div>
                        </div>
                        <div class="col-md-6">
                            <div class="info-card">Complements academic and clinical relevance.</div>
                        </div>
                        <div class="col-md-6">
                            <div class="info-card">Provide hands-on care to underserved populations.</div>
                        </div>
                        <div class="col-md-6">
                            <div class="info-card">Strengthens mission hospitals through shared expertise.</div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="text-end pt-2">
            <button class="btn btn-dark" onclick="navigateTo('mmService', ' ', ['loadMmServicePage']);">Read More</button>
            </div>
        </div>
    </section>

    <!-- ================= Mission Sabbatical ================= -->
    <section class="section py-5">
        <div class="container">
            <h3 class="text-center mb-4">Mission Sabbatical</h3>

            <div class="row g-4 align-items-center">
                <div class="col-lg-6">
                    <p>
                        The Mission Sabbatical—is a structured opportunity for senior faculty take short sabbatical
                        leave of 6 months in a mission hospital. This is to enable faculty and staff to decentralize and
                        develop education, service, research by adopting relevant mission hospitals for a short period
                        and also to mentor young graduates and postgraduates posted for service commitment. It gives
                        opportunity to contribute significantly to healthcare delivery in areas with pressing needs by
                        offering clinical expertise, teaching, mentorship, and leadership support to these centres.
                    </p>

                    <div class="row g-3 mt-3">
                        <div class="col-md-6">
                            <div class="info-card">Faculty on mission sabbatical continue receiving their full CMC
                                salary and benefits, as per institutional sabbatical policies.</div>
                        </div>
                        <div class="col-md-6">
                            <div class="info-card">Complements academic and clinical relevance.</div>
                        </div>
                        <div class="col-md-6">
                            <div class="info-card">Travel and accommodation support are provided by respective mission
                                hospitals.</div>
                        </div>
                        <div class="col-md-6">
                            <div class="info-card">The mission sabbatical does not entail an additional service
                                obligation.</div>
                        </div>
                    </div>
                </div>

                <div class="col-lg-6">
                    <img src="https://s3.amazonaws.com/img.studenthub.in/CMCVConnect_Portal/Pictures/_178631d73e4f9176a2f119c1c647fd4a_Pictures.jpg" class="img-fluid rounded" alt="">
                </div>
            </div>
            <div class="text-end">
            <button class="btn btn-dark mt-2" onclick="navigateTo('msnSabbatical', ' ', ['loadMsnSabbaticalPage']);">Read More</button>
            </div>
        </div>
    </section>

    <!-- ================= Mission Hospital Visits ================= -->
    <section class="section bg-light py-5">
        <div class="container">
            <h3 class="text-center mb-4">Mission Hospital Visits</h3>

            <div class="row g-4 align-items-center">
                <div class="col-lg-6">
                    <img src="https://s3.amazonaws.com/img.studenthub.in/CMCVConnect_Portal/Pictures/_233057fc8e3efde9b7935a4d806ac84b_Pictures.jpg" class="img-fluid rounded" alt="">
                </div>

                <div class="col-lg-6">
                    <p>
                        Mission hospital visits, either as part of Secondary Hospital Posting or Short deputations, are
                        a key way to engage with mission hospitals and rural healthcare settings. These short-term or
                        periodic visits serve several purposes.
                    </p>

                    <div class="row g-3 mt-3">
                        <div class="col-md-6">
                            <div class="info-card"><strong>Clinical & Non-Clinical Support</strong><br>
                                Faculty provide direct patient care or developing systems in mission hospitals, filling
                                gaps in specialist services and supporting local teams.</div>
                        </div>
                        <div class="col-md-6">
                            <div class="info-card"><strong>Training and Mentorship</strong><br>
                                Through on-site teaching, case discussions, and skills transfer, CMC faculty help build
                                the clinical and operational capacity of mission hospital staff.</div>
                        </div>
                        <div class="col-md-12">
                            <div class="info-card"><strong>Assessment and Collaboration</strong><br>
                                Faculty also visit to assess the healthcare needs of mission hospitals and suggest
                                operational improvements, governance models, and training opportunities.</div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="text-end pt-2">
                <button class="btn btn-dark" onclick="navigateTo('missionVisits', ' ', ['loadMissionVisitsPage']);">Read More</button>
            </div>
        </div>
    </section>
    <!-- ================= Quote ================= -->
    <section class="quote-section py-5">
        <div class="container">
            <div class="shadow rounded bg-dark text-white">

                <div id="stepsCarousel" class="carousel slide" data-bs-ride="carousel">
                    <div class="carousel-inner">

                        <!-- Quote 1 -->
                        <div class="carousel-item active">
                            <div class="p-4 p-md-5 text-center">
                                <blockquote class="quote-text">
                                    Although I have very little experience in intensive care unit and trauma care, I
                                    must say that God equipped me in my training place (Department of Family Medicine, CMC Vellore) to
                                    manage the serious and critically ill patients. During my stay in this hospital, I
                                    experienced a spiritual renewal, grew closer to God, and began to cling to Him at every moment in
                                    my work place. I must say that every day I felt abundant Grace and Mercy showered upon me
                                    from above in managing diverse patient conditions! By the grace of God, I was able to
                                    assist and pray for patients in distress (first time I did in my life time) and saw multiple
                                    successful recoveries.
                                </blockquote>

                                <div class="quote-author mt-4">
                                    <strong>Dr. Bino Rajamani J</strong><br>
                                    MBBS, DCH, MD, DNB (Family Medicine)<br>
                                    <span>
                                        Makunda Christian Leprosy and General Hospital<br>
                                        16th March 2025 – 27th March 2025
                                    </span>
                                </div>
                            </div>
                        </div>

                        <!-- Quote 2 -->
                        <div class="carousel-item">
                            <div class="p-4 p-md-5 text-center">
                                <blockquote class="quote-text">
                                    This hospital has been serving the people of Trichy district from the year 1910 and
                                    functions under the CSI Trichy Tanjore Diocese. During my time there, I helped organize a
                                    Daycare chemotherapy administration area at this institution, as they do get patients
                                    referred from CMC, Vellore from the departments of Medical Oncology and Paediatric Haematology
                                    Oncology for their continuation chemotherapy sessions. However, as there was no
                                    laminar flow, NABH had not given them approval for administering chemotherapy. I liased with
                                    the laminar flow agents and organized CSR funding for purchase of the same. I have also
                                    compiled detailed instructions for administration of chemotherapy including
                                    checklists, monitoring sheets and drug loading instructions for individual drugs.
                                </blockquote>

                                <div class="quote-author mt-4">
                                    <strong>Dr. Leenu Joseph</strong><br>
                                    <span>
                                        CSI Mission General Hospital, Trichy<br>
                                        5th – 19th May 2025
                                    </span>
                                </div>
                            </div>
                        </div>

                    </div>

                    <!-- Controls -->
                    <button class="carousel-control-prev" type="button" data-bs-target="#stepsCarousel"
                        data-bs-slide="prev">
                        <span class="carousel-control-prev-icon"></span>
                    </button>

                    <button class="carousel-control-next" type="button" data-bs-target="#stepsCarousel"
                        data-bs-slide="next">
                        <span class="carousel-control-next-icon"></span>
                    </button>

                </div>
            </div>
        </div>
    </section>

</div>`;
  },
"missionVisits": function(data) {
    return `<div class="bg-white">
  <section class="py-5">

    <div class="container-fluid">

      <h1 class="text-center mb-4" style="color: #4A90E2;">MISSION VISITS</h1>

      <div class="row align-items-center">

        <div class="col-lg-3 text-center mb-4 mb-lg-0">
          <img
            src="https://s3.amazonaws.com/img.studenthub.in/CMCVConnect_Portal/Pictures/_d1fe56fb804b4009edba0347eaba41e1_Pictures.png"
            width="250">
        </div>

        <div class="col-lg-5 text-center">

          <p class="mission-text">
            Our mission hospital network comprises approximately 200 hospitals operated by
            various church missions, spread across the country. These vital healthcare
            facilities are strategically located in rural areas, serving communities that
            would otherwise lack access to affordable and reliable medical care.
          </p>

        </div>

        <div class="col-lg-4 text-center mt-4 mt-lg-0">

          <div class="notebook-wrapper">

            <img
              src="https://s3.amazonaws.com/img.studenthub.in/CMCVConnect_Portal/Pictures/_7c4c460251059b826e31f20e978777f1_Pictures.webp"
              class="img-fluid book-img">

            <div class="notebook-content">

              <div class="notebook-left">
                <h4 class="text-center">Dear</h4>
                <h4 class="userName"></h4>
              </div>

              <div class="notebook-right">
                <p>
                  If you have visited any mission hospital,
                  please share your experiences here..
                </p>

                <button class="upload-link"
                  onclick="openModal('formIO', null, 'Mission Visit'), loadMsnVisitForm()">Upload your Visit ➤</button>
              </div>

            </div>

          </div>

        </div>

      </div>

    </div>

  </section>


  <h1 class="text-center help-title mb-5">HOW CAN YOU HELP?</h1>

  <section class="help-section">

    <div class="container">

      <div class="row g-4">

        <div class="col-md-4">

          <div class="help-card">

            <h5 class="text-primary fw-bold">
              Clinical And Nonclinical Support
            </h5>

            <img
              src="https://s3.amazonaws.com/img.studenthub.in/CMCVConnect_Portal/Pictures/_58faedc1072724e71fc03082b2a0e595_Pictures.jpeg">

            <p>
              You can provide direct patient care or develop systems in mission hospitals,
              filling gaps in specialist services and supporting local teams.
            </p>

            <button class="read-btn p-1 px-4"
              onclick="openModal('infoModal', null, { className: 'p-3 rounded fs-md-5', 
              title: 'Sofia Madhavan’s service in the Nuba Mountains', endText: 'Robert Nyakaana.<br>Administrator-Mother of Mercy Hospital<br>Nuba Mountains', 
              imgUrl: 'https://s3.amazonaws.com/img.studenthub.in/CMCVConnect_Portal/Pictures/_b6c7fdbca91ebdc732fab4fc134956e4_Pictures.jpeg\ ',
              data: '<p>Ms. Sofia Madhavan was able to impart theoretical and practical skills to the local staff, Kanadi Ibrahim and Challu Abdalla, in the department of Orthotics. These had just returned from 6-Months of training in Uganda by the long-term Orthopaedic Doctors who annually visit the hospital twice to attend to patients. It was an opportunity for the two local staff to continue gaining hands-on skills and They laboured to establish a unit, the first of its kind in the Nuba Mountains. Whereas a few consumables had been procured in Uganda as startup supplies, Sofia carried with her: 10 pcs Crutch tips. 2 pcs of surfoms,10 pcs long screws and 1 pc drill bat. By the time she left, the two staff could do</p><ul><li>Scratches from local bamboo sticks</li><li>Hand splints from PVC</li><li>Gateer from linen.</li></ul> <p>Over the duration of her stay, Sofia, along with our prosthetists were able to serve numerous patients who travelled grea t distances to receive care at our hospital. It has been such a blessing to our staff to be trained under Sofia and collaborate on innovative ways to provide care with the limited resources at hand. Due to the ongoing security situation, there has been an increase in war-related injuries, with many patients sustaining amputations and living with mobility issues. Additionally, there is a high volume of patients within our population who need orthotic and prosthetic care due to infectious and cancer-related pathologies. In many ways, the assistance through prosthesis and orthotic care is regarded as a second chance for many of our patients who are already living on the margins. We are so grateful for the service and specialty that Sofia brought to our hospital, extending the excellence in health care that CMC Vellore is well known for,  here to those who are suffering in Sudan. Given her expertise, she has provided a structural design/layout of a typical Orthopaedic Unit. We are yet to finalize the construction of the block. We shall follow her guidance </p>' } )">
              Read More</button>

          </div>

        </div>

        <div class="col-md-4">

          <div class="help-card">

            <h5 class="text-primary fw-bold">
              Training and Mentorship
            </h5>

            <img
              src="https://s3.amazonaws.com/img.studenthub.in/CMCVConnect_Portal/Pictures/_14a1c14332cf624061c185b0bda9d919_Pictures.webp">

            <p>
              Through on-site teaching, case discussions, and skills transfer, faculty help
              build the clinical and operational capacity of mission hospital staff.
            </p>

            <button class="read-btn p-1 px-4"
              onclick="openModal('infoModal', null, { className: 'p-3 rounded fs-md-5', 
              title: 'An Ode to helping hands', endText: 'Dr. Augustine', 
              imgUrl: 'https://s3.amazonaws.com/img.studenthub.in/CMCVConnect_Portal/Pictures/_4076f0a858d5328902fbbcf2edc0e4f0_Pictures.png',
              data: '<p>Mrs. S, a 70-year-old woman, arrived at the Christian Fellowship Hospital after experiencing giddiness that had led to a fall. Evaluation revealed Complete heart block, and she was advised to undergo permanent pacemaker implantation at a higher centre.</p> <p>Unfortunately, the cost of the device was far beyond her means, and the prospect of seeking care elsewhere felt overwhelming.For the next seven months, she continued to visit CFH with a quiet hope, trusting that somehow help might come her way.</p> <p>That hope found an answer when Dr. John offered to visit and coordinate the procedure. Under his guidance and expertise, the cardiology team at CFH successfully implanted a permanent pacemaker. The procedure was carried out free of cost through the government insurance scheme, ensuring that financial limitations would not stand in the way of life-saving care.</p> <p>Deeply moved and grateful, Mrs. S expressed her heartfelt thanks to the hospital team and her prayers of gratitude to God for the gift of renewed life. Her journey stands as a testament to perseverance, compassion, and the power of timely medical care.</p>' } )">
              Read More
            </button>

          </div>

        </div>

        <div class="col-md-4">

          <div class="help-card">

            <h5 class="text-primary fw-bold">
              Assessment and Collaboration
            </h5>

            <img
              src="https://s3.amazonaws.com/img.studenthub.in/CMCVConnect_Portal/Pictures/_a267e4e529290491eb146c0f25fc5293_Pictures.jpg">

            <p>
              Faculty also visit to assess the healthcare needs of mission hospitals and
              suggest operational improvements, governance models, and training opportunities.
            </p>

            <button class="read-btn p-1 px-4"
              onclick="openModal('infoModal', null, { className: 'p-3 rounded fs-md-5', 
              title: 'Mission Hospital Requests for Assistance with Buildings', 
              imgUrl: 'https://s3.amazonaws.com/img.studenthub.in/CMCVConnect_Portal/Pictures/_b3202e04f4e0788d803520365dbf51fa_Pictures.jpg',
              data: '<p>A comprehensive checklist prepared by Dr.Vijayanand Ismavel with his personal experience and expertise.</p>' } )">
              Read More</button>

          </div>

        </div>


      </div>
    </div>
  </section>

  <div class="container py-4">

    <h1 class="fw-bold py-3 text-center" style="color: #4A90E2;">Are you interested?</h1>
    <h5 class="text-center">Some of our mission hospitals have placed their needs for the following personnel..</h5>
    <div id="msnVisitManPowerTableContainer">
      <div class="d-flex justify-content-end my-3">
        <button id="mapToggle" class="btn btn-primary me-2">Map View</button>
        <button id="layoutToggle" class="btn btn-outline-primary">
          Switch to Table </button>
      </div>

      <div id="tableView" class="table-responsive" style="display:none;">
        <table id="msnVisitManPowerTable" class="table table-hover align-middle w-100 custom-styled-table"></table>
      </div>

      <div id="tileSearchWrapper" class="row mb-3 justify-content-end">
        <div class="col-md-4">
          <input type="text" id="tileSearchInput" class="form-control border border-black p-2"
            placeholder="Search hospital, specialization, department...">
        </div>
      </div>

      <div id="tileView" class="row g-4"></div>

      <div id="mapView" class="row justify-content-center mb-5 mt-2 me-0" style="display:none;">

        <div class="col-12 col-md-8 mb-2 p-0">
          <div id="msnVisitMap" class="w-100 shadow border rounded-3" style="min-height: 300px; height: 70vh;"></div>
          <div class="d-flex justify-content-start align-items-center mt-2 mb-2 ps-2" id="mapLegend"
            style="font-size: small;">
            <div class="d-flex align-items-center me-4">
              <span class="text-center"><img src="./images/icons/location-icon.png"
                  style="height: 25px; width: 25px;">Network Hospitals</span>
            </div>
            <div class="d-flex align-items-center">
              <span class="text-center"><img src="./images/icons/pin.png" style="height: 25px; width: 25px;">Non Network
                Hospitals</span>
            </div>
          </div>
        </div>

        <div class="col-12 col-md-3 p-0 d-flex flex-column align-items-center">
          <div id="hospitalCards" class="w-100 overflow-auto rounded-3"
            style="max-height: 70vh; scrollbar-width: thin;">
          </div>
        </div>
      </div>
    </div>
  </div>


  <h1 class="text-center help-title mb-5">Notes from the journey</h1>
  <div class="container py-3">
    <div class="row mb-4 justify-content-end">
      <div class="col-md-4">
        <input type="text" id="journeySearch" class="form-control border border-black p-2"
          placeholder="Search by name, hospital, or quote..." oninput="handleSearch(this.value)">
      </div>
    </div>

    <div id="notesFromJourney"></div>
    <div class="text-center mt-3">
      <button id="loadMoreBtn" class="btn btn-outline-primary d-none">
        Load More
      </button>
    </div>
  </div>
</div>`;
  },
"msnSabbatical": function(data) {
    return `<div class="bg-white">
    <div class="position-relative">
      <h2 class="text-center bg-white p-3 rounded msnHospTitle connect-primary-border">Mission Sabbatical</h2>
    </div>
    <div class="overflow-auto px-3">
      Coming Soon
        <table id="equipments" class="display " width="100%"></table>
    </div>
</div>`;
  },
"patientWorkspace": function(data) {
    return `<div class="patient-workspace container-fluid p-0">
    <div class="d-flex d-lg-none align-items-center justify-content-between p-3 bg-white border-bottom z-2">
        <div class="d-flex align-items-center gap-3">
            <i class="fas fa-arrow-left fs-5 pe-pointer text-black"
                onclick="stopQueriesPolling(); navigateTo('networkConslt', {}, ['enableNetConsltRolesPage',[]]);"
                style="cursor:pointer"></i>
            <div>
                <h6 class="mb-0 fw-bold">${data.patientName || 'Patient Name'}</h6>
                <small class="text-muted">${data.patientId || 'Patient Id'}</small>
            </div>
        </div>
        <button class="btn btn-outline-dark btn-sm" type="button" data-bs-toggle="offcanvas"
            data-bs-target="#sidebarOffcanvas" aria-controls="sidebarOffcanvas">
            <i class="fas fa-bars me-1"></i> Menu
        </button>
    </div>

    <div class="row g-0">
        <div class="offcanvas-lg offcanvas-start col-lg-3 col-xl-2 border-end bg-white" tabindex="-1"
            id="sidebarOffcanvas" aria-labelledby="sidebarOffcanvasLabel">

            <div class="offcanvas-header d-lg-none border-bottom">
                <h5 class="offcanvas-title fw-bold" id="sidebarOffcanvasLabel">Navigation</h5>
                <button type="button" class="btn-close text-reset" data-bs-dismiss="offcanvas"
                    data-bs-target="#sidebarOffcanvas" aria-label="Close"></button>
            </div>

            <div class="offcanvas-body patient-sidebar p-3 d-flex flex-column h-100">
                <div class="d-none d-lg-block mb-4">
                    <i class="fas fa-arrow-left fs-5 pe-pointer text-black mb-3"
                        onclick="stopQueriesPolling(); navigateTo('networkConslt', {}, ['enableNetConsltRolesPage',[]]);"
                        style="cursor:pointer"></i>
                    <div class="patient-header">
                        <h5 class="fw-bold mb-1">${data.patientName || 'Patient Name'}</h5>
                        <small class="text-muted">${data.patientId || 'Patient Id'}</small>
                    </div>
                </div>

                <div id="patientStatusPanel" class="mb-3 d-none">
                    <label class="fw-bold">Patient Status</label>
                    <select class="form-select" id="patientStatus">
                        <option value="">Select Status</option>
                        <option value="Allotted">Allotted</option>
                        <option value="Pending">Pending</option>
                        <option value="Referred">Referred</option>
                    </select>
                </div>

                <div id="docApprovalPanel" class="mb-3 d-none">
                    <label class="fw-bold">Approval Status</label>
                    <select class="form-select" id="docApproval">
                        <option value="">Select Status</option>
                        <option value="Accepted">Accepted</option>
                        <option value="Rejected">Rejected</option>
                    </select>
                </div>

                <div class="mb-3">
                    <div id="countOfVisits">
                        <label class="fw-bold">Total Visits</label>
                        <select class="form-select" id="patientVisits">
                        </select>
                    </div>
                </div>

                <div class="nav flex-column gap-2 w-100">
                    <button class="btn sidebar-btn text-start w-100 active" data-page="patientDetailsPage"
                        data-bs-dismiss="offcanvas" data-bs-target="#sidebarOffcanvas">
                        <i class="fas fa-user-injured me-2"></i> Overview
                    </button>
                    <button class="btn sidebar-btn text-start w-100" data-page="queriesPage" data-bs-dismiss="offcanvas"
                        data-bs-target="#sidebarOffcanvas">
                        <i class="fas fa-comments me-2"></i> Case Discussion - Q&A
                    </button>
                    <button class="btn sidebar-btn text-start w-100" data-page="reportsPage" data-bs-dismiss="offcanvas"
                        data-bs-target="#sidebarOffcanvas">
                        <i class="fas fa-file-medical me-2"></i> Reports
                    </button>
                    <button class="btn sidebar-btn text-start w-100" data-page="imagesPage" data-bs-dismiss="offcanvas"
                        data-bs-target="#sidebarOffcanvas">
                        <i class="fas fa-x-ray me-2"></i> Images
                    </button>
                    <button id="callPageBtn" class="btn sidebar-btn text-start w-100 d-none" data-page="callPage"
                        data-bs-dismiss="offcanvas" data-bs-target="#sidebarOffcanvas">
                        <i class="fas fa-phone me-2"></i> Conference Call
                    </button>
                    <button id="allotLogBtn" class="btn sidebar-btn text-start w-100 d-none" data-page="allotLogPage"
                        data-bs-dismiss="offcanvas" data-bs-target="#sidebarOffcanvas">
                        <i class="fas fa-user-md me-2"></i> Allotted Doctors
                    </button>
                </div>
            </div>
        </div>

        <div class="col-lg-9 col-xl-10 bg-body-tertiary p-3 min-vh-100">
            <div id="patientContent">
                <div class="row g-3">
                    <div class="col-md-6">
                        <div class="card h-100 shadow-sm border-0 rounded-3">
                            <div class="card-body">
                                <h5 class="fw-bold mb-3">Demographics</h5>
                                <div class="table-responsive">
                                    <table class="table align-middle mb-0">
                                        <tr>
                                            <th class="w-40">Name</th>
                                            <td>${data.patientName || '-'}</td>
                                        </tr>
                                        <tr>
                                            <th class="w-40">Patient ID</th>
                                            <td>${data.patientId || '-'}</td>
                                        </tr>
                                        <tr>
                                            <th>Gender</th>
                                            <td>${data.gender || '-'}</td>
                                        </tr>
                                        <tr>
                                            <th>Age</th>
                                            <td>${data.age || '-'}</td>
                                        </tr>
                                        <tr>
                                            <th>Hospital</th>
                                            <td>${data.instHsptlName || '-'}</td>
                                        </tr>
                                        <tr>
                                            <th>Pincode</th>
                                            <td>${data.pincode || '-'}</td>
                                        </tr>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="col-md-6">
                        <div class="card h-100 shadow-sm border-0 rounded-3">
                            <div class="card-body">
                                <h5 class="fw-bold mb-3">Diagnosis</h5>
                                <div class="table-responsive">
                                    <table class="table align-middle mb-0">
                                        <tr>
                                            <th class="w-40">Primary Diagnosis</th>
                                            <td>${data.diagnosisPrimary || '-'}</td>
                                        </tr>
                                        <tr>
                                            <th>ICD Diagnosis</th>
                                            <td>${data.icdDiagnosis || '-'}</td>
                                        </tr>
                                        <tr>
                                            <th>Date</th>
                                            <td>-</td>
                                        </tr>
                                        <tr>
                                            <th>Theme</th>
                                            <td>${data.patientRelatedThemeName || '-'}</td>
                                        </tr>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="col-12">
                        <div class="card shadow-sm border-0 rounded-3">
                            <div class="card-body">
                                <h5 class="fw-bold mb-2">Clinical Details</h5>
                                <p class="card-text text-dark">${data.patientClinicalDetails || '-'}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div id="reportsPage" class="d-none">

                <div class="card shadow-sm border-0">
                    <div class="card-body">
                        <h4 class="mb-4">Medical Reports 1</h4>
                        <div id="MedicalReports1"></div>
                    </div>
                </div>
                <div class="card shadow-sm border-0">
                    <div class="card-body">
                        <h4 class="mb-4">Medical Reports 2</h4>
                        <div id="MedicalReports2"></div>
                    </div>
                </div>
                <div class="card shadow-sm border-0">
                    <div class="card-body">
                        <h4 class="mb-4">Radiological Reports</h4>
                        <div id="RadioReports" class="row g-3"></div>
                    </div>
                </div>
                <div class="card shadow-sm border-0">
                    <div class="card-body">
                        <h4 class="mb-4">Histopathological Reports 1</h4>
                        <div id="HistopathoReports1" class="row g-3"></div>
                    </div>
                </div>
                <div class="card shadow-sm border-0">
                    <div class="card-body">
                        <h4 class="mb-4">Histopathological Reports 2</h4>
                        <div id="HistopathoReports2" class="row g-3"></div>
                    </div>
                </div>
                <div class="card shadow-sm border-0">
                    <div class="card-body">
                        <h4 class="mb-4">Blood Reports</h4>
                        <div id="BloodReports" class="row g-3"></div>
                    </div>
                </div>
            </div>
            <div id="imagesPage" class="d-none"></div>

            <div id="queriesPage" class="d-none">
                <div class="row g-3">
                    <div class="col-xl-4 col-lg-5">
                        <div class="card border-0 shadow-sm rounded-3">
                            <div class="card-header bg-white border-0 pt-3 px-3 pb-2">
                                <div class="d-flex flex-wrap gap-2 justify-content-between align-items-center">
                                    <h5 class="mb-0 fw-bold">
                                        Questions
                                    </h5>
                                    <div class="d-flex gap-2">
                                        <button class="btn btn-light btn-sm rounded-pill border"
                                            onclick="stopQueriesPolling(); ncPatientQuery(selectedPatient).then(() => startQueriesPolling(selectedPatient?.patientId))">
                                            <i class="fas fa-rotate-right me-1"></i> Refresh
                                        </button>
                                        <button class="btn btn-primary btn-sm rounded-pill"
                                            onclick="openAddQuestionModal()">
                                            <i class="fas fa-plus me-1"></i> Add
                                        </button>
                                    </div>
                                </div>

                                <div id="addQuesFormContainer" class="d-none mt-3">
                                    <div class="border rounded-3 p-3 bg-light">
                                        <div class="mb-2">
                                            <label class="form-label small fw-semibold">Priority</label>
                                            <select id="questionTag" class="form-select form-select-sm rounded-3">
                                                <option value="">Select Priority</option>
                                                <option value="High">High</option>
                                                <option value="Medium">Medium</option>
                                                <option value="Low">Low</option>
                                            </select>
                                        </div>
                                        <div class="mb-3">
                                            <label class="form-label small fw-semibold">Question</label>
                                            <textarea id="question" rows="3"
                                                class="form-control form-control-sm rounded-3"
                                                placeholder="Type your question here"></textarea>
                                        </div>
                                        <div class="d-flex justify-content-end gap-2">
                                            <button class="btn btn-sm btn-light border rounded-pill"
                                                onclick="closeQuestionForm()">Cancel</button>
                                            <button class="btn btn-sm btn-primary rounded-pill"
                                                onclick="submitQuestion('${data.patientId}')">Submit</button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="card-body p-0">
                                <div id="ncQuestionList" class="question-list list-group list-group-flush">
                                </div>
                            </div>

                            <div id="ncCallPanel" class="card-vertical my-2 p-2 border-top d-none">
                                <label class="fw-bold">Does this patient require a Conference Call?</label>
                                <select id="ncCallSelect" class="form-select form-select-sm rounded-3 w-25">
                                    <option>Yes</option>
                                    <option>No</option>
                                </select>
                                <button onclick="ncCallBtn('${data.patientId}')"
                                    class="btn btn-sm btn-primary rounded ms-2">Submit</button>
                            </div>
                        </div>
                    </div>

                    <div class="col-xl-8 col-lg-7">
                        <div class="card border-0 shadow-sm rounded-3 min-vh-50">
                            <div class="card-body d-flex flex-column justify-content-center align-items-center">
                                <div id="ncPatientQuery" class="w-100">
                                    <div class="text-center py-5 text-muted">
                                        <i class="fas fa-comments fs-1 mb-3 text-secondary opacity-50"></i>
                                        <p class="mb-0">Select a question from the left panel to view discussion
                                            details.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div id="callPage" class="d-none">
                <div class="card border-0 shadow-sm rounded-3 min-vh-50">
                    <div class="card-header bg-nc text-white rounded-top">
                        <h5 class="card-title">Conference Call</h5>
                    </div>
                    <div class="card-body">
                        <p>Conference Call</p>
                    </div>
                </div>
            </div>
            <div id="allotLogPage" class="d-none">
                <div class="card border-0 shadow-sm rounded-3 min-vh-50">
                    <div class="card-header bg-nc text-white rounded-top">
                        <h5 class="card-title">Allotted Doctor</h5>
                    </div>
                    <div class="card-body">
                        <table id="ncAllotLogTable" class="table table-striped table-bordered">
                        </table>
                    </div>
                </div>
            </div>

        </div>
    </div>
</div>`;
  },
"ncConsltPage": function(data) {
    return `<div class="bg-white h-100 py-4">

    <div class="position-relative">
        <h2 class="text-center p-3 msnHospTitle connect-primary-border">
            Network Consults Page
        </h2>
        <i class="fas fa-arrow-left position-absolute start-0 top-0 m-3 fs-2 pe-pointer"
            onclick="navigateTo('networkConslt', {}, ['enableNetConsltRolesPage',[]]);"></i>
    </div>      
      
        <div class="row">
          <div class="col-md-6 border p-3">
            <h5 class="fw-semibold mb-3 bg-body-secondary text-center p-2">My Department Consult</h5>
            <table id="ncMyDeptConsltTable" class="table"></table>
          </div>
          <div class="col-md-6">
            <h5 class="fw-semibold mb-3"></h5>
            <table id=""></table>
          </div>
        </div>

</div>`;
  },
"ncNodalPage": function(data) {
    return `   <div class="bg-white h-100 py-4">

    <div class="position-relative">
        <h2 class="text-center p-3 msnHospTitle connect-primary-border">
            Network Consults Nodal Page
        </h2>
        <i class="fas fa-arrow-left position-absolute start-0 top-0 m-3 fs-2 pe-pointer"
            onclick="navigateTo('networkConslt', {}, ['enableNetConsltRolesPage',[]]);"></i>
    </div>
   
        <div class="row">
          <div class="col-md-6 border p-3">
            <h5 class="fw-semibold mb-3 bg-body-secondary text-center p-2">Nodals</h5>
            <table id="ncNodalsListTable" class="table"></table>
          </div>
          <div class="col-md-6">
            <h5 class="fw-semibold mb-3"></h5>
            <table id=""></table>
          </div>
        </div>
      </div>
      `;
  },
"guestHome": function(data) {
    return `<div class="bg-white">
    <section class="hero">
        <div class="hero-content">
            <h1>Christian Medical College Vellore</h1>
            <div class="d-flex align-items-center justify-content-center mb-5">
                <div style="flex: 1; height: 3px; background: #14067c;"></div>
                <div class="d-flex align-items-center px-3 fw-bold">Transformative care for over 125 years</div>
                <div style="flex: 1; height: 3px; background: #14067c;"></div>
            </div>
        </div>
    </section>

    <section class="section-light">
        <div class="container">
            <h2>Thought for the day</h2>
            <p class="py-3 fw-medium fs-5">${data.thoughtOfDay}</p>
        </div>
    </section>

    <div class="container-fluid py-5" style="background-color: #fdf8ef;">
        <div class="row g-4 align-items-stretch">

            <div class="col-md-6">
                <div class="h-100 card shadow p-3 bg-white ">
                    ${data.whatsNew}
                </div>
            </div>

            <div class="col-md-3 d-flex flex-column gap-4">
                <div class="card text-center shadow p-2 w-100 h-100 custom-card"
                    onclick="navigateTo('clinicalSnip', '', ['loadClinicalSnip',[]])">

                    <div class="card-main-content d-flex flex-column h-100">
                        <div
                            class="card-content picture px-md-4 py-3 d-flex justify-content-center align-items-center flex-grow-1">
                            <img src="../images/icons/Open_Book.png" class="img-fluid card-icon" alt="Icon">
                        </div>

                        <div class="card-footer bg-transparent border-0 w-100">
                            <h5 class="text-wrap connect-text-darkblue mb-0">
                                Clinical Snippets
                            </h5>
                        </div>

                    </div>

                    <div class="card-hover-overlay d-flex justify-content-center align-items-center">
                        <p class="hover-message m-0 px-3 fs-4">
                            Take a Quiz
                        </p>
                    </div>

                </div>
            </div>
            <div class="col-md-3 d-flex flex-column gap-4">
                <div class="card text-center shadow p-2 w-100 h-100 custom-card"
                    onclick="navigateTo('contact',{postLogin: true,currPage: 'renderGuestHomePage()', role: 'VConnect Guest'}, ['loadHospitalIdsAndMap',[]]);">

                    <div class="card-main-content d-flex flex-column h-100">
                        <div
                            class="card-content picture px-md-4 py-3 d-flex justify-content-center align-items-center flex-grow-1">
                            <img src="./images/icons/india-icon1.png" class="img-fluid card-icon" alt="Icon">
                        </div>

                        <div class="card-footer bg-transparent border-0 w-100">
                            <h5 class="text-wrap connect-text-darkblue mb-0">
                                Mission Hospitals
                            </h5>
                        </div>

                    </div>

                    <div class="card-hover-overlay d-flex justify-content-center align-items-center">
                        <p class="hover-message m-0 px-3 fs-4">
                            View Our Mission Hospitals
                        </p>
                    </div>

                </div>

            </div>

        </div>
    </div>

    <section class="lookingFor d-flex align-items-center">
        <div class="container px-lg-5 text-center position-relative z-2">

            <h2 class="mb-4 fw-bold">What are you looking for?</h2>

            <div class="row g-4 justify-content-center">

                <div class="col-lg-5 col-md-6">
                    <div class="custom-box h-100 card-hover rounded bg-white">
                        <h4>Learning Resources</h4>
                        <p>
                            Explore our curated learning resources designed to enhance knowledge, build skills, and
                            support continuous professional growth.
                        </p>
                        <button
                            onclick="navigateTo('learningResources', {}, ['renderLoadResources', ['learningResources', 'renderPostHomePage()']]);"
                            class="btn btn-dark mt-3">
                            Click here to see our learning resources
                        </button>
                    </div>
                </div>

                <div class="col-lg-5 col-md-6">
                    <div class="custom-box h-100 card-hover rounded bg-white">
                        <h4>Grand Rounds</h4>
                        <p>
                            A webinar series by senior clinicians, addressing key clinical topics relevant to
                            practitioners in peripheral hospital settings.
                        </p>
                        <button
                            onclick="navigateTo('grandRounds', {backTo: 'renderPostHomePage()'}, [['loadGrandRoundsTable', []], ['loadGrandRoundsVideos', [10]]]);"
                            class="btn btn-dark mt-3">
                            Click here to register or see the recorded lectures
                        </button>
                    </div>
                </div>

            </div>

        </div>
    </section>

    <section class="py-5" style="background-color: #fdf8ef;">
        <div class="container">
            <div class="d-flex align-items-center justify-content-center mb-5">
                <div style="flex: 1; height: 1px; background: #d3bc8d;"></div>
                <div class="mx-3 d-flex align-items-center">
                    <span class="dot mx-1"
                        style="height: 8px; width: 8px; background: #d3bc8d; border-radius: 50%;"></span>
                    <h3 class="mb-0 px-3 fw-bold" style="color: #5a1216; font-family: serif;">Latest News</h3>
                    <span class="dot mx-1"
                        style="height: 8px; width: 8px; background: #d3bc8d; border-radius: 50%;"></span>
                </div>
                <div style="flex: 1; height: 1px; background: #d3bc8d;"></div>
            </div>

            <div class="row g-4 justify-content-center">
                ${data.renderedNews}
            </div>

            <div class="text-end mt-4">
                <span class="px-3 py-1 text-decoration-none fw-bold"
                    style="color: #8e6809; cursor: pointer; border-bottom: 2px solid #8e6809;"
                    onclick="loadAllNews('guest', 'renderPostHomePage()')">
                    View all &rarr;
                </span>
            </div>
        </div>
    </section>

    <section class="services py-5">
        <div class="container text-center">

            <h2 class="section-title">What we do</h2>

            <div class="row g-4">

                <div class="col-lg-4 col-md-6">
                    <div class="service-card card-hover">
                        <div class="icon-circle">
                            <img src="https://s3.amazonaws.com/img.studenthub.in/CMCVConnect_Portal/Pictures/_4daece7c5dd22715dd31b3760b3bcdea_Pictures.jpg"
                                alt="">
                        </div>
                        <h6>MANDATORY MISSION SERVICE</h6>
                        <p class="fs-6">
                            We encourage our doctors to visit and work in remote mission hospitals
                            as part of their trainings and promotions.
                        </p>
                    </div>
                </div>

                <div class="col-lg-4 col-md-6">
                    <div class="service-card card-hover">
                        <div class="icon-circle">
                            <img src="./images/icons/opinionIcon.png" alt="">
                        </div>
                        <h6>SECOND-OPINION CONNECT</h6>
                        <p class="fs-6">
                            Our Second-Opinion Connect program enables teleconsultations to mission
                            hospital health providers.
                        </p>
                    </div>
                </div>

                <div class="col-lg-4 col-md-6">
                    <div class="service-card card-hover">
                        <div class="icon-circle">
                            <img src="https://s3.amazonaws.com/img.studenthub.in/CMCVConnect_Portal/Pictures/_edb5cc4643467db0ddfe16793635bc92_Pictures.png"
                                alt="">
                        </div>
                        <h6>MISSION MENTORSHIP</h6>
                        <p class="fs-6">
                            One-on-one mentorship program supporting students in career and spiritual growth.
                        </p>
                    </div>
                </div>

                <div class="col-lg-4 col-md-6">
                    <div class="service-card card-hover">
                        <div class="icon-circle">
                            <img src="https://s3.amazonaws.com/img.studenthub.in/CMCVConnect_Portal/Pictures/_25e9cb969ad54f3805c638e78833d8b6_Pictures.png"
                                alt="">
                        </div>
                        <h6>MISSION DESK</h6>
                        <p class="fs-6">
                            We have a dedicated desk to facilitate patients referred from mission hospitals, mission
                            organizations, churches and CMC Vellore's peripheral Units.
                        </p>
                    </div>
                </div>

                <div class="col-lg-4 col-md-6">
                    <div class="service-card card-hover">
                        <div class="icon-circle">
                            <img src="https://s3.amazonaws.com/img.studenthub.in/CMCVConnect_Portal/Pictures/_876292a0ba12efbc36ed0263a839d747_Pictures.png"
                                alt="">
                        </div>
                        <h6>TRAININGS & FELLOWSHIPS</h6>
                        <p class="fs-6">
                            Short-term fellowships and trainings to build clinical capacity.
                        </p>
                    </div>
                </div>

                <div class="col-lg-4 col-md-6">
                    <div class="service-card card-hover">
                        <div class="icon-circle">
                            <img src="https://s3.amazonaws.com/img.studenthub.in/CMCVConnect_Portal/Pictures/_ed9025de53ca5f066a6a3b8bbf636bcc_Pictures.png"
                                alt="">
                        </div>
                        <h6>ASSET RECYCLING</h6>
                        <p class="fs-6">
                            We assess & donate reusable medical equipment to hospitals in need.
                        </p>
                    </div>
                </div>
                <div class="text-center">
                    <p>Want to discover more about what we do? Reach out to us at <a
                            href="mailto:[missionconnect@cmcvellore.ac.in]">missionconnect@cmcvellore.ac.in</a> or
                        Explore our website: <a href="https://www.cmch-vellore.edu/"
                            target="_blank">https://www.cmch-vellore.edu/</a>
                    </p>
                </div>
            </div>
        </div>
    </section>
    <section class="history">
        <div class="container">
            <div class="row align-items-center">

                <div class="col-md-5 text-center">
                    <img src="https://s3.amazonaws.com/img.studenthub.in/CMCVConnect_Portal/Pictures/_3cfe09f4baa8505e263a21673094eb96_Pictures.png"
                        class="img-fluid">
                    <div class="mt-2">
                        <h6>Be Thou My Vision - Ida Scudder of Vellore (Part 1)</h6>
                        <button class="btn btn-danger"
                            onclick="window.open('https://www.youtube.com/watch?v=kTlH_VLmM6Q', '_blank')">Watch
                            Video</button>
                    </div>


                </div>

                <div class="col-md-7">
                    <h2>Our History</h2>
                    <p>The Christian Medical College (CMC) was founded in the early twentieth century by Dr. Ida
                        Sophia Scudder with a singular vision: to provide compassionate healthcare to women and
                        children.</p>

                    <p>In her youth, Dr. Ida had no intention of continuing her family’s missionary legacy. However,
                        a defining
                        night in 1890 changed her course forever. She witnessed the tragic deaths of three young
                        Indian
                        women
                        during childbirth—lives that could have been saved had prevailing social norms permitted her
                        physician
                        father to attend to them. This experience left an indelible mark on her, inspiring her to
                        dedicate
                        her
                        life to medicine and service.</p>

                    <p>After completing her medical education at the University of Pennsylvania and Cornell
                        University,
                        Dr.
                        Scudder returned to India in 1900. She began her work modestly, establishing a one-bed
                        hospital
                        as
                        the
                        sole doctor in the region.</p>

                    <p>From these humble beginnings, CMC has grown into one of India’s foremost institutions. Today,
                        it
                        stands
                        as a beacon of excellence in medical education, research, and compassionate patient care,
                        with
                        2,500
                        beds, 1,700 doctors, and nearly 3,500 nurses.</p>
                    <div class="text-center">
                        <button class="btn btn-danger"
                            onclick="window.open('https://www.cmch-vellore.edu/history-missions/', '_blank')">Read
                            More</button>
                    </div>
                </div>

            </div>
        </div>
    </section>
</div>`;
  },
"clinicalSnip": function(data) {
    return `<div class="container-fluid bg-light min-vh-100 py-3">

    <div class="d-flex align-items-center justify-content-center position-relative mb-4">
        <i class="fas fa-arrow-left position-absolute start-0 ms-3 fs-2 cursor-pointer"
            onclick="renderPostHomePage()"></i>

        <h3 class="fw-bold mb-0">Clinical Snippets</h3>
    </div>

    <div class="container mb-4">
        <div class="intro-card text-center p-4">
            <h5 class="mb-2">Test Your Clinical Knowledge</h5>
        </div>
    </div>

    <div class="container">
        <div id="clinicalSnip" class="row g-4">
        </div>
    </div>

</div>`;
  },
"chat": function(data) {
    return `<div class="whatsapp-container">
    <div class="position-absolute start-0 top-0 m-3" style="z-index: 10;">
        <i class="bg-white bg-opacity-75 fa-arrow-left fas p-2 rounded shadow-sm pe-pointer"
            onclick="renderMissionsPage()" title="Back"></i>
    </div>
    <div class="wa-app">
        <!-- Sidebar -->
        <aside class="wa-sidebar">
            <header class="wa-sidebar-header">
                <h4 class="wa-sidebar-title">Chats</h4>
                <button id="createRoom" class="wa-icon-btn" title="New Group">
                    <i class="fa-solid fa-pen-to-square"></i>
                </button>
            </header>
            <div id="roomList" class="wa-room-list"></div>
        </aside>

        <!-- Main Chat Area -->
        <main class="wa-main hidden" id="chatPanel">
            <header id="groupHeader" class="wa-chat-header">
                <div class="wa-chat-header-info">
                    <div class="wa-avatar-placeholder">
                        <i class="fa-solid fa-users"></i>
                    </div>
                    <span id="roomName" class="wa-room-name"></span>
                </div>
                <div class="wa-chat-header-actions">
                    <span id="usersBtn" class="wa-icon-btn pe-pointer" title="Group Info">
                        <i class="fa-solid fa-ellipsis-vertical"></i>
                    </span>
                </div>
            </header>

            <div id="membersModal" class="members-modal hidden">
                <div class="members-content">
                    <div class="members-header">
                        <h3>Group Info</h3>
                        <span id="closeMembers" class="pe-pointer"><i class="fa-solid fa-xmark"></i></span>
                    </div>
                    <div id="membersList"></div>
                </div>
            </div>

            <div id="chatBox" class="wa-chat-box overflow-x-hidden"></div>

            <div class="reply-box" id="replyBox"></div>
            <div id="mentionList" class="mention-list hidden"></div>
            <div id="filePreview" class="file-preview hidden"></div>

            <form id="msgForm" class="wa-msg-form">
                <div class="upload-wrapper">
                    <button type="button" id="uploadBtn" class="upload-btn wa-icon-btn">
                        <i class="fa-solid fa-paperclip"></i>
                    </button>
                    <div id="uploadMenu" class="upload-menu hidden shadow">
                        <div class="upload-option" data-type="photo"><i class="fa-solid fa-image text-primary me-2"></i>
                            Photo</div>
                        <div class="upload-option" data-type="document"><i
                                class="fa-solid fa-file-lines text-secondary me-2"></i> Document</div>
                    </div>
                </div>

                <input type="file" id="fileInput" hidden multiple>
                <input id="message" class="wa-msg-input" placeholder="Type a message" autocomplete="off" />
                <button type="submit" class="wa-send-btn">
                    <i class="fa-solid fa-paper-plane"></i>
                </button>
            </form>
        </main>

        <!-- Placeholder when no chat is selected -->
        <div id="waPlaceholder" class="wa-placeholder">

        </div>
    </div>
</div>`;
  },
"serviceCommitment": function(data) {
    return `<div class="bg-white" style="font-family: sans-serif;">

    <!-- Background Section -->
    <!-- Hero Section -->
    <div class="position-relative">

        <!-- Background Image -->
        <div style="
        background-image: url('https://s3.amazonaws.com/img.studenthub.in/CMCVConnect_Portal/Pictures/_d660916e5d5a6103d7f68782b7c242b5_Pictures.jpeg');
        background-repeat: no-repeat;
        background-size: cover;
        background-position: center;
        height: 400px;
    ">
        </div>

        <!-- Student Card -->
        <div class="container">
            <div class="row justify-content-center">

                <div class="col-lg-8">
                    <div class="bg-white rounded shadow p-4 d-md-flex align-items-center"
                        style="margin-top: -120px; position: relative; z-index: 10;">

                        <!-- Student Image -->
                        <div class="text-center mb-3 mb-md-0 me-md-4">
                            <img src="${data.avatar || 'https://s3.amazonaws.com/img.studenthub.in/CMCVConnect_Portal/Pictures/_43782473c4ed75b1e167091821a4d700_Pictures.png'}"
                                alt="Student Image" class="img-fluid rounded"
                                style="width: 300px; height: 250px; object-fit: cover;">
                        </div>

                        <!-- Student Details -->
                        <div>

                            <p class="fs-3 fw-bold mb-2">
                                ${data.firstName + ' ' + data.lastName}
                            </p>

                            <p class="fs-5 mb-3">
                                <b>${data.course_name}</b> - Batch of ${data.batch}
                            </p>

                            <p class="mb-2">
                                <b>Admission No:</b> ${data.admissionNo}
                            </p>

                            <p class="mb-2">
                                <b>Phone No:</b> ${data.phoneNumber1}
                            </p>

                            <p class="mb-2">
                                <b>Email Id:</b> ${data.email}
                            </p>

                            <p class="mb-2">
                                <b>Address:</b> ${data.address1}
                            </p>

                            <p class="mb-0">
                                <b>Date of Birth:</b> ${new Date(data.dob).toLocaleDateString()}
                            </p>

                        </div>

                    </div>
                </div>

            </div>
        </div>

    </div>

    <!-- Extra Space Below -->
    <div class="pb-5"></div>
    <hr class="w-50 mx-auto">
    <div class="container w-75 py-4">
        <div class="row">
            <div class="col-md-12">
                <h4 class="text-center fw-bold">A Bit About Me</h4>
                <p class="text-center">${data.aboutme}</p>
            </div>
        </div>
    </div>

    <section class="bg-dark text-white text-center pb-4">
        <div class="pb-4 bg-gradient" style="  mask: 
    radial-gradient(102.86px at 50% calc(100% - 138px),#000 99%,#0000 101%) calc(50% - 92px) 0/184px 100%,
    radial-gradient(102.86px at 50% calc(100% + 92px),#0000 99%,#000 101%) 50% calc(100% - 46px)/184px 100% repeat-x;">
            <h4 class="text-center fw-bold py-5">Service Commitment Details</h4>
        </div>
        <div class="container-fluid">
            <div class="row g-3 w-75 mx-auto" style="font-family: sans-serif">
                <h5 class="fw-bold">Course Details</h5>
                <div class="col-md-3">
                    <div class="card" style="height: 150px;">
                        <div class="card-body align-content-center">
                            <h5 class="card-title fw-bold">Quota Name</h5>
                            <hr class="mx-4">
                            <h5 class="card-text" style="font-family: math;">${data.quotaName.quotaName}</h5>
                        </div>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="card" style="height: 150px;">
                        <div class="card-body align-content-center">
                            <h5 class="card-title fw-bold">Quota Category</h5>
                            <hr class="mx-4">
                            <h5 class="card-text" style="font-family: math;">${data.quotaCategory.quotaCategory}</h5>
                        </div>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="card" style="height: 150px;">
                        <div class="card-body align-content-center">
                            <h5 class="card-title fw-bold">Course joining date</h5>
                            <hr class="mx-4">
                            <h5 class="card-text" style="font-family: math;">${new
                                Date(data.doj).toLocaleDateString('en-US', { day: 'numeric',
                                month: 'short', year: 'numeric' })}</h5>
                        </div>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="card" style="height: 150px;">
                        <div class="card-body align-content-center">
                            <h5 class="card-title fw-bold">Expected date of completion</h5>
                            <hr class="mx-4">
                            <h5 class="card-text" style="font-family: math;">${new
                                Date(data.expectedDateOfCompletion).toLocaleDateString('en-US',
                                { day: 'numeric', month: 'short', year: 'numeric' })}</h5>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
    <section class="bg-black text-white text-center py-4">
        <div class="container">
            <div class="row g-3 w-75 mx-auto" style="font-family: sans-serif;">
                <h5 class="fw-bold">Sponsorship Details</h5>

                <div class="col-md-4">
                    <div class="card" style="height: 150px;">
                        <div class="card-body align-content-center">
                            <h5 class="card-title fw-bold">Number of years of service</h5>
                            <hr class="mx-4">
                            <h5 class="card-text" style="font-family: math;">${data.serviceDuration}</h5>
                        </div>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="card" style="height: 150px;">
                        <div class="card-body align-content-center">
                            <h5 class="card-title fw-bold">Sponsoring Body name</h5>
                            <hr class="mx-4">
                            <h5 class="card-text" style="font-family: math;">${data.sponsoringBody.sponsoringBodyName}
                            </h5>
                        </div>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="card" style="height: 150px;">
                        <div class="card-body align-content-center">
                            <h5 class="card-title fw-bold">Allotted Hospital</h5>
                            <hr class="mx-4">
                            <h5 class="card-text" style="font-family: math;">
                                ${data.listOfHsptlVisited[data.listOfHsptlVisited.length -
                                1]?.hsptlPosted?.missionHospitalName || 'Hospital not allotted yet'}</h5>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
    <section class=" px-2 py-4">
        <h4 class="text-black fw-bold text-center">Hospital Associated with the
            ${data.sponsoringBody.sponsoringBodyName}</h4>
        <div id="sponsoringBodyCard" class="container"></div>
    </section>
    <section class="bg-black text-white py-4">
        <div class="container">
            <div class="row justify-content-center">
                <div class="col-12 col-sm-11 col-md-8 col-lg-6">
                    <div class="border rounded-3 p-3 p-md-4">

                        <p class="mb-3">
                            Please share your journey with us. It would be very helpful
                            for others wanting to go in the same direction to read about
                            your experiences.
                        </p>

                        <div class="dropdown mb-3 w-100">
                            <button
                                class="btn btn-light dropdown-toggle w-100 text-start d-flex justify-content-between align-items-center"
                                type="button" id="hospitalDropdown" data-bs-toggle="dropdown" aria-expanded="false">

                                <span id="selectedHospitalText">Select Hospital</span>
                            </button>

                            <ul class="dropdown-menu w-100" id="hospitalList"
                                style="max-height:250px; overflow-y:auto;">
                                ${(data.listOfHsptlVisited || []).map(hsptl => `
                                <li>
                                    <a class="dropdown-item hospital-item" href="javascript:void(0)"
                                        data-id="${hsptl.hsptlPosted._id}">
                                        ${hsptl.hsptlPosted.missionHospitalName}
                                    </a>
                                </li>
                                `).join('')}
                            </ul>
                        </div>

                        <input type="hidden" id="selectedHsptl">

                        <textarea id="feedback" class="form-control mb-3" rows="8"
                            placeholder="Share your experience..."></textarea>

                        <button id="shareBtn" class="btn btn-primary w-100" disabled>
                            Click here to share
                        </button>

                    </div>
                </div>
            </div>
        </div>
    </section>
</div>`;
  },
"connectNewsletter": function(data) {
    return `<div class="bg-white">
    <div class="position-relative">
    </div>
    <div class="overflow-auto px-3 text-center">

        <section class="newsletter-section">


            <div class="container">

                <div class="section-title text-center">
                      <i class="bg-opacity-10 fa-arrow-left fas rounded position-absolute start-0 top-0 m-3 fs-2 pe-pointer" style="z-index: 2;"
    onclick="renderPostHomePage();"></i>
                    <h1>Connect Newsletter</h1>
                    <h2>Do you have a story to share?</h2>
                    <h3 class="section-subtitle">
                        We would love to hear from you. Please write to us @ missionconnect@cmcvellore.ac.in
                    </h3>
                </div>

                <div class="newsletter-grid" id="newsletterCards">

                    <div class="newsletter-card"
                        data-flipbook="https://online.fliphtml5.com/cmcvellore/Mission-Connect---NL-2026-Vol1-Iss-2/"
                        onclick="openNewsletter(this)">

                        <div class="newsletter-cover">

                            <!-- Cover Image -->
                            <img src="https://s3.amazonaws.com/img.studenthub.in/CMCVConnect_Portal/Pictures/_53841622cdbeb07dc31398aa3346b1f6_Pictures.png"
                                alt="Mission Connect">

                        </div>

                        <div class="newsletter-content">

                            <h5>Mission Connect - Vol 1 | Issue 2</h5>

                            <p>January 2026</p>

                        </div>

                    </div>

                </div>


        </section>

    </div>
</div>

<!-- Model area -->

<div class="modal fade" id="newsletterModal" tabindex="-1">

    <div class="modal-dialog modal-xl modal-dialog-centered">

        <div class="modal-content">

            <div class="modal-header">

                <h5 class="modal-title">
                    Connect Newsletter
                </h5>

                <button type="button" class="btn-close" data-bs-dismiss="modal">
                </button>

            </div>

            <div class="modal-body p-0">

                <iframe id="newsletterFrame" width="100%" height="700" frameborder="0" allowfullscreen>
                </iframe>

            </div>

        </div>

    </div>

</div>`;
  },
"fovGrants": function(data) {
    return `<div class="bg-white">
  <section class="bg-white position-relative overflow-hidden">
    <div class="mb-4">
      <!-- Hero Section Container with Background Image -->
      <div class="card fov-hero-card border-0 shadow-sm rounded-bottom-4 overflow-hidden position-relative mb-5" style="
        background:
          linear-gradient(
            90deg,
            rgba(255, 255, 255, 0) 30%,
            rgba(255, 255, 255, 0.92) 65%,
            #ffffff 100%
          ),
          url('https://s3.amazonaws.com/img.studenthub.in/CMCVConnect_Portal/Pictures/_e9bf0a77f0bed2c5e5ebddb5f10a87d0_Pictures.jpg') left center / cover
            no-repeat;
        min-height: 480px;
      ">
        <div class="row h-100 align-items-center g-0">
          <!-- Spacer Column to push content to the right -->
          <div class="col-lg-6 col-md-5 d-none d-md-block"></div>

          <!-- Right Content Column -->
          <div class="col-lg-6 col-md-7 p-4 mt-5 p-md-5 text-center text-md-end ms-auto">
            <!-- Title & Subtitle -->
            <h1 class="display-6 fw-bold mb-2" style="color: #1a2b4c; font-family: serif">
              Mission Hospital Grant Programme
            </h1>

            <h5 class="fw-normal mb-3 text-muted" style="color: #4a5568">
              Friends Of Vellore UK
            </h5>

            <p class="fs-6 text-secondary mb-4 ms-auto" style="max-width: 420px; line-height: 1.6">
              Supporting mission hospitals serving poor and marginalised
              communities across India.
            </p>

            <!-- CTA Buttons -->
            <div class="d-flex flex-wrap justify-content-center justify-content-md-end gap-2 mb-4">
              <button onclick="openModal('formIO', null, ''); loadFOVGrantForm()"
                class="btn px-4 py-2 text-white fw-medium shadow-sm d-inline-flex align-items-center"
                style="background-color: #11223f; border-radius: 6px">
                <i class="fa-solid fa-file-pen me-2"></i>Apply For Grant
              </button>

              <a href="https://s3.amazonaws.com/img.studenthub.in/CMCVConnect_Portal/FovGuidelines/_5ba358582081c0a06bab681402bc811e_FovGuidelines.pdf"
                target="_blank"
                class="btn btn-outline-secondary px-3 py-2 fw-medium bg-white text-dark border-secondary shadow-sm d-inline-flex align-items-center"
                style="border-radius: 6px">
                <i class="fa-solid fa-download me-2"></i>Download Guidelines
              </a>
            </div>
            <div class="d-flex flex-wrap justify-content-center justify-content-md-end gap-2 mb-4">
              <button id="fovAppDashboardBtn"
                onclick="navigateTo('fovAppDashboard', null, [['loadFovAppDashboard',[]], ['loadFovApplication',['Draft']]])"
                class="btn px-4 py-2 text-white fw-medium shadow-sm d-inline-flex align-items-center"
                style="background-color: #11223f; border-radius: 6px">
                <i class="fa-classic fa-regular fa-window-restore me-2"></i>Applicant Dashboard
              </button>

              <button id="fovAdminDashboardBtn"
                onclick="navigateTo('fovAdminDashboard', null, [['loadFovAdminDashboard',[]],['loadFovAppStatusTable',['Pending']]])"
                class="btn px-4 py-2 text-white fw-medium shadow-sm d-inline-flex align-items-center"
                style="background-color: #11223f; border-radius: 6px">
                <i class="fa-classic fa-solid fa-tachograph-digital me-2"></i>Admin Dashboard
              </button>

            </div>
          </div>
        </div>

        <!-- Floating Stat Cards Banner Across Bottom -->
        <div class="position-absolute bottom-0 start-50 translate-middle-x w-100 px-3 pb-3 d-none d-md-block"
          style="z-index: 2">
          <div class="container row g-2 justify-content-center">
            <div class="col-md-3 col-6">
              <div
                class="bg-white bg-opacity-75 backdrop-blur rounded-3 p-2 px-3 border border-light shadow-sm d-flex align-items-center">
                <div class="rounded-circle p-2 me-2 text-white d-flex align-items-center justify-content-center"
                  style="width: 36px; height: 36px">
                  <img src="../images/icons/Fov Icon/pound-coin.png" class="me-2" style="width: 40px; height: 40px;">
                </div>
                <div>
                  <div class="fw-bold fs-5 lh-1" style="color: #11223f">
                    £6000 +
                  </div>
                  <small style="font-size: 1rem">Awarded in Grants</small>
                </div>
              </div>
            </div>

            <div class="col-md-3 col-6">
              <div
                class="bg-white bg-opacity-75 backdrop-blur rounded-3 p-2 px-3 border border-light shadow-sm d-flex align-items-center">
                <div class="rounded-circle p-2 me-2 text-white d-flex align-items-center justify-content-center"
                  style="width: 36px; height: 36px">
                  <img src="../images/icons/Fov Icon/hospitals.png" class="me-2" style="width: 40px; height: 40px;">
                </div>
                <div>
                  <div class="fw-bold fs-5 lh-1" style="color: #11223f">
                    140 +
                  </div>
                  <small style="font-size: 1rem">Hospitals Supported</small>
                </div>
              </div>
            </div>

            <div class="col-md-3 col-6">
              <div
                class="bg-white bg-opacity-75 backdrop-blur rounded-3 p-2 px-3 border border-light shadow-sm d-flex align-items-center">
                <div class="rounded-circle p-2 me-2 text-white d-flex align-items-center justify-content-center"
                  style="width: 36px; height: 36px">
                  <img src="../images/icons/Fov Icon/partnership-handshake.png" class="me-2"
                    style="width: 40px; height: 40px;">
                </div>
                <div>
                  <div class="fw-bold fs-5 lh-1" style="color: #11223f">10 +</div>
                  <small style="font-size: 1rem">Years of Partnership</small>
                </div>
              </div>
            </div>

            <div class="col-md-3 col-6">
              <div
                class="bg-white bg-opacity-75 backdrop-blur rounded-3 p-2 px-3 border border-light shadow-sm d-flex align-items-center">
                <div class="rounded-circle p-2 me-2 text-white d-flex align-items-center justify-content-center"
                  style="width: 36px; height: 36px">
                  <img src="../images/icons/Fov Icon/india-outline.png" class="me-2" style="width: 40px; height: 40px;">
                </div>
                <div>
                  <div class="fw-bold fs-5 lh-1" style="color: #11223f">
                    15 states
                  </div>
                  <small style="font-size: 1rem">Across India</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <div class="px-3 pb-3 d-md-none" style="z-index: 2">
    <div class="container-fluid px-0">
      <div class="row g-2 justify-content-center">

        <div class="col-md-3 col-6 d-flex">
          <div
            class="bg-white bg-opacity-75 backdrop-blur rounded-3 p-2 px-3 border border-light shadow-sm d-flex align-items-center w-100 h-100">
            <div
              class="rounded-circle p-2 me-2 text-white d-flex align-items-center justify-content-center flex-shrink-0"
              style="width: 36px; height: 36px">
              <img src="../images/icons/Fov Icon/pound-coin.png"
                style="width: 32px; height: 32px; object-fit: contain;">
            </div>
            <div class="overflow-hidden">
              <div class="fw-bold fs-5 lh-1 text-nowrap" style="color: #11223f">£6000 +</div>
              <small class="text-muted d-block " style="font-size: 0.8rem;">Awarded in Grants</small>
            </div>
          </div>
        </div>


        <div class="col-md-3 col-6 d-flex">
          <div
            class="bg-white bg-opacity-75 backdrop-blur rounded-3 p-2 px-3 border border-light shadow-sm d-flex align-items-center w-100 h-100">
            <div
              class="rounded-circle p-2 me-2 text-white d-flex align-items-center justify-content-center flex-shrink-0"
              style="width: 36px; height: 36px">
              <img src="../images/icons/Fov Icon/hospitals.png" style="width: 32px; height: 32px; object-fit: contain;">
            </div>
            <div class="overflow-hidden">
              <div class="fw-bold fs-5 lh-1 text-nowrap" style="color: #11223f">140 +</div>
              <small class="text-muted d-block " style="font-size: 0.8rem;">Hospitals Supported</small>
            </div>
          </div>
        </div>


        <div class="col-md-3 col-6 d-flex">
          <div
            class="bg-white bg-opacity-75 backdrop-blur rounded-3 p-2 px-3 border border-light shadow-sm d-flex align-items-center w-100 h-100">
            <div
              class="rounded-circle p-2 me-2 text-white d-flex align-items-center justify-content-center flex-shrink-0"
              style="width: 36px; height: 36px">
              <img src="../images/icons/Fov Icon/partnership-handshake.png"
                style="width: 32px; height: 32px; object-fit: contain;">
            </div>
            <div class="overflow-hidden">
              <div class="fw-bold fs-5 lh-1 text-nowrap" style="color: #11223f">10 +</div>
              <small class="text-muted d-block " style="font-size: 0.8rem;">Years of Partnership</small>
            </div>
          </div>
        </div>


        <div class="col-md-3 col-6 d-flex">
          <div
            class="bg-white bg-opacity-75 backdrop-blur rounded-3 p-2 px-3 border border-light shadow-sm d-flex align-items-center w-100 h-100">
            <div
              class="rounded-circle p-2 me-2 text-white d-flex align-items-center justify-content-center flex-shrink-0"
              style="width: 36px; height: 36px">
              <img src="../images/icons/Fov Icon/india-outline.png"
                style="width: 32px; height: 32px; object-fit: contain;">
            </div>
            <div class="overflow-hidden">
              <div class="fw-bold fs-5 lh-1 text-nowrap" style="color: #11223f">15 states</div>
              <small class="text-muted d-block " style="font-size: 0.8rem;">Across India</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>


  <!-- Section Header: Funding at a glance -->
  <div class="text-center my-5 position-relative">
    <div class="d-flex align-items-center justify-content-center gap-3">
      <hr class="flex-grow-1" style="
            border-color: #11223f;
            opacity: 1;
            max-width: 200px;
            border-width: 4px;
          " />
      <h3 class="fw-bold mb-0" style="color: #11223f; font-family: serif">
        Funding at a glance
      </h3>
      <hr class="flex-grow-1" style="
            border-color: #11223f;
            opacity: 1;
            max-width: 200px;
            border-width: 4px;
          " />
    </div>
  </div>


  <!-- Info Cards Row -->
  <section class="container">
    <div class="row g-4 justify-content-center">
      <!-- Card 1 -->
      <div class="col-lg-3 col-md-6">
        <div class="card bg-light h-100 border-0 shadow-sm text-center p-4 pt-5 position-relative rounded-3">
          <div
            class="position-absolute top-0 start-50 translate-middle rounded-circle p-3 text-white d-flex align-items-center justify-content-center shadow-sm"
            style="width: 50px; height: 50px">
            <img src="../images/icons/Fov Icon/pound-coin.png" class="me-2" style="width: 70px; height: 70px;">
          </div>
          <h6 class="fw-bold text-uppercase mt-2 mb-2" style="letter-spacing: 0.5px; font-size: 1rem; color: #11223f">
            Available Funding
          </h6>
          <p class="small">Up to £12,000 <br> for one-off grants (approx 14 lakhs)</p>
          <p class="text-muted small mb-0">Up to £20,000 (approx 20 lakhs) <br> over 3 years for ongoing programme
            grants</p>
          <p></p>
        </div>
      </div>

      <!-- Card 2 -->
      <div class="col-lg-3 col-md-6">
        <div
          class="card h-100 border border-secondary border-opacity-25 shadow-sm text-center p-4 pt-5 position-relative bg-white rounded-3">
          <div
            class="position-absolute top-0 start-50 translate-middle rounded-circle p-3 text-white d-flex align-items-center justify-content-center shadow-sm"
            style="width: 50px; height: 50px">
            <img src="../images/icons/Fov Icon/hospitals.png" class="me-2" style="width: 70px; height: 70px;">
          </div>
          <h6 class="fw-bold text-uppercase mt-2 mb-2" style="letter-spacing: 0.5px; font-size: 1rem; color: #11223f">
            Eligible Applicants
          </h6>
          <p class="small">Mission hospitals in the <br>CMC Vellore network</p>
          <p class="text-muted small mb-0">or formally affiliated with CMC, with valid FCRA registration</p>
        </div>
      </div>

      <!-- Card 3 -->
      <div class="col-lg-3 col-md-6">
        <div class="card bg-light h-100 border-0 shadow-sm text-center p-4 pt-5 position-relative rounded-3">
          <div
            class="position-absolute top-0 start-50 translate-middle rounded-circle p-3 text-white d-flex align-items-center justify-content-center shadow-sm"
            style="width: 50px; height: 50px">
            <img src="../images/icons/Fov Icon/app cycle.png" class="me-2" style="width: 70px; height: 70px;">
          </div>
          <h6 class="fw-bold text-uppercase mt-2 mb-2" style="letter-spacing: 0.5px; font-size: 1rem; color: #11223f">
            Application Cycle
          </h6>
          <p class="small">Reviewed twice yearly</p>
          <p class="text-muted small mb-0">April and October</p>
        </div>
      </div>

      <!-- Card 4 -->
      <div class="col-lg-3 col-md-6">
        <div
          class="card h-100 border border-secondary border-opacity-25 shadow-sm text-center p-4 pt-5 position-relative bg-white rounded-3">
          <div
            class="position-absolute top-0 start-50 translate-middle rounded-circle p-3 text-white d-flex align-items-center justify-content-center shadow-sm"
            style="width: 50px; height: 50px">
            <img src="../images/icons/Fov Icon/grant-duration.png" class="me-2" style="width: 70px; height: 70px;">
          </div>
          <h6 class="fw-bold text-uppercase mt-2 mb-2" style="letter-spacing: 0.5px; font-size: 1rem; color: #11223f">
            Grant Duration
          </h6>
          <p class="small">Up to 12 months <br>for one-off grants</p>
          <p class="text-muted small mb-0">Upto 3 years for programme grants</p>
        </div>
      </div>
    </div>
  </section>

  <section class="bg-body-secondary py-5 mt-5">
    <div class="container">
      <div class="row g-4">
        <!-- What We Fund -->
        <div class="col-lg-9">
          <h3 class="text-center fw-bold mb-4" style="color: #11223f;">WHAT WE FUND</h3>
          <div class="row row-cols-2 row-cols-md-3 row-cols-lg-6 g-3">
            <div class="col">
              <div class="navy-card">
                <img src="../images/icons/Fov Icon/medical-equip.png" class="me-2" style="width: 50px; height: 50px;">
                <h6>Medical Equipment</h6>
              </div>
            </div>

            <div class="col">
              <div class="navy-card">
                <img src="../images/icons/Fov Icon/patient-treatment.png" class="me-2"
                  style="width: 50px; height: 50px;">
                <h6>Patient Treatment Support</h6>
              </div>
            </div>

            <div class="col">
              <div class="navy-card">
                <img src="../images/icons/Fov Icon/training.png" class="me-2" style="width: 50px; height: 50px;">
                <h6>Training and Capacity Building</h6>
              </div>
            </div>

            <div class="col">
              <div class="navy-card">
                <img src="../images/icons/Fov Icon/infrastructure.png" class="me-2" style="width: 50px; height: 50px;">
                <h6>Essential Building or Infrastructure works</h6>
              </div>
            </div>

            <div class="col">
              <div class="navy-card">
                <img src="../images/icons/Fov Icon/staffing.png" class="me-2" style="width: 50px; height: 50px;">
                <h6>Pilot Staffing Positions (Max 3 yrs)</h6>
              </div>
            </div>

            <div class="col">
              <div class="navy-card">
                <img src="../images/icons/Fov Icon/environment.png" class="me-2" style="width: 50px; height: 50px;">
                <h6>Environmental and Sustainability Projects</h6>
              </div>
            </div>
          </div>
        </div>

        <!-- We Do Not Fund -->
        <div class="col-lg-3">
          <h3 class="text-center fw-bold mb-4" style="color: #11223f;">
            <i class="fa-solid fa-xmark me-2 text-danger"></i>WE DO NOT FUND
          </h3>
          <div class="not-fund-card">
            <ul>
              <li>Retrospective expenses already incurred</li>
              <li>Routine operational deficits without a sustainability plan</li>
              <li>Capital projects lacking long-term viability</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Blue Decorative Divider Banner -->
  <div class="blue-divider"></div>

  <!-- ================= SECTION 2: READY TO APPLY & SELECTION CRITERIA ================= -->
  <section class="container">
    <div class="row g-4 align-items-center">
      <!-- Ready to Apply -->
      <div class="col-lg-4">
        <h3 class="fw-bold mb-3 border-bottom pb-2 d-inline-block" style="color: #11223f;">
          Ready to apply?
        </h3>
        <ul class="lh-lg ps-3">
          <li class="mb-2">
            <strong>Is your hospital within CMC Vellore's mission network</strong>
            or formally affiliated with CMC Vellore?
          </li>
          <li class="mb-2">
            <strong>Does your hospital hold a valid Foreign Contribution Regulation Act
              (FCRA) registration?</strong>
          </li>
          <li class="mb-2">
            <strong>Does your hospital demonstrate commitment to ethical medical
              practice</strong>, safeguarding, and non-discriminatory patient care?
          </li>
          <li class="mb-2">
            Please ensure that the requested grant falls within the scope
            permitted by FCRA.
          </li>
          <li class="mb-2">Please submit proposal, Buildings/equipment checklist correctly.</li>
        </ul>
        <div class="text-center">
          <button class="btn fw-medium" onclick="openModal('formIO', null, ''); loadFOVGrantForm()"
            style="background-color: #11223f; color: white;"><i class="fa-solid fa-file-lines me-2"></i>Apply for
            Grant</button>
        </div>
      </div>

      <!-- Selection Criteria -->
      <div class="col-lg-8 m-0">
        <div class="circle-container">

          <!-- The Heading Centered -->
          <div class="center-heading-wrap">
            <h3 class="fw-bold mb-0">Selection Criteria</h3>
          </div>

          <!-- Item 1 (Top Center) -->
          <div class="circle-item item-1">
            <div class="creative-glass-card">
              <div class="icon-wrap mb-3">
                <img src="../images/icons/Fov Icon/community.png" alt="Community Impact">
              </div>
              <h6 class="fw-bold mb-2">Community Impact</h6>
              <p class="small mb-0">
                How the project benefits the poor and marginalised communities.
              </p>
            </div>
          </div>

          <!-- Item 2 (Top Right) -->
          <div class="circle-item item-2">
            <div class="creative-glass-card">
              <div class="icon-wrap mb-3">
                <img src="../images/icons/Fov Icon/sustainability.png" alt="Sustainability">
              </div>
              <h6 class="fw-bold mb-2">Sustainability</h6>
              <p class="small mb-0">
                Will the project continue beyond the grant period?
              </p>
            </div>
          </div>

          <!-- Item 3 (Bottom Right) -->
          <div class="circle-item item-3">
            <div class="creative-glass-card">
              <div class="icon-wrap mb-3">
                <img src="../images/icons/Fov Icon/strategic.png" alt="Strategic Alignment">
              </div>
              <h6 class="fw-bold mb-2">Strategic Alignment</h6>
              <p class="small mb-0">
                Alignment with the vision of Friends of Vellore UK and CMC Vellore.
              </p>
            </div>
          </div>

          <!-- Item 4 (Bottom Center) -->
          <div class="circle-item item-4">
            <div class="creative-glass-card">
              <div class="icon-wrap mb-3">
                <img src="../images/icons/Fov Icon/institutional.png" alt="Institutional Capacity">
              </div>
              <h6 class="fw-bold mb-2">Institutional Capacity</h6>
              <p class="small mb-0">
                Leadership, staffing and readiness to deliver
              </p>
            </div>
          </div>

          <!-- Item 5 (Bottom Left) -->
          <div class="circle-item item-5">
            <div class="creative-glass-card">
              <div class="icon-wrap mb-3">
                <img src="../images/icons/Fov Icon/accountability.png" alt="Accountability">
              </div>
              <h6 class="fw-bold mb-2">Accountability</h6>
              <p class="small mb-0">
                Previous reporting quality and responsible use of funds
              </p>
            </div>
          </div>

          <!-- Item 6 (Top Left) -->
          <div class="circle-item item-6">
            <div class="creative-glass-card">
              <div class="icon-wrap mb-3">
                <img src="../images/icons/Fov Icon/fair-distribution.png" alt="Fair Distribution">
              </div>
              <h6 class="fw-bold mb-2">Fair Distribution</h6>
              <p class="small mb-0">
                We aim to support a broad range of hospitals across India
              </p>
            </div>
          </div>

        </div> <!-- End .circle-container -->

        <!-- Disclaimer Text Below -->
        <p class="text-center">
          Submission of an application does not guarantee funding. The Board may decline applications or award
          grants
          at a lower level than requested due to limited funds and broader allocation across hospitals and
          regions.
        </p>

      </div>
    </div>
  </section>

  <hr class="my-5 opacity-25" />

  <!-- ================= SECTION 3: APPLICATION TIMELINE ================= -->
  <section class="container my-5 px-4">
    <h3 class="text-center fw-bold mb-5" style="color: #11223f;">Application Timeline</h3>

    <div class="row g-1 text-center flex-nowrap overflow-auto py-2">
      <div class="col-2 col-lg flex-shrink-0" style="min-width: 140px;">
        <img src="../images/icons/Fov Icon/fag.png" class="img-fluid mb-1" style="max-width: 75px; height: auto;"
          alt="Flag">
      </div>
      <!-- Step 1 -->
      <div class="col-2 col-lg flex-shrink-0" style="min-width: 140px;">
        <div class="timeline-step">
          <img src="../images/icons/Fov Icon/grant-opens.png" class="img-fluid mb-2"
            style="max-width: 50px; height: auto;" alt="Grant Opens">
          <h6 class="fw-bold mb-1 fs-6">Grant Opens</h6>
          <p class="small text-muted mb-0 lh-sm" style="font-size: 1rem;">Applications invited</p>
        </div>
      </div>

      <!-- Divider 1 -->
      <div class="col-auto d-flex justify-content-center align-items-center px-0">
        <div class="arrow-divider"><i class="fa-solid fa-arrow-right fs-5"></i></div>
      </div>

      <!-- Step 2 -->
      <div class="col-2 col-lg flex-shrink-0" style="min-width: 140px;">
        <div class="timeline-step">
          <img src="../images/icons/Fov Icon/submit-application.png" class="img-fluid mb-2"
            style="max-width: 50px; height: auto;" alt="Submit Application">
          <h6 class="fw-bold mb-1 fs-6">Submit Application</h6>
          <p class="small text-muted mb-0 lh-sm" style="font-size: 1rem;">Complete and submit online application
          </p>
        </div>
      </div>

      <!-- Divider 2 -->
      <div class="col-auto d-flex justify-content-center align-items-center px-0">
        <div class="arrow-divider"><i class="fa-solid fa-arrow-right fs-5"></i></div>
      </div>

      <!-- Step 3 -->
      <div class="col-2 col-lg flex-shrink-0" style="min-width: 140px;">
        <div class="timeline-step">
          <img src="../images/icons/Fov Icon/board-review.png" class="img-fluid mb-2"
            style="max-width: 50px; height: auto;" alt="Board Review">
          <h6 class="fw-bold mb-1 fs-6">Board Review</h6>
          <p class="text-muted mb-0 lh-sm" style="font-size: 1rem;">Trustees review proposals</p>
        </div>
      </div>

      <!-- Divider 3 -->
      <div class="col-auto d-flex justify-content-center align-items-center px-0">
        <div class="arrow-divider"><i class="fa-solid fa-arrow-right fs-5"></i></div>
      </div>

      <!-- Step 4 -->
      <div class="col-2 col-lg flex-shrink-0" style="min-width: 140px;">
        <div class="timeline-step">
          <img src="../images/icons/Fov Icon/funding-decision.png" class="img-fluid mb-2"
            style="max-width: 50px; height: auto;" alt="Funding Decision">
          <h6 class="fw-bold mb-1 fs-6">Funding Decision</h6>
          <p class="text-muted mb-0 lh-sm" style="font-size: 1rem;">Decision announced on portal</p>
        </div>
      </div>

      <!-- Divider 4 -->
      <div class="col-auto d-flex justify-content-center align-items-center px-0">
        <div class="arrow-divider"><i class="fa-solid fa-arrow-right fs-5"></i></div>
      </div>

      <!-- Step 5 -->
      <div class="col-2 col-lg flex-shrink-0" style="min-width: 140px;">
        <div class="timeline-step">
          <img src="../images/icons/Fov Icon/grant-award.png" class="img-fluid mb-2"
            style="max-width: 50px; height: auto;" alt="Grant Award">
          <h6 class="fw-bold mb-1 fs-6">Grant Award</h6>
          <p class="text-muted mb-0 lh-sm" style="font-size: 1rem;">Funds transferred upon approval</p>
        </div>
      </div>

      <!-- Divider 5 -->
      <div class="col-auto d-flex justify-content-center align-items-center px-0">
        <div class="arrow-divider"><i class="fa-solid fa-arrow-right fs-5"></i></div>
      </div>

      <!-- Step 6 -->
      <div class="col-2 col-lg flex-shrink-0" style="min-width: 140px;">
        <div class="timeline-step">
          <img src="../images/icons/Fov Icon/progress-report.png" class="img-fluid mb-2"
            style="max-width: 50px; height: auto;" alt="Progress Report">
          <h6 class="fw-bold mb-1 fs-6">Progress Report</h6>
          <p class="text-muted mb-0 lh-sm" style="font-size: 1rem;">Reports at 6 and 12 months</p>
        </div>
      </div>

    </div>
  </section>

  <!-- ================= SECTION 4: APPLICATION PROCESS & DOCUMENTS ================= -->
  <section class="bg-light py-5">
    <div class="container">
      <h3 class="text-center fw-bold mb-5" style="color: #11223f;">Application Process</h3>

      <div class="row g-4 align-items-start">
        <!-- Left: Required Documents -->
        <div class="col-lg-4">
          <div class="doc-card">
            <h5 class="fw-bold text-center mb-1" style="color: #11223f;">Required Documents</h5>
            <div class="text-center mb-3">
              <span style="
                display: inline-block;
                width: 60px;
                height: 2px;
                background-color: var(--accent-gold);
              "></span>
            </div>

            <div class="doc-item">
              <div class="d-flex align-items-center">
                <i class="fa-regular fa-file-lines"></i>
                <span>FCRA Certificate</span>
              </div>
            </div>

            <div class="doc-item">
              <div class="d-flex align-items-center">
                <i class="fa-regular fa-file-lines"></i>
                <span>Supporting Documents and Photos</span>
              </div>
            </div>

            <div class="doc-item">
              <div class="d-flex align-items-center">
                <i class="fa-regular fa-file-lines"></i>
                <span>Building/ Equipment Specifications (If applicable)</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Right: Flowchart Process -->
        <div class="col-lg-8">
          <!-- Top Row Process -->
          <div class="row g-2 align-items-center justify-content-end mb-3">
            <div class="col-md-3">
              <div class="process-box">
                Add the names of your project coordinators. Ensure all of them
                have access to CMCVConnect portal
              </div>
            </div>

            <div class="col-md-1 text-center d-none d-md-block">
              <div class="flow-arrow">
                <i class="fa-solid fa-arrow-right"></i>
              </div>
            </div>

            <div class="col-md-3">
              <div class="process-box">
                You can save the application anytime as draft. Upload all
                necessary documents
              </div>
            </div>

            <div class="col-md-1 text-center d-none d-md-block">
              <div class="flow-arrow">
                <i class="fa-solid fa-arrow-right"></i>
              </div>
            </div>

            <div class="col-md-3">
              <div class="process-box">
                Once you have verified the application, please save and Submit
              </div>
            </div>
          </div>

          <!-- Bottom Row Process (Connected downwards and then left) -->
          <div class="row g-2 align-items-center justify-content-end">
            <div class="col-md-4 text-center mb-2 d-none d-md-block">
              <!-- Down Arrow Connecting Step 3 to Board Review -->
              <div class="flow-arrow my-1">
                <i class="fa-solid fa-arrow-down"></i>
              </div>
            </div>
          </div>

          <div class="row g-2 align-items-center justify-content-end">
            <div class="col-md-3">
              <div class="process-box">
                You will receive intimation by mail/ portal
              </div>
            </div>

            <div class="col-md-1 text-center d-none d-md-block">
              <div class="flow-arrow"><i class="fa-solid fa-arrow-left"></i></div>
            </div>

            <div class="col-md-3">
              <div class="process-box">
                Board will review and may request more information
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="row col-md-9 text-center align-items-baseline mt-4 border p-2 rounded mx-auto">
        <div class="col-md-2">
          <img src="../images/icons/Fov Icon/contact.png" alt="">
        </div>
        <div class="col-md-6">
          <h5 class="fw-bold">Have questions or need assistance?</h5>
          <p>Our team is here to help you through the application process.</p>
        </div>
        <div class="col-md-4">
          <div class="card">
            <div class="card-body">
              <p class="card-text">Ms. Bency - <i class="fa-brands fa-square-whatsapp fs-5"
                  style="color: rgb(38, 213, 108);"></i> 8925396116</p>
              <p class="card-text">Mr. Abishek - <i class="fa-brands fa-square-whatsapp fs-5"
                  style="color: rgb(38, 213, 108);"></i> 9789377354</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
  <section class="text-white p-2 py-4 my-4" style="background-color: #11223f;">
    <div class="container">
      <div class="row align-items-center g-3">
        <div class="col-md-4 text-center">
          <div class="row align-items-center">
            <div class="col-md-6 col-6 text-end">
              <img class="img-fluid rounded"
                src="https://s3.amazonaws.com/img.studenthub.in/CMCVConnect_Portal/Pictures/_91e1f0f1b93c1bec08e007c1c9f54fe9_Pictures.webp"
                alt="FOV Logo" style="width: 100px; height: 100px;">
            </div>
            <div class="col-md-6 col-6 text-start">
              <h3 class="fw-bold"><span class="text-tan">F</span>riends<br> <span class="text-tan">O</span>f
                <br><span class="text-tan">V</span>ellore UK
              </h3>
            </div>
          </div>
        </div>
        <div class="col-md-8">
          <h4 class="fw-bold text-center">Why we do what we do</h4>
          <div class="border rounded p-2 py-4">
            <p>
              <i class="fa-solid fa-star"></i>
              <span>To support healthcare and education in India at CMC Vellore and partner mission
                hospitals.</span>
            </p>
            <p>
              <i class="fa-solid fa-star"></i>
              <span>To assist CMC Vellore and partner institutions in maintaining their Christian character and
                professional standards through financial, professional, networking and prayer support.
              </span>
            </p>
            <p>
              <i class="fa-solid fa-star"></i>
              <span>To give special priority to the needs of the poorest and most excluded patients and
                communities.</span>
            </p>
          </div>
          <div class="text-end mt-2">
            <a href="https://friendsofvellore.org/" class="btn text-white text-decoration-underline"
              target="_blank">Visit
              FOV Website</a>
          </div>
        </div>
      </div>
    </div>
  </section>
</div>`;
  },
"fovAppDashboard": function(data) {
    return `<div class="patient-workspace container-fluid p-0">
    <div class="d-flex d-lg-none align-items-center justify-content-between p-3 bg-white border-bottom z-2">
        <div class="d-flex align-items-center gap-3">
            <i class="fas fa-arrow-left fs-5 pe-pointer text-black" onclick="loadFovGrantsPage();"
                style="cursor:pointer"></i>
            <div>
                <h6 class="mb-0 fw-bold">Applicant Name</h6>
                <small class="text-muted">Welcome to FOV Grants Applicant Dashboard</small>
            </div>
        </div>
        <button class="btn btn-outline-dark btn-sm" type="button" data-bs-toggle="offcanvas"
            data-bs-target="#sidebarOffcanvas" aria-controls="sidebarOffcanvas">
            <i class="fas fa-bars me-1"></i> Menu
        </button>
    </div>

    <div class="row g-0">
        <div class="offcanvas-lg offcanvas-start col-lg-3 col-xl-2 border-end bg-white" tabindex="-1"
            id="sidebarOffcanvas" aria-labelledby="sidebarOffcanvasLabel">

            <div class="offcanvas-header d-lg-none border-bottom">
                <h5 class="offcanvas-title fw-bold" id="sidebarOffcanvasLabel">Navigation</h5>
                <button type="button" class="btn-close text-reset" data-bs-dismiss="offcanvas"
                    data-bs-target="#sidebarOffcanvas" aria-label="Close"></button>
            </div>

            <div class="offcanvas-body patient-sidebar p-3 d-flex flex-column h-100">
                <div class="d-none d-lg-block mb-4">
                    <i class="fas fa-arrow-left fs-5 pe-pointer text-black mb-3" onclick="loadFovGrantsPage();"
                        style="cursor:pointer"></i>
                    <div class="patient-header">
                        <h5 class="fw-bold mb-1">Applicant Name</h5>
                        <small class="text-muted">Welcome to FOV Grants Applicant Dashboard</small>
                    </div>
                </div>

                <div class="nav flex-column gap-2 w-100">
                    <button class="btn sidebar-btn text-start w-100 active" data-page="fovAppDetailsPage"
                        data-bs-dismiss="offcanvas" data-bs-target="#sidebarOffcanvas">
                        <i class="fas fa-file-lines me-2"></i> Application Details
                    </button>
                    <button class="btn sidebar-btn text-start w-100" data-page="fovAppProRepoPage"
                        data-bs-dismiss="offcanvas" data-bs-target="#sidebarOffcanvas">
                        <i class="fas fa-file-arrow-down me-2"></i> Project Reports
                    </button>
                </div>
            </div>
        </div>

        <div class="col-lg-9 col-xl-10 bg-body-tertiary p-3 min-vh-100">
            <div id="fovApplication">
                <div class="card border-0 shadow-sm rounded-3 min-vh-50">
                    <div class="card-header rounded-top">
                        <h5 class="card-title">Applications</h5>
                    </div>
                    <div class="card-body">
                        <div class="tab-content">
                            <div class="container-fluid">
                                <nav class="navbar navbar-light navbar-design">
                                    <div class="collapse navbar-collapse show">
                                        <ul class="nav nav-tabs nav-justified" id="fovTabs">
                                            <li class="active"><a data-toggle="tab" href="#Draft" id="Draft"
                                                    class="fovAppTab">Draft</a></li>
                                            <li><a data-toggle="tab" href="#Submitted" id="Submitted"
                                                    class="fovAppTab">Submitted</a></li>
                                            <li><a data-toggle="tab" href="#Reproposal" id="Reproposal"
                                                    class="fovAppTab">Reproposal</a></li>
                                            <li><a data-toggle="tab" href="#Approved" id="Approved"
                                                    class="fovAppTab">Approved by Msn & FOV</a></li>
                                            <li><a data-toggle="tab" href="#Rejected" id="Rejected"
                                                    class="fovAppTab">Rejected by Msn & FOV</a></li>
                                        </ul>
                                    </div>
                                </nav>
                                <div class="overflow-auto p-3 ">
                                    <table id="fovApplicationTable" class="table table-striped border w-100">
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div id="fovAppProRepo" class="d-none">
                <div class="card border-0 shadow-sm rounded-3 min-vh-50">
                    <div class="card-header bg-nc text-white rounded-top">
                        <h5 class="card-title">Project Reports</h5>
                    </div>
                </div>
            </div>

        </div>
    </div>
</div>`;
  },
"fovAdminDashboard": function(data) {
    return `<div class="patient-workspace container-fluid p-0">
    <div class="d-flex d-lg-none align-items-center justify-content-between p-3 bg-white border-bottom z-2">
        <div class="d-flex align-items-center gap-3">
            <i class="fas fa-arrow-left fs-5 pe-pointer text-black" onclick="loadFovGrantsPage();"
                style="cursor:pointer"></i>
            <div>
                <h6 class="mb-0 fw-bold">Admin Name</h6>
                <small class="text-muted">Welcome to FOV Grants Admin Dashboard</small>
            </div>
        </div>
        <button class="btn btn-outline-dark btn-sm" type="button" data-bs-toggle="offcanvas"
            data-bs-target="#sidebarOffcanvas" aria-controls="sidebarOffcanvas">
            <i class="fas fa-bars me-1"></i> Menu
        </button>
    </div>

    <div class="row g-0">
        <div class="offcanvas-lg offcanvas-start col-lg-3 col-xl-2 border-end bg-white" tabindex="-1"
            id="sidebarOffcanvas" aria-labelledby="sidebarOffcanvasLabel">

            <div class="offcanvas-header d-lg-none border-bottom">
                <h5 class="offcanvas-title fw-bold" id="sidebarOffcanvasLabel">Navigation</h5>
                <button type="button" class="btn-close text-reset" data-bs-dismiss="offcanvas"
                    data-bs-target="#sidebarOffcanvas" aria-label="Close"></button>
            </div>

            <div class="offcanvas-body patient-sidebar p-3 d-flex flex-column h-100">
                <div class="d-none d-lg-block mb-4">
                    <i class="fas fa-arrow-left fs-5 pe-pointer text-black mb-3" onclick="loadFovGrantsPage();"
                        style="cursor:pointer"></i>
                    <div class="patient-header">
                        <h5 class="fw-bold mb-1">Admin Name</h5>
                        <small class="text-muted">Welcome to FOV Grants Admin Dashboard</small>
                    </div>
                </div>

                <div class="nav flex-column gap-2 w-100">
                    <button class="btn sidebar-btn text-start w-100 active" data-page="fovApplicationPage"
                        data-bs-dismiss="offcanvas" data-bs-target="#sidebarOffcanvas">
                        <i class="fas fa-file-lines me-2"></i> Applications
                    </button>
                    <button class="btn sidebar-btn text-start w-100" data-page="fovAppProRepoPage"
                        data-bs-dismiss="offcanvas" data-bs-target="#sidebarOffcanvas">
                        <i class="fas fa-file-arrow-down me-2"></i> Project Reports
                    </button>
                </div>
            </div>
        </div>

        <div class="col-lg-9 col-xl-10 bg-body-tertiary p-3 min-vh-100">
            <div id="fovApplication">
                <div class="card border-0 shadow-sm rounded-3 min-vh-50">
                    <div class="card-header rounded-top">
                        <h5 class="card-title">Applications</h5>
                    </div>
                    <div class="card-body">
                        <div class="tab-content">
                            <div class="container-fluid">
                                <nav class="navbar navbar-light navbar-design">
                                    <div class="collapse navbar-collapse show">
                                        <ul class="nav nav-tabs nav-justified" id="fovTabs">
                                            <li class="active"><a data-toggle="tab" href="#Pending" id="Pending"
                                                    class="fovAppTab">Approved by Msn</a></li>
                                            <li><a data-toggle="tab" href="#Reproposal" id="Reproposal"
                                                    class="fovAppTab">Reproposal</a></li>
                                            <li><a data-toggle="tab" href="#Approved" id="Approved"
                                                    class="fovAppTab">Approved by Msn & FOV</a></li>
                                            <li><a data-toggle="tab" href="#Rejected" id="Rejected"
                                                    class="fovAppTab">Rejected by FOV</a></li>
                                            <li><a data-toggle="tab" href="#All" id="All" class="fovAppTab">All
                                                    Request</a></li>
                                        </ul>
                                    </div>
                                </nav>
                                <div class="overflow-auto p-3 ">
                                    <table id="fovAppStatusTable" class="table table-striped border w-100">
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div id="fovAppProRepo" class="d-none">
                <div class="card border-0 shadow-sm rounded-3 min-vh-50">
                    <div class="card-header rounded-top">
                        <h5 class="card-title">Project Reports</h5>
                    </div>
                </div>
            </div>

        </div>
    </div>
</div>`;
  },
"grants": function(data) {
    return `<div class="bg-white" style="text-align: justify;">
    <section class="section text-center py-5">
        <div class="container align-items-center text-center">
            <h2>Three ways we support healing across India's mission hospitals.</h2>
            <p class="mt-4">
                From general project funding to specialist training and collaborative research<br> — each grant plays a
                different part in strengthening the CMC Vellore mission network
            </p>

            <div class="row mt-5 g-4 align-items-stretch mx-md-5">
                <div class="col-lg-4">
                    <div class="card shadow-sm">
                        <div class="card-body">
                            <h5 class="card-title">FOV Grant</h5>
                            <p class="card-text">Building and Equipment</p>
                        </div>
                    </div>
                </div>
                <div class="col-lg-4">
                    <div class="card shadow-sm">
                        <div class="card-body">
                            <h5 class="card-title">SAM Project</h5>
                            <p class="card-text">Training and Fellowship</p>
                        </div>
                    </div>
                </div>
                <div class="col-lg-4">
                    <div class="card shadow-sm">
                        <div class="card-body">
                            <h5 class="card-title">Research Grant</h5>
                            <p class="card-text">Collaborative Research</p>
                        </div>
                    </div>
                </div>


            </div>

            <div class="container bg-body-tertiary border rounded my-4 py-4">
                <div class="row g-4 align-items-stretch">
                    <div class="col-lg-4">
                        <img src="https://s3.amazonaws.com/img.studenthub.in/CMCVConnect_Portal/Pictures/_14c35b31951e27e451666273066e1a7a_Pictures.jpeg"
                            class="img-fluid rounded" alt="" style="height: 200px; width: 300px; object-fit: cover;">
                    </div>
                    <div class="col-lg-4">
                        <img src="https://s3.amazonaws.com/img.studenthub.in/CMCVConnect_Portal/Pictures/_dbd4682d584a1b6f883735fb3eb2bcb5_Pictures.jpg"
                            class="img-fluid rounded" alt="" style="height: 200px; width: 300px; object-fit: cover;">
                    </div>
                    <div class="col-lg-4">
                        <img src="https://s3.amazonaws.com/img.studenthub.in/CMCVConnect_Portal/Pictures/_1117ce8640abc7432d59a5dd1546bc00_Pictures.jpeg"
                            class="img-fluid rounded" alt="" style="height: 200px; width: 300px; object-fit: cover;">
                    </div>
                </div>
            </div>

            <p class="fw-medium fst-italic">"Every grant we offer is more than funding; it is an investment in
                lives transformed —
                a
                life-saving surgery made
                possible, a young doctor equipped with new skills, a ward rebuilt to serve another generation of
                patients.
                These
                grants strengthen the hands of those who have chosen to serve in the hardest places, ensuring that no
                one is
                turned away for their inability to pay."</p>
        </div>
    </section>


    <section class="bg-primarycolor p-3">
        <div class="container">
            <p class="text-tan">
                Across India's most underserved corners, mission hospitals stand as beacons of hope — often working with
                limited resources, yet unwavering in their commitment to serve the poor and marginalised with dignity
                and
                compassion. In supporting these hospitals, we help sustain a legacy of healing that reaches far beyond
                hospital walls — into families, villages, and communities that would otherwise be forgotten. This is the
                quiet, powerful difference that thoughtful giving can make: turning compassion into lasting care.</p>
        </div>
    </section>

    <section class="section bg-light py-5">
        <div class="container">

            <div class="row g-4 align-items-center">
                <div class="col-lg-6">
                    <img src="https://s3.amazonaws.com/img.studenthub.in/CMCVConnect_Portal/Pictures/_c4febd52c9b3db750ac2d7fba7404366_Pictures.png"
                        class="img-fluid rounded" alt="">
                </div>

                <div class="col-lg-6">
                    <h3 class="text-center mb-4 text-decoration-underline">FRIENDS OF VELLORE</h3>

                    <p>Friends of Vellore UK is a UK-based charity dedicated to bringing hope and healing to poor and
                        marginalised communities across India, working hand in hand with Christian Medical College
                        Vellore and its network of mission hospitals.</p>
                    <p>Rooted in compassion and inspired by Christ's example, we believe that quality healthcare should
                        never depend on a person's ability to pay or their faith. Through our grants, we support
                        hospitals striving to reach the most vulnerable — funding equipment, treatment, training, and
                        vital infrastructure that transform lives on the ground.</p>
                    <p>We warmly welcome applications from mission hospitals within the CMC Vellore family who share
                        this vision of compassionate, accessible care. Together, we can extend the reach of healing to
                        those who need it most.</p>
                </div>
            </div>
            <div class="text-end pt-2">
                <button class="btn btn-dark" onclick="navigateTo('fovGrants', ' ', ['loadFovGrantsPage']);">View
                    Grant</button>
            </div>
        </div>
    </section>

    <!-- ================= Mission Sabbatical ================= -->
    <section class="section py-5">
        <div class="container">

            <div class="row g-4 align-items-center">

                <div class="col-lg-6">
                    <h3 class="text-center mb-4 text-decoration-underline">SAM PROJECT</h3>

                    <p>The Dr Sunil Agarwal Memorial Fellowship, established by the MBBS Batch of 1978 in loving memory
                        of their classmate, Dr Sunil Agarwal, offers dedicated health professionals from mission and NGO
                        hospitals in underserved areas of India the opportunity to spend two to four weeks at CMC
                        Vellore for focused training and reskilling
                    </p>
                    <p>Named after a doctor who devoted his life to training and supporting colleagues at mission
                        hospitals — and who tragically lost his life while travelling to one such outreach programme —
                        this fellowship carries forward his spirit of service and mentorship. The grant covers
                        accommodation and meals at CMC Vellore, allowing Fellows to immerse themselves fully in learning
                        without financial worry.</p>
                    <p> We warmly invite staff of mission and NGO hospitals with a long-term commitment to underserved
                        communities to apply and be part of this legacy of learning and service.</p>

                </div>

                <div class="col-lg-6">
                    <img src="https://s3.amazonaws.com/img.studenthub.in/CMCVConnect_Portal/Pictures/_2860b01028a209d654071296332dab5e_Pictures.jpeg"
                        class="img-fluid rounded" alt="">
                </div>
            </div>
            <div class="text-end">
                <button class="btn btn-dark mt-2" onclick="navigateTo('samGrants', {}, [' ']);">View Grant</button>
            </div>
        </div>
    </section>

    <section class="section bg-light py-5">
        <div class="container">

            <div class="row g-4 align-items-center">
                <div class="col-lg-6">
                    <img src="https://s3.amazonaws.com/img.studenthub.in/CMCVConnect_Portal/Pictures/_f00666388ecfdb51a4435d3a61b3e96b_Pictures.png"
                        class="img-fluid rounded" alt="">
                </div>

                <div class="col-lg-6">
                    <h3 class="text-center mb-4 text-decoration-underline ">RESEARCH GRANT</h3>

                    <p>Welcome to the CMC Vellore Mission Network Collaborative Research Grant, a funding initiative of
                        Christian Medical College (CMC), Vellore, designed to strengthen collaborative research across
                        the CMC Vellore Mission Network.
                    </p>
                    <p>This grant aims to foster meaningful partnerships between CMC Vellore faculty and Mission Network
                        Hospitals, enabling high-quality research that addresses locally relevant health priorities. By
                        supporting field-based, epidemiological, clinical, and translational research, the programme
                        seeks to build research capacity, encourage multidisciplinary collaboration, and generate
                        evidence that improves patient care and public health.</p>
                    <p>Through this initiative, CMC Vellore reaffirms its commitment to advancing excellence in research
                        while strengthening the shared mission of service, innovation, and academic collaboration.</p>
                    <p>We look forward to your participation in building a vibrant and impactful research network.</p>
                </div>
            </div>
            <div class="text-end pt-2">
                <button class="btn btn-dark" onclick="navigateTo('research', {}, ['loadResearchCards', []]);">View
                    Grant</button>
            </div>
        </div>
    </section>
</div>`;
  },
"samGrants": function(data) {
    return `<!-- ============ HERO ============ -->
<section class="sam-hero-section">
  <div class="container">
    <h1 class="sam-hero-title">
      Dr. <span class="sam-letter">S</span>unil <span class="sam-letter">A</span>garwal <span class="sam-letter">M</span>emorial Project
      <br class="d-none d-md-inline" />
      for Mission Hospitals
    </h1>
    <p class="sam-hero-sub">
      &mdash; Established by the MBBS Alumni Batch of 1978, in partnership with the Missions Office, CMC Vellore.
    </p>
    <p class="sam-hero-lead">
      The Dr Sunil Agarwal Memorial Fellowship sends mission and NGO hospital staff to CMC Vellore for focused
      re&#8209;skilling &mdash; carrying forward the work of a doctor who gave his life travelling to train others.
    </p>
    <div class="d-flex flex-column flex-sm-row justify-content-center gap-3 mt-4">
      <a href="https://s3.amazonaws.com/img.studenthub.in/CMCVConnect_Portal/FovGuidelines/_2c2539e39c0553ca4c9926d35b9e4d20_FovGuidelines.pdf" class="btn sam-btn-outline btn-lg">
        <i class="fa-solid fa-file-arrow-down me-2" aria-hidden="true"></i>Download Guidelines
      </a>
      <a onclick="openModal('formIO', null, ''); samProjectApplication()" href="#" class="btn sam-btn-gold btn-lg">
        Apply For Grant <i class="fa-solid fa-arrow-right ms-2" aria-hidden="true"></i>
      </a>
    </div>

    <!-- Dashboard entry points — hidden until loadSamGrantsPage() (called
         on page load, mirroring loadFovGrantsPage()) decides who should see
         which one: Applicant Dashboard appears once the signed-in user has
         at least one SAM application on file, Admin Dashboard appears for
         SAM_ADMIN_ROLES users. See samDashboard.formLoad.additions.js. -->
    <div class="d-flex flex-wrap justify-content-center gap-2 mt-3">
      <button id="samAppDashboardBtn"
        onclick="navigateTo('samAppDashboard', null, [['loadSamAppDashboard',[]], ['loadSamApplication',['Draft']]])"
        class="btn sam-btn-outline d-none">
        <i class="fa-regular fa-window-restore me-2" aria-hidden="true"></i>Applicant Dashboard
      </button>
      <button id="samAdminDashboardBtn"
        onclick="navigateTo('samAdminDashboard', null, [['loadSamAdminDashboard',[]], ['loadSamAppStatusTable',['Submitted']]])"
        class="btn sam-btn-gold d-none">
        <i class="fa-solid fa-tachograph-digital me-2" aria-hidden="true"></i>Admin Dashboard
      </button>
    </div>
  </div>

  <div class="sam-hero-image-wrap">
    <img
      src="https://s3.amazonaws.com/img.studenthub.in/CMCVConnect_Portal/Pictures/_b32f2144ef1096520a9d4148ff8df0ca_Pictures.jpeg"
      class="sam-hero-image rounded"
      alt="Mission hospital staff training at CMC Vellore"
      loading="lazy"
    />
  </div>
</section>

<!-- ============ PROJECT STATS ============ -->
<section class="sam-stats">
  <div class="container">
    <div class="row text-center g-4">
      <div class="col-12 col-md-4">
        <div class="sam-stat-card">
          <div class="sam-stat-icon"><i class="fa-solid fa-bed" aria-hidden="true"></i></div>
          <h6>Grant Covers</h6>
          <p>Stay and meals</p>
        </div>
      </div>
      <div class="col-12 col-md-4">
        <div class="sam-stat-card">
          <div class="sam-stat-icon"><i class="fa-solid fa-calendar-days" aria-hidden="true"></i></div>
          <h6>Duration</h6>
          <p>1&ndash;4 weeks</p>
        </div>
      </div>
      <div class="col-12 col-md-4">
        <div class="sam-stat-card">
          <div class="sam-stat-icon"><i class="fa-solid fa-hourglass-half" aria-hidden="true"></i></div>
          <h6>Applications Close</h6>
          <p>31st May 2026</p>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- ============ MEMORIAL ============ -->
<section class="sam-memorial">
  <div class="container">
    <div class="row align-items-center g-5">
      <div class="col-12 col-md-5">
        <img
          src="https://s3.amazonaws.com/img.studenthub.in/CMCVConnect_Portal/Pictures/_ae6b467e3ecc5fb1953b6f683eb88ab3_Pictures.avif"
          alt="Dr. Sunil Agarwal"
          loading="lazy"
        />
        <h4 class="sam-quote mt-4">&ldquo;He didn&rsquo;t wait for people to come to him. He went to where the need was.&rdquo;</h4>
      </div>
      <div class="col-12 col-md-7">
        <h3>In memory of a doctor who never stopped teaching.</h3>
        <hr class="sam-hr" />
        <p>
          Dr Sunil Agarwal trained countless mission hospital doctors at CMC Vellore &mdash; and often travelled
          himself to distant hospitals to teach on-site. It was on the way to one such programme, on 4 February
          2020, that he lost his life in a road accident.
        </p>
        <p>
          His MBBS batch of 1978 created this fellowship so his way of teaching&mdash;patient, hands-on, and
          willing to go the distance&mdash;would continue through others.
        </p>
      </div>
    </div>
  </div>
</section>

<!-- ============ FELLOWSHIP BENEFITS ============ -->
<section class="sam-benefits">
  <div class="container">
    <div class="row align-items-center g-5 flex-md-row-reverse">
      <div class="col-12 col-md-5">
        <img
          src="https://s3.amazonaws.com/img.studenthub.in/CMCVConnect_Portal/Pictures/_04fb610a0b33a22fa1e3820398bd698a_Pictures.avif"
          alt="Fellow training at CMC Vellore"
          loading="lazy"
        />
      </div>
      <div class="col-12 col-md-7">
        <p class="sam-eyebrow-maroon">What the Fellowship Offers</p>
        <h3>Room to learn, without the worry of cost.</h3>
        <p>
          Selected Fellows spend two to four weeks embedded in a CMC Vellore department that matches their
          hospital&rsquo;s real needs &mdash; set individually by the Missions Office, not off a fixed curriculum.
        </p>
        <p>
          Accommodation and meals in Vellore are fully covered. Training fees are rarely charged to mission
          hospitals; where they are, the Grant Committee negotiates directly with the department.
        </p>
        <p class="sam-note">*Travel to and from the home hospital is not included and is expected to be arranged separately.</p>
      </div>
    </div>

    <div class="row g-3 mt-2 sam-benefit-chips">
      <div class="col-12 col-md-4">
        <div class="sam-chip">
          <i class="fa-solid fa-house-chimney" aria-hidden="true"></i>
          <span>Accommodation &amp; meals covered</span>
        </div>
      </div>
      <div class="col-12 col-md-4">
        <div class="sam-chip">
          <i class="fa-solid fa-hand-holding-dollar" aria-hidden="true"></i>
          <span>Training fees waived or negotiated</span>
        </div>
      </div>
      <div class="col-12 col-md-4">
        <div class="sam-chip">
          <i class="fa-solid fa-map-location-dot" aria-hidden="true"></i>
          <span>Placement matched to your hospital&rsquo;s needs</span>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- ============ ELIGIBILITY ============ -->
<section class="sam-eligibility">
  <div class="container">
    <div class="row align-items-start g-5">
      <div class="col-12 col-md-5">
        <p class="sam-eyebrow-maroon">Eligibility</p>
        <h3>Who can apply?</h3>
        <p class="text-muted mb-0">
          The Fellowship is open to permanent mission hospital staff who intend to keep serving where they are.
        </p>
      </div>
      <div class="col-12 col-md-7">
        <ul class="sam-check-list">
          <li>
            <i class="fa-solid fa-circle-check" aria-hidden="true"></i>
            <span>A permanent employee of a Mission hospital or NGO associated with CMC Vellore, situated in an underserved area.</span>
          </li>
          <li>
            <i class="fa-solid fa-circle-check" aria-hidden="true"></i>
            <span>Doctors, nurses, and allied health workers with medical training are all eligible.</span>
          </li>
          <li>
            <i class="fa-solid fa-circle-check" aria-hidden="true"></i>
            <span>At least two years of service at the mission hospital prior to applying.</span>
          </li>
          <li>
            <i class="fa-solid fa-circle-check" aria-hidden="true"></i>
            <span>A demonstrated long-term commitment to continue serving at the mission hospital.</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</section>

<!-- ============ APPLICATION INFO ============ -->
<section class="sam-application-info">
  <div class="container">
    <div class="text-center mb-5">
      <p class="sam-eyebrow-maroon">Application Information</p>
      <h3>How the cycle works, and what&rsquo;s covered</h3>
    </div>

    <div class="row g-4">
      <div class="col-12 col-md-6">
        <div class="sam-info-card">
          <div class="sam-info-card-head">
            <i class="fa-solid fa-rotate" aria-hidden="true"></i>
            <h5>Application Cycle</h5>
          </div>
          <ul>
            <li>Advertised each January on the CMC V Connect Portal and through partner networks &mdash; CMAI, CHAI, EMFI and EHA.</li>
            <li>Applications close three months later, and awards are announced by 15th May.</li>
            <li>The grant may be used any time within the award year.</li>
          </ul>
        </div>
      </div>
      <div class="col-12 col-md-6">
        <div class="sam-info-card">
          <div class="sam-info-card-head">
            <i class="fa-solid fa-clipboard-check" aria-hidden="true"></i>
            <h5>Duration &amp; Coverage</h5>
          </div>
          <ul>
            <li>Two to four weeks, set individually based on the training need identified.</li>
            <li>Accommodation and meals at CMC Vellore for the full duration of stay.</li>
          </ul>
        </div>
      </div>
    </div>

    <div class="row g-4 mt-1">
      <div class="col-12 col-md-6">
        <div class="sam-coverage-card sam-coverage-yes">
          <h6><i class="fa-solid fa-circle-check me-2" aria-hidden="true"></i>What&rsquo;s Covered</h6>
          <p class="mb-0">Accommodation and meals at CMC Vellore for the full duration of training; training fees are rarely charged, and where they are, the Grant Committee negotiates directly with the department.</p>
        </div>
      </div>
      <div class="col-12 col-md-6">
        <div class="sam-coverage-card sam-coverage-no">
          <h6><i class="fa-solid fa-circle-xmark me-2" aria-hidden="true"></i>What&rsquo;s Not Covered</h6>
          <p class="mb-0">Travel to and from the home hospital &mdash; this is expected to be arranged separately.</p>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- ============ DOCUMENTS ============ -->
<section class="sam-documents">
  <div class="container">
    <div class="text-center mb-5">
      <p class="sam-eyebrow-maroon">Before You Apply</p>
      <h3>Documents to have ready</h3>
    </div>

    <div class="row g-4">
      <div class="col-12 col-md-6 col-lg-3">
        <div class="sam-doc-card">
          <i class="fa-solid fa-users" aria-hidden="true"></i>
          <h6>Two References</h6>
          <p>From the institution head/senior colleague and another colleague.</p>
        </div>
      </div>
      <div class="col-12 col-md-6 col-lg-3">
        <div class="sam-doc-card">
          <i class="fa-solid fa-file-lines" aria-hidden="true"></i>
          <h6>Visitor-Observer Application</h6>
          <p>CMC Vellore format with required certificates and health declaration.</p>
        </div>
      </div>
      <div class="col-12 col-md-6 col-lg-3">
        <div class="sam-doc-card">
          <i class="fa-solid fa-file-signature" aria-hidden="true"></i>
          <h6>Leave Sanction Letter</h6>
          <p>Confirming approved leave for the training period.</p>
        </div>
      </div>
      <div class="col-12 col-md-6 col-lg-3">
        <div class="sam-doc-card">
          <i class="fa-solid fa-notes-medical" aria-hidden="true"></i>
          <h6>Medical Fitness Certificate</h6>
          <p>Confirming fitness to travel and attend the programme.</p>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- ============ APPLICATION TIMELINE ============ -->
<section class="sam-timeline">
  <div class="container">
    <div class="text-center mb-5">
      <h3></h3>
      <p class="sam-timeline-lead">The cycle runs once a year, giving hospitals time to plan around it.</p>
    </div>

    <div class="row g-4 sam-step-row">
      <div class="col-6 col-md-4 col-lg-2 sam-step">
        <div class="sam-step-circle"><i class="fa-solid fa-bullhorn" aria-hidden="true"></i><span class="sam-step-num">1</span></div>
        <h6>Call Opens</h6>
        <p>Advertised via CMC Vellore&rsquo;s website and partner networks.</p>
      </div>
      <div class="col-6 col-md-4 col-lg-2 sam-step">
        <div class="sam-step-circle"><i class="fa-solid fa-file-signature" aria-hidden="true"></i><span class="sam-step-num">2</span></div>
        <h6>Apply</h6>
        <p>Submit the form with two references and required certificates before the closing date.</p>
      </div>
      <div class="col-6 col-md-4 col-lg-2 sam-step">
        <div class="sam-step-circle"><i class="fa-solid fa-magnifying-glass" aria-hidden="true"></i><span class="sam-step-num">3</span></div>
        <h6>Screening</h6>
        <p>A committee with the Associate Director, Missions, and FOV UK reviews the application.</p>
      </div>
      <div class="col-6 col-md-4 col-lg-2 sam-step">
        <div class="sam-step-circle"><i class="fa-solid fa-award" aria-hidden="true"></i><span class="sam-step-num">4</span></div>
        <h6>Award</h6>
        <p>Results are announced by 15th May. A tailored training plan is prepared for you.</p>
      </div>
      <div class="col-6 col-md-4 col-lg-2 sam-step">
        <div class="sam-step-circle"><i class="fa-solid fa-graduation-cap" aria-hidden="true"></i><span class="sam-step-num">5</span></div>
        <h6>Train at CMC</h6>
        <p>Two to four weeks of re-skilling, with accommodation and meals arranged.</p>
      </div>
      <div class="col-6 col-md-4 col-lg-2 sam-step">
        <div class="sam-step-circle"><i class="fa-solid fa-handshake-angle" aria-hidden="true"></i><span class="sam-step-num">6</span></div>
        <h6>Return &amp; Report</h6>
        <p>Fellows return to their hospital and share what they learned with their team.</p>
      </div>
    </div>
  </div>
</section>

<!-- ============ FINAL CTA ============ -->
<section class="sam-final-cta">
  <div class="container text-center">
    <h3>Ready to Apply?</h3>
    <p>Two to four weeks at CMC Vellore, fully arranged &mdash; the next call closes 31st May 2026.</p>
    <div class="d-flex flex-column flex-sm-row justify-content-center gap-3 mt-4">
      <a href="https://s3.amazonaws.com/img.studenthub.in/CMCVConnect_Portal/FovGuidelines/_2c2539e39c0553ca4c9926d35b9e4d20_FovGuidelines.pdf" class="btn btn-primary btn-lg d-inline-block w-auto sam-btn-outline">
        <i class="fa-solid fa-file-arrow-down me-2" aria-hidden="true"></i>Download Guidelines
      </a>
      <a onclick="openModal('formIO', null, ''); samProjectApplication()" href="#" class="btn sam-btn-gold btn-lg">
        Apply For Grant <i class="fa-solid fa-arrow-right ms-2" aria-hidden="true"></i>
      </a>
    </div>
  </div>
</section>`;
  },
"samAppDashboard": function(data) {
    return `<!-- SAM Project — Applicant Dashboard
     Mirrors the structure/classes of FOV Grants' fovAppDashboard.html
     (same .patient-workspace / offcanvas sidebar / nav-tabs / DataTable
     pattern) so it behaves identically for users already familiar with
     that module — only the labels, tabs and colors are SAM's own. -->
<div class="patient-workspace container-fluid p-0">
    <div class="d-flex d-lg-none align-items-center justify-content-between p-3 bg-white border-bottom z-2">
        <div class="d-flex align-items-center gap-3">
            <i class="fas fa-arrow-left fs-5 pe-pointer text-black" onclick="navigateTo('samGrants', null, ['loadSamGrantsPage']);"
                style="cursor:pointer"></i>
            <div>
                <h6 class="mb-0 fw-bold">Applicant Name</h6>
                <small class="text-muted">Welcome to SAM Project Applicant Dashboard</small>
            </div>
        </div>
        <button class="btn btn-outline-dark btn-sm" type="button" data-bs-toggle="offcanvas"
            data-bs-target="#samSidebarOffcanvas" aria-controls="samSidebarOffcanvas">
            <i class="fas fa-bars me-1"></i> Menu
        </button>
    </div>

    <div class="row g-0">
        <div class="offcanvas-lg offcanvas-start col-lg-3 col-xl-2 border-end bg-white" tabindex="-1"
            id="samSidebarOffcanvas" aria-labelledby="samSidebarOffcanvasLabel">

            <div class="offcanvas-header d-lg-none border-bottom">
                <h5 class="offcanvas-title fw-bold" id="samSidebarOffcanvasLabel">Navigation</h5>
                <button type="button" class="btn-close text-reset" data-bs-dismiss="offcanvas"
                    data-bs-target="#samSidebarOffcanvas" aria-label="Close"></button>
            </div>

            <div class="offcanvas-body patient-sidebar p-3 d-flex flex-column h-100">
                <div class="d-none d-lg-block mb-4">
                    <i class="fas fa-arrow-left fs-5 pe-pointer text-black mb-3" onclick="navigateTo('samGrants', null, ['loadSamGrantsPage']);"
                        style="cursor:pointer"></i>
                    <div class="patient-header">
                        <h5 class="fw-bold mb-1">Applicant Name</h5>
                        <small class="text-muted">Welcome to SAM Project Applicant Dashboard</small>
                    </div>
                </div>

                <div class="nav flex-column gap-2 w-100">
                    <button class="btn sidebar-btn text-start w-100 active sam-sidebar-btn" data-page="samAppDetailsPage"
                        data-bs-dismiss="offcanvas" data-bs-target="#samSidebarOffcanvas">
                        <i class="fas fa-file-lines me-2"></i> Application Details
                    </button>
                    <button class="btn sidebar-btn text-start w-100 sam-sidebar-btn" data-page="samAppReportPage"
                        data-bs-dismiss="offcanvas" data-bs-target="#samSidebarOffcanvas">
                        <i class="fas fa-file-circle-check me-2"></i> Training Report
                    </button>
                </div>
            </div>
        </div>

        <div class="col-lg-9 col-xl-10 bg-body-tertiary p-3 min-vh-100">
            <div id="samApplication">
                <div class="card border-0 shadow-sm rounded-3 min-vh-50">
                    <div class="card-header rounded-top sam-card-header">
                        <h5 class="card-title mb-0">My Application</h5>
                    </div>
                    <div class="card-body">
                        <div class="tab-content">
                            <div class="container-fluid">
                                <nav class="navbar navbar-light navbar-design">
                                    <div class="collapse navbar-collapse show">
                                        <ul class="nav nav-tabs nav-justified" id="samTabs">
                                            <li class="active"><a data-toggle="tab" href="#Draft" id="Draft"
                                                    class="samAppTab">Draft</a></li>
                                            <li><a data-toggle="tab" href="#Submitted" id="Submitted"
                                                    class="samAppTab">Submitted</a></li>
                                            <li><a data-toggle="tab" href="#UnderReview" id="UnderReview"
                                                    class="samAppTab">Under Review</a></li>
                                            <li><a data-toggle="tab" href="#Approved" id="Approved"
                                                    class="samAppTab">Approved</a></li>
                                            <li><a data-toggle="tab" href="#Rejected" id="Rejected"
                                                    class="samAppTab">Rejected</a></li>
                                        </ul>
                                    </div>
                                </nav>
                                <div class="overflow-auto p-3">
                                    <table id="samApplicationTable" class="table table-striped border w-100">
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div id="samAppReport" class="d-none">
                <div class="card border-0 shadow-sm rounded-3 min-vh-50">
                    <div class="card-header rounded-top sam-card-header d-flex justify-content-between align-items-center">
                        <h5 class="card-title mb-0">Training Report</h5>
                        <button type="button" class="btn sam-btn-gold btn-sm" id="samNewReportBtn"
                            onclick="openModal('formIO', null, ''); loadSamTrainingReportForm();">
                            <i class="fa-solid fa-file-pen me-1"></i> Submit Training Report
                        </button>
                    </div>
                    <div class="card-body">
                        <p class="text-muted small mb-3">
                            Available once your application has been Approved and your training at CMC Vellore is
                            complete. Reports you've already sent in are listed below.
                        </p>
                        <div class="overflow-auto p-3">
                            <table id="samReportTable" class="table table-striped border w-100">
                            </table>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    </div>
</div>
`;
  },
"samAdminDashboard": function(data) {
    return `<!-- SAM Project — Admin (Grant Committee) Dashboard
     Mirrors fovAdminDashboard.html's structure/classes; content and tabs
     are SAM's own single-stage review workflow (no Mission+FOV two-tier
     approval — see fovAdminDashboard.html for that variant). -->
<div class="patient-workspace container-fluid p-0">
    <div class="d-flex d-lg-none align-items-center justify-content-between p-3 bg-white border-bottom z-2">
        <div class="d-flex align-items-center gap-3">
            <i class="fas fa-arrow-left fs-5 pe-pointer text-black" onclick="navigateTo('samGrants', null, ['loadSamGrantsPage']);"
                style="cursor:pointer"></i>
            <div>
                <h6 class="mb-0 fw-bold">Admin Name</h6>
                <small class="text-muted">Welcome to SAM Project Admin Dashboard</small>
            </div>
        </div>
        <button class="btn btn-outline-dark btn-sm" type="button" data-bs-toggle="offcanvas"
            data-bs-target="#samAdminSidebarOffcanvas" aria-controls="samAdminSidebarOffcanvas">
            <i class="fas fa-bars me-1"></i> Menu
        </button>
    </div>

    <div class="row g-0">
        <div class="offcanvas-lg offcanvas-start col-lg-3 col-xl-2 border-end bg-white" tabindex="-1"
            id="samAdminSidebarOffcanvas" aria-labelledby="samAdminSidebarOffcanvasLabel">

            <div class="offcanvas-header d-lg-none border-bottom">
                <h5 class="offcanvas-title fw-bold" id="samAdminSidebarOffcanvasLabel">Navigation</h5>
                <button type="button" class="btn-close text-reset" data-bs-dismiss="offcanvas"
                    data-bs-target="#samAdminSidebarOffcanvas" aria-label="Close"></button>
            </div>

            <div class="offcanvas-body patient-sidebar p-3 d-flex flex-column h-100">
                <div class="d-none d-lg-block mb-4">
                    <i class="fas fa-arrow-left fs-5 pe-pointer text-black mb-3" onclick="navigateTo('samGrants', null, ['loadSamGrantsPage']);"
                        style="cursor:pointer"></i>
                    <div class="patient-header">
                        <h5 class="fw-bold mb-1">Admin Name</h5>
                        <small class="text-muted">Welcome to SAM Project Admin Dashboard</small>
                    </div>
                </div>

                <div class="nav flex-column gap-2 w-100">
                    <button class="btn sidebar-btn text-start w-100 active sam-sidebar-btn" data-page="samApplicationPage"
                        data-bs-dismiss="offcanvas" data-bs-target="#samAdminSidebarOffcanvas">
                        <i class="fas fa-file-lines me-2"></i> Applications
                    </button>
                    <button class="btn sidebar-btn text-start w-100 sam-sidebar-btn" data-page="samReportsPage"
                        data-bs-dismiss="offcanvas" data-bs-target="#samAdminSidebarOffcanvas">
                        <i class="fas fa-file-circle-check me-2"></i> Training Reports
                    </button>
                </div>
            </div>
        </div>

        <div class="col-lg-9 col-xl-10 bg-body-tertiary p-3 min-vh-100">
            <div id="samApplication">
                <div class="card border-0 shadow-sm rounded-3 min-vh-50">
                    <div class="card-header rounded-top sam-card-header">
                        <h5 class="card-title mb-0">Applications</h5>
                    </div>
                    <div class="card-body">
                        <div class="tab-content">
                            <div class="container-fluid">
                                <nav class="navbar navbar-light navbar-design">
                                    <div class="collapse navbar-collapse show">
                                        <ul class="nav nav-tabs nav-justified" id="samTabs">
                                            <li class="active"><a data-toggle="tab" href="#Submitted" id="Submitted"
                                                    class="samAppTab">Submitted</a></li>
                                            <li><a data-toggle="tab" href="#UnderReview" id="UnderReview"
                                                    class="samAppTab">Under Review</a></li>
                                            <li><a data-toggle="tab" href="#Approved" id="Approved"
                                                    class="samAppTab">Approved</a></li>
                                            <li><a data-toggle="tab" href="#Rejected" id="Rejected"
                                                    class="samAppTab">Rejected</a></li>
                                            <li><a data-toggle="tab" href="#All" id="All" class="samAppTab">All
                                                    Applications</a></li>
                                        </ul>
                                    </div>
                                </nav>
                                <div class="overflow-auto p-3">
                                    <table id="samAppStatusTable" class="table table-striped border w-100">
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div id="samAppReport" class="d-none">
                <div class="card border-0 shadow-sm rounded-3 min-vh-50">
                    <div class="card-header rounded-top sam-card-header">
                        <h5 class="card-title mb-0">Training Reports</h5>
                    </div>
                    <div class="card-body">
                        <div class="overflow-auto p-3">
                            <table id="samReportStatusTable" class="table table-striped border w-100">
                            </table>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    </div>
</div>
`;
  },
"guidePage": function(data) {
    return `<div class="fadeIn-up container-fluid bg-white pb-5">

    <!-- ================= HEADER ================= -->

    <div class="position-relative">

        <h2 class="text-center bg-white p-3 rounded msnHospTitle connect-primary-border">
            User Guide
        </h2>

    </div>


    <!-- ================= INTRO ================= -->

    <div class="row justify-content-center">

        <div class="col-12 col-xl-9 text-center mb-4">

            <h3 class="connect-text-darkblue fw-bold">
                Explore CMC V Connect
            </h3>

            <p class="text-muted mb-0">
                Discover what each module offers, how it helps mission hospitals,
                and how to get started.
            </p>

        </div>

    </div>


    <!-- ================= QUICK NAVIGATION ================= -->

    <div class="guide-navigation mb-5">

        <a href="#mms-section" class="guide-nav-item">
            <span>🏥</span>
            <span>Mission Service</span>
        </a>

        <a href="#main-modules" class="guide-nav-item">
            <span>📦</span>
            <span>Main Modules</span>
        </a>

        <a href="#support-section" class="guide-nav-item">
            <span>💬</span>
            <span>Support</span>
        </a>

    </div>


    <!-- ========================================================= -->
    <!-- MANDATORY MISSION SERVICE -->
    <!-- ========================================================= -->

    <section id="mms-section" class="guide-section">

        <div class="guide-section-heading">

            <div class="guide-section-icon">
                🏥
            </div>

            <div>

                <h4 class="connect-text-darkblue mb-1">
                    Mandatory Mission Service
                </h4>

                <p class="text-muted mb-0">
                    Manage your Mandatory Mission Service activities
                    through CMC V Connect.
                </p>

            </div>

        </div>


        <div class="row g-4">


            <!-- MMS APPLICATION -->

            <div class="col-12 col-md-6 col-lg-4">

                <article class="module-card module-card-active">

                    <div class="module-card-top">

                        <div class="module-icon">
                            📝
                        </div>

                        <span class="module-status active">
                            Available
                        </span>

                    </div>


                    <h5>
                        MMS Application
                    </h5>


                    <p class="module-description">

                        Start and manage a Mandatory Mission Service
                        application from your MMS dashboard.

                    </p>


                    <div class="module-features">

                        <span>✓ MMS Dashboard</span>
                        <span>✓ Application</span>
                        <span>✓ Application Tracking</span>

                    </div>


                    <div class="module-actions">

                        <button type="button"
                                class="btn guide-primary-btn"
                                onclick="openGuideDemo('mms-open')">

                            Show me how

                            <span>→</span>

                        </button>

                    </div>

                </article>

            </div>


            <!-- UPLOAD CERTIFICATE -->

            <div class="col-12 col-md-6 col-lg-4">

                <article class="module-card module-card-disabled">

                    <div class="module-card-top">

                        <div class="module-icon">
                            📤
                        </div>

                        <span class="module-status coming">
                            Coming Soon
                        </span>

                    </div>


                    <h5>
                        Upload Certificate
                    </h5>


                    <p class="module-description">

                        Upload your Indemnity Certificate against
                        an approved MMS visit.

                    </p>


                    <div class="module-features">

                        <span>• Certificate Upload</span>
                        <span>• MMS Visit</span>
                        <span>• Document Management</span>

                    </div>


                    <div class="module-actions">

                        <button type="button"
                                class="btn btn-outline-secondary"
                                disabled>

                            Coming Soon

                        </button>

                    </div>

                </article>

            </div>

        </div>

    </section>



    <!-- ========================================================= -->
    <!-- MAIN MODULES -->
    <!-- ========================================================= -->

    <section id="main-modules"
             class="guide-section mt-5">


        <div class="guide-section-heading">

            <div class="guide-section-icon">
                🧩
            </div>

            <div>

                <h4 class="connect-text-darkblue mb-1">
                    Explore Modules
                </h4>

                <p class="text-muted mb-0">
                    Access different services and resources available
                    through CMC V Connect.
                </p>

            </div>

        </div>


        <div class="row g-4">


            <!-- MISSION VISITS -->

            <div class="col-12 col-sm-6 col-lg-4 col-xl-3">

                <article class="module-card module-card-disabled">

                    <div class="module-card-top">

                        <div class="module-icon">
                            ✈️
                        </div>

                        <span class="module-status coming">
                            Coming Soon
                        </span>

                    </div>

                    <h5>
                        Mission Visits
                    </h5>

                    <p class="module-description">
                        Track manpower requests and mission visit status.
                    </p>

                    <div class="module-features">
                        <span>• Visit Tracking</span>
                        <span>• Manpower Requests</span>
                    </div>

                    <button class="btn btn-outline-secondary w-100 mt-auto"
                            disabled>
                        Coming Soon
                    </button>

                </article>

            </div>


            <!-- MISSION SABBATICAL -->

            <div class="col-12 col-sm-6 col-lg-4 col-xl-3">

                <article class="module-card module-card-disabled">

                    <div class="module-card-top">

                        <div class="module-icon">
                            🌴
                        </div>

                        <span class="module-status coming">
                            Coming Soon
                        </span>

                    </div>

                    <h5>
                        Mission Sabbatical
                    </h5>

                    <p class="module-description">
                        Apply for and track mission sabbatical requests.
                    </p>

                    <div class="module-features">
                        <span>• Applications</span>
                        <span>• Request Tracking</span>
                    </div>

                    <button class="btn btn-outline-secondary w-100 mt-auto"
                            disabled>
                        Coming Soon
                    </button>

                </article>

            </div>


            <!-- LEGAL HELP -->

            <div class="col-12 col-sm-6 col-lg-4 col-xl-3">

                <article class="module-card module-card-disabled">

                    <div class="module-card-top">

                        <div class="module-icon">
                            ⚖️
                        </div>

                        <span class="module-status coming">
                            Coming Soon
                        </span>

                    </div>

                    <h5>
                        Legal Help
                    </h5>

                    <p class="module-description">
                        Request legal assistance for your mission hospital.
                    </p>

                    <div class="module-features">
                        <span>• Legal Assistance</span>
                        <span>• Requests</span>
                    </div>

                    <button class="btn btn-outline-secondary w-100 mt-auto"
                            disabled>
                        Coming Soon
                    </button>

                </article>

            </div>


            <!-- EQUIPMENT -->

            <div class="col-12 col-sm-6 col-lg-4 col-xl-3">

                <article class="module-card module-card-disabled">

                    <div class="module-card-top">

                        <div class="module-icon">
                            🩺
                        </div>

                        <span class="module-status coming">
                            Coming Soon
                        </span>

                    </div>

                    <h5>
                        Equipment & Resources
                    </h5>

                    <p class="module-description">
                        Browse and request available equipment
                        for your hospital.
                    </p>

                    <div class="module-features">
                        <span>• Browse Equipment</span>
                        <span>• Resource Requests</span>
                    </div>

                    <button class="btn btn-outline-secondary w-100 mt-auto"
                            disabled>
                        Coming Soon
                    </button>

                </article>

            </div>


            <!-- LIBRARY -->

            <div class="col-12 col-sm-6 col-lg-4 col-xl-3">

                <article class="module-card module-card-disabled">

                    <div class="module-card-top">

                        <div class="module-icon">
                            📚
                        </div>

                        <span class="module-status coming">
                            Coming Soon
                        </span>

                    </div>

                    <h5>
                        Library Access
                    </h5>

                    <p class="module-description">
                        Request access to library and learning resources.
                    </p>

                    <div class="module-features">
                        <span>• Library Resources</span>
                        <span>• Learning Materials</span>
                    </div>

                    <button class="btn btn-outline-secondary w-100 mt-auto"
                            disabled>
                        Coming Soon
                    </button>

                </article>

            </div>


            <!-- RESEARCH -->

            <div class="col-12 col-sm-6 col-lg-4 col-xl-3">

                <article class="module-card module-card-disabled">

                    <div class="module-card-top">

                        <div class="module-icon">
                            🔬
                        </div>

                        <span class="module-status coming">
                            Coming Soon
                        </span>

                    </div>

                    <h5>
                        Research
                    </h5>

                    <p class="module-description">
                        Browse research news, publications
                        and grand rounds.
                    </p>

                    <div class="module-features">
                        <span>• Research</span>
                        <span>• Publications</span>
                        <span>• Grand Rounds</span>
                    </div>

                    <button class="btn btn-outline-secondary w-100 mt-auto"
                            disabled>
                        Coming Soon
                    </button>

                </article>

            </div>


            <!-- NETWORK CONSULT -->

            <div class="col-12 col-sm-6 col-lg-4 col-xl-3">

                <article class="module-card module-card-disabled">

                    <div class="module-card-top">

                        <div class="module-icon">
                            🩺
                        </div>

                        <span class="module-status coming">
                            Coming Soon
                        </span>

                    </div>

                    <h5>
                        Network Consult
                    </h5>

                    <p class="module-description">
                        Second-opinion and patient workspace
                        for network hospitals.
                    </p>

                    <div class="module-features">
                        <span>• Second Opinion</span>
                        <span>• Network Workspace</span>
                    </div>

                    <button class="btn btn-outline-secondary w-100 mt-auto"
                            disabled>
                        Coming Soon
                    </button>

                </article>

            </div>


            <!-- CONTACT US -->

            <div class="col-12 col-sm-6 col-lg-4 col-xl-3">

                <article class="module-card module-card-disabled">

                    <div class="module-card-top">

                        <div class="module-icon">
                            💬
                        </div>

                        <span class="module-status coming">
                            Coming Soon
                        </span>

                    </div>

                    <h5>
                        Contact Us
                    </h5>

                    <p class="module-description">
                        Reach the Missions Office for help with
                        anything on Connect.
                    </p>

                    <div class="module-features">
                        <span>• Missions Office</span>
                        <span>• Support</span>
                    </div>

                    <button class="btn btn-outline-secondary w-100 mt-auto"
                            disabled>
                        Coming Soon
                    </button>

                </article>

            </div>

        </div>

    </section>



    <!-- ========================================================= -->
    <!-- HOW IT WORKS -->
    <!-- ========================================================= -->

    <section class="guide-how-section mt-5">

        <div class="text-center mb-4">

            <span class="guide-small-label">
                GETTING STARTED
            </span>

            <h3 class="connect-text-darkblue fw-bold">
                How CMC V Connect Works
            </h3>

            <p class="text-muted">
                A simple way to discover and use the services available
                through the platform.
            </p>

        </div>


        <div class="row g-4 justify-content-center">


            <div class="col-12 col-md-4">

                <div class="how-step">

                    <div class="step-number">
                        01
                    </div>

                    <div>
                        <h5>
                            Choose a Module
                        </h5>

                        <p>
                            Select the service or resource you want
                            to explore.
                        </p>
                    </div>

                </div>

            </div>


            <div class="col-12 col-md-4">

                <div class="how-step">

                    <div class="step-number">
                        02
                    </div>

                    <div>
                        <h5>
                            Follow the Guide
                        </h5>

                        <p>
                            Follow the available instructions to
                            understand the module workflow.
                        </p>
                    </div>

                </div>

            </div>


            <div class="col-12 col-md-4">

                <div class="how-step">

                    <div class="step-number">
                        03
                    </div>

                    <div>
                        <h5>
                            Get Started
                        </h5>

                        <p>
                            Use the module to perform the available
                            activities and track your requests.
                        </p>
                    </div>

                </div>

            </div>

        </div>

    </section>



    <!-- ========================================================= -->
    <!-- SUPPORT -->
    <!-- ========================================================= -->

    <section id="support-section"
             class="guide-support mt-5">

        <div class="row align-items-center">

            <div class="col-12 col-lg-8">

                <span class="guide-small-label">
                    NEED HELP?
                </span>

                <h3 class="fw-bold connect-text-darkblue mt-2">
                    We're here to help
                </h3>

                <p class="text-muted mb-lg-0">

                    If you are unsure about where to find a feature
                    or how to use a module, reach out to the
                    Missions Office for assistance.

                </p>

            </div>


            <div class="col-12 col-lg-4 text-lg-end">

                <!-- Replace with actual support action later -->

                <button type="button"
                        class="btn guide-support-btn"
                        disabled>

                    💬 Contact Support

                </button>

            </div>

        </div>

    </section>

</div>



<!-- ============================================================= -->
<!-- GUIDE DEMO MODAL -->
<!-- ============================================================= -->

<div class="modal fade"
     id="guideDemoModal"
     tabindex="-1"
     aria-hidden="true">

    <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">

        <div class="modal-content guide-modal">

            <div class="modal-header bg-primarycolor text-white">

                <div>

                    <div class="small opacity-75">
                        MODULE GUIDE
                    </div>

                    <h5 class="modal-title"
                        id="guideDemoTitle">
                        How to
                    </h5>

                </div>


                <button type="button"
                        class="btn-close btn-close-white"
                        data-bs-dismiss="modal"
                        aria-label="Close">
                </button>

            </div>


            <div class="modal-body"
                 id="guideDemoBody">

            </div>

        </div>

    </div>

</div>`;
  }
  };
  