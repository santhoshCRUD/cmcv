const renderFunctions = {
  contactCard: (hospital) => {
    const carouselId = `carousel-${hospital._id}`;
    const carousel = `
    <div id="${carouselId}" class="carousel slide" data-bs-ride="carousel">
      <div class="carousel-inner" style="max-height:250px">
        ${hospital.hospitalImages.map((image, index) => `
          <div class="carousel-item ${index === 0 ? 'active' : ''}">
            <img src="${image.url}" class="d-block w-100" alt="${image.name}">
          </div>
        `).join('')}
      </div>
      <button class="carousel-control-prev" type="button" data-bs-target="#${carouselId}" data-bs-slide="prev">
        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Previous</span>
      </button>
      <button class="carousel-control-next" type="button" data-bs-target="#${carouselId}" data-bs-slide="next">
        <span class="carousel-control-next-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Next</span>
      </button>
    </div>
  `;

    const cardBody = `
    <div class="card-body">
      <p class="fs-6">    
        <span class="fs-4 card-title">${hospital.missionHospitalName ? hospital.missionHospitalName : ''}</span>
        <span class="fs-5 text-black-50">${hospital.hospitalWebsite ? hospital.hospitalWebsite : ''}</span> <br>
      </p>
      <p class="card-text fs-6">
        <span class="text-muted">Bed Strength:</span> ${hospital.hospitalBedStrength ? hospital.hospitalBedStrength : ''}<br>
        <span class="text-muted">Ph:</span> ${hospital.hospitalPhone}<br>
        <span class="text-muted">Pincode:</span> ${hospital.hospitalPincode}<br>
        <span class="text-info">${hospital.hospitalEmail ? hospital.hospitalEmail : ''} </span>
      </p>
    </div>
  `;

    return `
    <div class="card m-3 mt-0 rounded-5 overflow-hidden">
      ${carousel}
      ${cardBody}
    </div>
  `;
  },
  readMoreCards: (data) => {
    return data.map(card => `
        <div class="top_line_card d-flex flex-column justify-content-between text-center shadow rounded-3 bg-white px-1 py-2 py-md-3 px-md-2 my-md-2 me-1 mb-1 ms-2">
            <div class="p-1 p-md-2 text-center mx-auto d-flex justify-content-center align-items-center secondary-bg-color rounded-circle icon_container">
                <img class="img-fluid object-fit-contain" style="max-width: 100%; max-height: 100%;" src="${card.icon || '../images/flower.svg'}" alt="${card.icon ? card.icon.split('/').pop() : 'flower.svg'}" width="50" height="50">
            </div>
            <p class="fw-light mb-1 mb-md-2 ">${card.hospitalName || ''} ${card.infoLabel || ''} ${card.hospitalDetail || ''}</p>
            ${card.info ? `<p class="fw-bold ">${card.info || ''}</p>` : ''}
            ${card.redirect || card.hospitalDocId ? `
              <a class="d-none d-lg-inline button btn border px-2 py-1" ${card.redirect ? `href="${card.redirect}" target="_blank" rel="noopener noreferrer"` : `onclick="renderMissionHospitalUser('${card.hospitalDocId}')"`}>Read More</a>
              <a class="d-inline d-lg-none" ${card.redirect ? `href="${card.redirect}" target="_blank" rel="noopener noreferrer"` : `onclick="renderMissionHospitalUser('${card.hospitalDocId}')"`}><img src="images/arrow-right.svg" alt="Read More" style="width: 20px; height: 20px;"></a>
              ` : ' '}
        </div>
      `).join('');
  },

  cardList: (data, type) => {
    // Generate the legend container dynamically
    console.log('data', data)
    const legendTypes = [
      { class: "careerCalling", label: "Career" },
      { class: "spiritual", label: "Spiritual" },
      { class: "others", label: "Others" }
    ];

    const legendContainer = `
        <div class="legend-container w-100 d-flex justify-content-center mb-2" style="margin-top:-5px">
          ${legendTypes.map(legend =>
      `<div class="legend-item">
                <div class="legend-circle ${legend.class}"></div>
                <span>${legend.label}</span>
              </div>`)
        .join("")}
        </div>
        <br>
      `;

    // Generate the cards dynamically
    const cards = data
      .map(member => {
        const membershipTypes = member.typeOfMentorship; // make coloured circles withe respect to types of meentorship
        const typeOfMentorDivs = (membershipTypes || [])
          .map(type => `<div class="legend-circle ${Object.keys(type).join(", ")}"></div>`).join("");
        return `
          <div class="card text-center border-0 shadow d-flex align-items-center mx-1 mb-2 position-relative
          ${member.mentorRoleStatus === 'Former' || member.menteeRoleStatus === 'Former' ? 'opacity-75 bg-dark-subtle' : ''} 
          ${member.mentee || member.mentor ? 'pe-pointer' : ''}"  
          style="height: 230px; width:210px;" 
          ${member.mentee || member.mentor ? `onclick="avatarcardClickManager('${JSON.stringify(member).replace(/'/g, "\\'").replace(/"/g, '&quot;')}')"` : ''}>
          
          <!-- Avatar -->
          <div style="max-width:60px; height:60px; border: 2px solid #d7a560;" class="rounded-circle overflow-hidden my-2 shadow">
            <img class="img-fluid" src="${member.avatar || member.councilMemberImage || 'https://s3.amazonaws.com/img.studenthub.in/CMCVConnect_Portal/Pictures/_43782473c4ed75b1e167091821a4d700_Pictures.png'}" alt="">
          </div>
          <div class="legend-item position-absolute end-0 me-1 mt-1">
            ${typeOfMentorDivs}
          </div>
          <!-- Footer -->
          <div class="card-footer bg-transparent w-100">
            <span class="text-wrap fw-bold">${member.salutation || ''} ${member.councilMemberUserInfo?.councilMemberUserName || ''} ${member.firstName || ''} ${member.lastName || ''}${member.mentee ? (member.menteeUserName || '') : ''} ${member.mentor ? (member.mentorUserName || '') : ''}</span>
            <div class="text-wrap text-muted">${member.councilMemberCategory?.councilMemberCategoryName || ''} ${member.mentee ? (member.college || '') : ''} ${member.mentor ? (member.mentorUserEmail || '') : ''}</div>
            <div class="text-secondary fw-light">${member.councilMemberDesignation || member.designation || ''} ${member.mentee ? (member.course || '') : ''} ${member.mentee ? (member.batch || '') : ''} ${member.mentor ? (member.state || '') : ''}</div>
          </div>
        </div>
      `;
      })
      .join("");

    return `${type === 'mentor' ? legendContainer : ''}${cards}`;
  },

  cardTable: (data) => {
    return data.map((item, index) => `
        <tr>
            <td>${index + 1}</td>
            <td>${item.missionDepartmentName || item.name || 'Name not available'}</td>
        </tr>
      `).join('');
  },

  imgArray: (data) => {
    console.log(data)
    return data.images.map((item) => `
      <button type="button" class="btn" onclick="openModal('gallery', '${item.url}', '${data.hspName}')">
          <img src="${item.url}" height="160" alt="${item.originalName}">
      </button>
    `).join('');
  },
  news: (data) => {
    return `
        <ul class="p-0 w-100">
          ${data.map(news => `
            <li onclick="openModal('News','${news._id}')" class="list-unstyled py-2 border-bottom d-flex flex-row w-100">
              <img class="img-thumbnail rounded-3 float-start me-3" src="${news.newsImage}" alt="No News Image"
                style="object-fit: cover; width: 55px; height: 55px; border: 1px solid var(--cmc_orange);"
                onerror="this.onerror=null; this.src='https://s3.amazonaws.com/img.studenthub.in/CMCVConnect_Portal/Pictures/_43782473c4ed75b1e167091821a4d700_Pictures.png'">
              <div class="text-line">
                <p class="roboto-regular card_head p-0 m-0 cnt">${news.newsTitle}</p>
                <p class="text-dark-emphasis roboto-light p-0 mb-0 cnt">${news.newsSubTitle}</p>
              </div>
              <button class="btn" onclick="openModal('News','${news._id}')">
                <img src="images/arrow-right.svg" alt="arrow" style="width: 20px; height: 20px">
              </button>
            </li>
          `).join('')}
        </ul>
      `;
  },

  news2: (data) => {
    return `
    ${data.map(news => `
      <div class="col-md-3 mb-4">
        <div class="card shadow h-100" onclick="openModal('News','${news._id}')" style="cursor: pointer;">
          <img class="card-img-top rounded-top-3" 
               src="${news.newsImage}" 
               alt="No News Image"
               style="height: 250px; object-fit: cover;"
               onerror="this.onerror=null; this.src='https://s3.amazonaws.com/img.studenthub.in/CMCVConnect_Portal/Pictures/_43782473c4ed75b1e167091821a4d700_Pictures.png'">
          <div class="card-body p-2">
            <div class="text-line">
              <p class="roboto-regular card_head p-0 m-0 cnt">${news.newsTitle}</p>
              <p class="text-dark-emphasis roboto-light p-0 mb-0 cnt">${news.newsSubTitle}</p>
            </div>
          </div>
        </div>
      </div>
    `).join('')}
  `
  },
  topNews: (data) => {
    return `
        <ul class="p-0 w-100">
          ${data.map(news => `
            <li onclick="openModal('News','${news._id}')" class="list-unstyled py-2 border-bottom d-flex flex-row justify-content-between w-100">
              <div class="text-line top">
                <p class="roboto-regular card_head p-0 m-0 title">${news.newsTitle}</p>
                <p class="text-dark-emphasis roboto-light p-0 mb-0 cnt">${news.newsSubTitle}</p>
                <span>
                <span class="mb-1 text-end text-secondary">${moment(news.newsDate).format('MMMM Do, YYYY')}</span>
                <button class="btn d-none d-md-inline" onclick="openModal('News','${news._id}')">Read more</button>
                </span>              
              </div>
              <img class="img-thumbnail rounded-3 float-start ms-2" src="${news.newsImage}" alt="No News Image"
                style="object-fit: cover; width: auto; max-width:105px; height: 140px; border: 1px solid var(--cmc_orange);"
                onerror="this.onerror=null; this.src='https://s3.amazonaws.com/img.studenthub.in/CMCVConnect_Portal/Pictures/_43782473c4ed75b1e167091821a4d700_Pictures.png'">
            </li>
          `).join('')}
        </ul>
      `;
  },
  recentNews: (data) => {
    return `
        <ul class="p-0 w-100">
          ${data.map(news => `
            <li  onclick="openModal('News','${news._id}')" class="list-unstyled py-1 border-bottom d-flex flex-row w-100">
              <img class="img-thumbnail rounded-1 float-start me-2 bg-light" src="./images/file.svg" alt="No News Image"
                style="object-fit: cover; height: 22px;"
                onerror="this.onerror=null; this.src='https://s3.amazonaws.com/img.studenthub.in/CMCVConnect_Portal/Pictures/_43782473c4ed75b1e167091821a4d700_Pictures.png'">
              <div class="text-line bg">
                <p class="roboto-regular card_head p-0 m-0 title">${news.newsTitle}</p>
                <p class="mb-1 text-end text-secondary">${moment(news.newsDate).format('MMMM Do, YYYY')}</p>
              </div>
              <button class="btn btn-sm" onclick="openModal('News','${news._id}')">
                <img src="images/arrow-right.svg" alt="arrow" style="width: 12px; height: 12px">
              </button>
            </li>
          `).join('')}
        </ul>
      `;
  },
  archiveNews: (data, currMonth) => {
    let lastMonth = currMonth; // Initialize lastMonth with the provided currMonth
    let renderedHTML = ''; // Store the generated HTML

    renderedHTML = data.map(news => {
      const newsDate = new Date(news.newsDate);
      const monthLabel = newsDate.toLocaleString('default', { month: 'long', year: 'numeric' });
      let monthHeader = '';

      if (monthLabel !== lastMonth) {
        lastMonth = monthLabel;
        // Add a new month header when the month changes
        monthHeader = `<div class="fw-medium text-body-tertiary fs-4 mt-2">${monthLabel} News</div>`;
      }

      return `
        ${monthHeader}
        <li onclick="openModal('News','${news._id}')" class="list-unstyled py-2 border-bottom d-flex flex-row w-100">
          <img class="img-thumbnail rounded-3 float-start me-3" src="${news.newsImage}" alt="No News Image"
            style="object-fit: cover; width: 55px; height: 55px; border: 1px solid var(--cmc_orange);"
            onerror="this.onerror=null; this.src='https://s3.amazonaws.com/img.studenthub.in/CMCVConnect_Portal/Pictures/_43782473c4ed75b1e167091821a4d700_Pictures.png'">
          <div class="text-line">
            <p class="roboto-regular card_head p-0 m-0 cnt">${news.newsTitle}</p>
            <p class="text-dark-emphasis roboto-light p-0 mb-0 cnt">${news.newsSubTitle}</p>
          </div>
          <button class="btn" onclick="openModal('News','${news._id}')">
            <img src="images/arrow-right.svg" alt="arrow" style="width: 20px; height: 20px">
          </button>
        </li>
      `;
    }).join('');

    return {
      html: renderedHTML,
      currentMonth: lastMonth // Return the last processed month
    };
  },
  detailNewsSearch: (data) => {
    return data.length
      ? data
        .map(
          (news) => `
                <li onclick="openModal('News','${news._id}')" class="list-unstyled py-2 border-bottom d-flex flex-row w-100">
                  <div class="text-line top">
                    <p class="roboto-regular card_head p-0 m-0 cnt">${news.newsTitle}</p>
                    <p class="text-dark-emphasis roboto-light p-0 mb-0 cnt">${news.newsSubTitle}</p>
                    <button class="btn" onclick="openModal('News','${news._id}')">Read more</button>
                  </div>
                  <img class="img-thumbnail rounded-3 float-start ms-3" src="${news.newsImage}" alt="No News Image"
                    style="object-fit: cover; width: auto; max-width:120px; height: 140px; border: 1px solid var(--cmc_orange);"
                    onerror="this.onerror=null; this.src='https://s3.amazonaws.com/img.studenthub.in/CMCVConnect_Portal/Pictures/_43782473c4ed75b1e167091821a4d700_Pictures.png'">
                </li>`
        )
        .join('')
      : `<p class="text-center p-3">No results found</p>`;
  },
  resourcesCard: (data) => {
    const embedURL = convertToEmbedURL(data.resourceLink);
    const uniqueId = `video-${data._id || Math.random().toString(36).substr(2, 9)}`;

    return `<div class="col-12 col-md-4 p-1 ">
        <div class="resource-wrapper mb-3">
      <div id="${uniqueId}" class="dropdown-video mt-2" style="display: none;">
      </div>
        <div class="card shadow h-100 p-2 card-with-triangle pe-pointer" style="border-radius: 12px; position: relative;" onclick='toggleVideoDropdown("${uniqueId}", ${JSON.stringify(embedURL).replace(/"/g, '&quot;')})'>
          <!-- Top-left thumbnail -->
          <div class="header d-flex justify-content-between align-items-center z-1" >
            <img src="${data.thumbnail}" alt="${data.type}" style="object-fit: cover; height:30px">
            <span class="fw-lighter text-muted ms-auto">${data.type} / ${data.subType ? data.subType : ''}</span>
            <button class="btn btn-sm bg-body-secondary d-none d-md-block ms-2" >Read More</button>
          </div>
  
          <!-- Card Body -->
          <div class="card-body text-center text-line bg w-100" style="max-height:250px">
            <h6 class="cnt mb-0">${data.title}</h6>
            <p class="mb-1">${data.resourcePerson}</p>
            <span class="fw-lighter text-muted" style="font-size:13px">${data.metaTags}</span>
          </div>
        </div>
        </div>
      </div>`;
  },
  avatarCard: (data) => {
    return `
      <div class="avatar_card w-100" >
       <img class="img-avatar rounded-circle position-absolute" src="${data.avatar || 'https://s3.amazonaws.com/img.studenthub.in/CMCVConnect_Portal/Pictures/_43782473c4ed75b1e167091821a4d700_Pictures.png'}" alt="">
    <div class="w-100 d-flex flex-wrap" style="transition: all 0.3s ease;">
      <div class="portada d-none d-md-block  col-0 col-md-3">
      </div>
      <div class="p-2 pt-5 position-relative col-12 col-md-9">   
        <button type="button" class="position-absolute end-0 top-0 me-2 mt-2"  onclick="closeModal()"><h6 class="btn-close"></h6></button>
        <div class="text-end fw-lighter text-muted pe-1 d-flex flex-column align-items-end" ><div style="max-width:calc(100% - 120px); word-break: break-all;">${data.info1}</div> <br> <div> ${data.info2}</div><br> <div>${data.info3}</div></div>
        <p class="mb-0 fs-4 fw-semibold" style="margin-top:20px">${data.title}</p>
        <div id='moreDetails' class="fs-6 fw-lighter avatar_card_drawer show ">
          ${data.aboutme || ''}
        </div>
        ${data.isMentee ? `<div id="logMeeting" class='logMeeting p-2'></div>` : ''}
        <div id="meetings" class='logMeeting pe-3'>
         <table id="mymeetings" class="display"></table>
        </div>
  
    <div class="actions">
    <div class="btn" onclick="avatarCardtoggleManager('moreDetails')">More Details</div>
    <div class="btn" onclick="avatarCardtoggleManager('meetings','${JSON.stringify(data).replace(/'/g, "\\'").replace(/"/g, '&quot;')}')">My Meetings</div>
    ${data.isMentee ? `<div class="btn"onclick="avatarCardtoggleManager('logMeeting')">Log a Meeting</div>` : ''}
    </div></div>
    </div> 
  </div>`
  },
  iconCard: (data) => {
    return `
    <div class="icon_cnt_bnt d-flex align-items-center justify-content-center col-12 col-md-4 position-relative mb-2 px-2">
      <!-- Icon -->
      <div class="icon overflow-hidden rounded-circle z-1">
        <img class="img-fluid bg-white p-2" src="${data.icon}" alt="${data.code}">
      </div>
      <!-- Label -->
      <div class="align-content-center bg-success-subtle label pe-2 py-3 rounded-pill z-0 fs-5 fw-semibold">
        ${data.name}
      </div>
    </div>
  `
  },
  nameCard: (data) => {
    return `
    <div class="col-12 col-md-3 mb-2 px-2" onclick="detailResources('${data._id}','${data.name}','${data.code}','${data.redirectFun}','${data.thumbnail}')">
      <div class="profile rounded-3 p-2 shadow text-center position-relative pe-pointer">
        <div class="profile__image mb-4">
         <div class="pro_image mx-auto d-flex p-4 rounded-circle overflow-hidden ">
          <img class="" src=${data.thumbnail} alt=""  onerror="this.onerror=null; this.src='./images/icons/module.png';">
         </div>
        </div>
        <h3>${data.name}</h3>
      </div>
    </div>
   `
  },

  latestResourceCard: (data) => {
    const metaTagsFormatted = data.metaTags?.split(",").map(tag => tag.trim()).join(" | ") || "";
    const embedURL = convertToEmbedURL(data.resourceLink);
    const uniqueId = `video-${data._id || Math.random().toString(36).substr(2, 9)}`;
    const embedDataStr = JSON.stringify(embedURL).replace(/"/g, '&quot;');


    return `
    <div class="resource-wrapper mb-3">
      <div id="${uniqueId}" class="dropdown-video mt-2" style="display: none;">
      </div>
      <div class="card mb-3 pe-pointer" style="max-width: 540px;" onclick='toggleVideoDropdown("${uniqueId}", ${JSON.stringify(embedURL).replace(/"/g, '&quot;')})'>
       <div class="row g-0">
        <div class="col-md-4 d-flex flex-md-column flex-row align-items-center justify-content-center bg-success-subtle">
          <img src="${data.thumbnail}" alt="${data.type}" style="object-fit: cover; height: 30px;">
          <div class="text-center fw-semibold p-2">
            ${data.title}
          </div>
        </div>
        <div class="col-md-8">
          <div class="card-body">
            <p class="card-text"><strong>Resource Person:</strong> ${data.resourcePerson || "N/A"}</p>
            <p class="card-text"><strong>Meta Tags:</strong> ${metaTagsFormatted}</p>
          </div>
        </div>
      </div>
    </div>
    <script>
        setTimeout(() => {
          toggleVideoDropdown("${uniqueId}", ${embedDataStr});
        }, 200);
      </script>
    </div>
  `;
  },

  topResourceCard: (data) => {
    const metaTagsFormatted = data.metaTags?.split(",").map(tag => tag.trim()).join(" | ") || "";
    const embedURL = convertToEmbedURL(data.resourceLink);
    const uniqueId = `video-${data._id || Math.random().toString(36).substr(2, 9)}`;

    return `
    <div class="resource-wrapper mb-3">
      <div id="${uniqueId}" class="dropdown-video mt-2" style="display: none;">
      </div>
      <div class="card mb-3 pe-pointer" style="max-width: 540px;" onclick='toggleVideoDropdown("${uniqueId}", ${JSON.stringify(embedURL).replace(/"/g, '&quot;')})'>
        <div class="row g-0">
          <div class="col-md-4 d-flex flex-md-column flex-row align-items-center justify-content-center bg-success-subtle">
            <img src="${data.thumbnail}" alt="${data.type}" style="object-fit: cover; height:30px">
            <div class="text-center fw-semibold p-3">${data.title}</div>
          </div>
          <div class="col-md-8">
            <div class="card-body">
              <p class="card-text"><strong>Resource Person:</strong> ${data.resourcePerson}</p>
              <p class="card-text"><strong>Meta Tags:</strong> ${metaTagsFormatted}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
  },
  recentResourceCard: (data) => {
    const embedData = convertToEmbedURL(data.resourceLink);
    const uniqueId = `video-${data._id || Math.random().toString(36).substr(2, 9)}`;
    return `
    <div class="resource-wrapper mb-3">
      <div id="${uniqueId}" class="dropdown-video mt-2" style="display: none;"></div>
      <div class="card mb-3 pe-pointer" style="max-width: 540px;" onclick='toggleVideoDropdown("${uniqueId}", ${JSON.stringify(embedData).replace(/"/g, '&quot;')})'>
        <div class="card-body">
          <h5>${data.title}</h5>
          <p class="card-text">
            <strong>Resource Person:</strong> ${data.resourcePerson}
          </p>
        </div>
      </div>
    </div>`;
  },

  mmmeetingDetailCard: (data) => {
    return `
    <div class="p-2 pt-3">
            <h5 class="mb-2">Meeting on ${moment(data.meetingDateTime).format('DD-MM-YYYY')}</h5>
            <p class="card-text">
              <strong>Comments:</strong> ${data.meetingComment} <br>
              <strong>Meeting called By:</strong> ${data.addedBy}
            </p>
    </div>`;
  },


  weeklyMannaCard: (data) => {
    // Format the devotionalDate
    const dateObj = new Date(data.devotionalDate);
    const formattedDate = `${dateObj.getDate()} ${dateObj.toLocaleString('en-US', { month: 'long' })} ${dateObj.getFullYear()}`;
    data.formattedDate = formattedDate; // Update the data object with the formatted date
    const firstImage = data.uploadImage[0];
    data.uploadImage = (firstImage?.data?.url)
      ? { url: firstImage.data.url }
      : firstImage; // fallback
    const currentDate = new Date();
    const localizedDate = currentDate.getDate() + ' ' + currentDate.toLocaleDateString('en-US', { month: 'long' }) + ' ' + currentDate.getFullYear();

    return `
  <div class="d-flex align-items-center weeklyManna" 
       onclick='openModal("weeklyManna", "", ${JSON.stringify(data).replace(/'/g, "&apos;")})'>

    <img class="rounded-2 me-3 manna-img" 
         src="${data.uploadImage.url || 'https://s3.amazonaws.com/img.studenthub.in/CMCVConnect_Portal/Pictures/_43782473c4ed75b1e167091821a4d700_Pictures.png'}" 
         alt="Weekly Manna Image">

    <div class="flex-grow-1">
      <div class="mb-2">
        <h5 class="text-center text-md-start">${data.devotionalTitle || 'Details Awaited'}</h5>
        <p class="text-dark mb-0"><strong>Date:</strong> ${localizedDate || 'Details Awaited'}</p>
      </div>
    </div>
  </div>
`;

  },

  timeline: (timelineData, wrapperSelector = ".timeline-wrapper") => {
    //console.log("TimeLine Data:", timelineData);
    const wrapper = document.querySelector(wrapperSelector);
    if (!wrapper) return;

    wrapper.innerHTML = `<div class="timeline-line"></div>`; // reset before adding

    const carouselContainer = document.createElement("div");
    carouselContainer.className = "timeline-carousel-container position-relative";

    const track = document.createElement("div");
    track.className = "timeline-carousel-track d-flex overflow-hidden";

    timelineData.forEach(item => {
      const div = document.createElement("div");
      div.className = "timeline-content-item text-center p-3 flex-shrink-0";
      div.style.width = "280px";

      const imgUrl = item.uploadIcon?.[0]?.data?.url || "fallback.jpg";
      item.image = item.modalPicture?.[0]?.data?.url || [];

      div.innerHTML = `
    <span>${item.year || ""}</span>
    <div class="timeline-content-item-reveal">
      <a href="#"onclick='openModal("timeline", "", ${JSON.stringify(item).replace(/'/g, "&apos;")})'>
        <img src="${imgUrl}" alt="${item.title}" class="bg-dark img-fluid" style="height:180px; width:180px; object-fit:cover;">
        <span class="p-1 rounded-3 fst-normal" style="background:linear-gradient(180deg, #4e4949ce, #3b3636ff)">${item.title}</span>
      </a>
    </div>
  `;

      track.appendChild(div);
    });

    const prevBtn = document.createElement("button");
    prevBtn.className = "carousel-btn prev-btn btn btn-light rounded-circle position-absolute start-0 translate-middle-y";
    prevBtn.style.top = "38%";
    prevBtn.innerHTML = `<i class="fas fa-chevron-left"></i>`;

    const nextBtn = document.createElement("button");
    nextBtn.className = "carousel-btn next-btn btn btn-light rounded-circle position-absolute end-0 translate-middle-y";
    nextBtn.style.top = "38%";
    nextBtn.innerHTML = `<i class="fas fa-chevron-right"></i>`;

    let scrollAmount = 220;
    prevBtn.addEventListener("click", () => {
      track.scrollBy({ left: -scrollAmount, behavior: "smooth" });
    });
    nextBtn.addEventListener("click", () => {
      track.scrollBy({ left: scrollAmount, behavior: "smooth" });
    });

    carouselContainer.appendChild(prevBtn);
    carouselContainer.appendChild(track);
    carouselContainer.appendChild(nextBtn);
    wrapper.appendChild(carouselContainer);
  },

  grandRoundsCard: (list = []) => {
    if (!Array.isArray(list) || list.length === 0) {
      return `<p class="text-muted text-center">No Grand Rounds Available</p>`;
    }

    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    list = list.filter(data => {
      const endDate = new Date(data.endDate);
      endDate.setHours(0, 0, 0, 0);

      return endDate >= currentDate;
    });
    if (list.length === 0) {
      return `<p class="text-muted text-center">No Ongoing Grand Rounds Available</p>`;
    }

    return list.map(data => {
      const start = new Date(data.startDate);
      const end = new Date(data.endDate);

      const startedDate = `${start.getDate()} ${start.toLocaleString('en-US', { month: 'short' })}`;
      const endedDate = `${end.getDate()} ${end.toLocaleString('en-US', { month: 'short' })}`;

      data.formattedDate = { started: startedDate, ended: endedDate };

      const firstImage = data.poster?.[0];
      data.poster = firstImage?.data?.url
        ? { url: firstImage.data.url }
        : null;

      return `
          <div class="mb-2">
            <div class="grandRounds-item shadow-sm rounded-3">
              <div class="card-body py-2 px-3">
                <h6 class="mb-0 fs-md-5 text-truncate">
                  ${data.grandRoundsTitle}
                  <span class="fw-normal text-muted">
                    – ${data.speakerName}
                  </span>
                </h6>
              </div>
            </div>
          </div>

    `;
    }).join("");
  },

  grantsAwardeeCard: (awardees) => {
    if (!Array.isArray(awardees)) return "";

    return awardees.map((data) => {
      const awardeeImg = data.awardeePhoto?.[0]?.url || "https://s3.amazonaws.com/img.studenthub.in/CMCVConnect_Portal/Pictures/_43782473c4ed75b1e167091821a4d700_Pictures.png";

      return `
      <div class="col-md-4 mb-4">
        <div class="card h-100 text-center rounded-3 shadow-sm grantAwardee-card"
             onclick='openModal("grantsAwardee", "", ${JSON.stringify(data).replace(/'/g, "&apos;")})'>

          <!-- Awardee Image -->
          <img src="${awardeeImg}" class="card-img-top mx-auto mt-3 rounded-circle"
               style="width:120px; height:120px; object-fit:cover;" alt="${data.profile?.name || "Awardee"}">

          <!-- Awardee Details -->
          <div class="card-body">
            <h5 class="card-title">${data.facultyName.profile?.name || "Unknown"}</h5>
            <h6 class="text-muted">${data.profile?.designation || ""}</h6>
            <p class="card-text mb-1"><strong>Dept:</strong> ${data.facultyName.profile?.department || "N/A"}</p>
          </div>
        </div>
      </div>
    `;
    }).join("");
  },

  whatsNew: (data) => {
    //console.log("whatsNew data", data);

    return `
    <div id="whatsNewCarousel" class="carousel slide" data-bs-ride="carousel" data-bs-interval="3000" data-bs-pause="hover">
      <div class="carousel-inner rounded-3">
        ${data.map((item, index) => {
      const firstImage = item.uploadImage?.[0];
      const imageUrl = firstImage?.data?.url || 'https://s3.amazonaws.com/img.studenthub.in/CMCVConnect_Portal/Pictures/_43782473c4ed75b1e167091821a4d700_Pictures.png';
      item.image = imageUrl;
      return `
            <div class="carousel-item ${index === 0 ? 'active' : ''}">
              <div class="d-flex flex-column flex-md-row align-items-center justify-content-center p-3 pb-4" onclick='openModal("whatsNew", "", ${JSON.stringify(item).replace(/'/g, "&apos;")})'
              style="min-height: 250px;">
                
                <div class="col-12 col-md-6 d-flex justify-content-center mb-3 mb-md-0">
                  <img src="${imageUrl}" alt="${item.title}" 
                       class="rounded-3 img-fluid" 
                       style="max-height: 220px; object-fit: cover;">
                </div>
                
                <div class="col-12 col-md-6 text-center text-md-start px-md-4">
                  <h4 class="fw-bold mb-2">${item.title || 'Details Awaited'}</h4>
                  <p class="mb-0">${item.description || 'Details Awaited'}</p>
                  ${item.link ? `<a href="${item.link}" target="_blank" class="btn btn-sm read-more-btn border mt-3">Learn More</a>` : ''}
                </div>

              </div>
            </div>
          `;
    }).join('')}
      </div>

      <div class="carousel-indicators mb-0">
        ${data.map((_, index) => `
          <button type="button" data-bs-target="#whatsNewCarousel" data-bs-slide-to="${index}" 
            ${index === 0 ? 'class="active" aria-current="true"' : ''} 
            aria-label="Slide ${index + 1}"></button>
        `).join('')}
      </div>
    </div>
  `;
  },

  preMmsVisitsCard: (list) => {

    if (!Array.isArray(list) || list.length === 0) {
      return "Our records show that you are the first person from your department ";
    }

    return list.map((data) => {
      // Format dates for each item
      const dateObj = new Date(data.fromDate2);
      const dateObj2 = new Date(data.toDate2);

      const fromDate = `${dateObj.getDate()} ${dateObj.toLocaleString('en-US', { month: 'short' })} ${dateObj.getFullYear()}`;
      const toDate = `${dateObj2.getDate()} ${dateObj2.toLocaleString('en-US', { month: 'short' })} ${dateObj2.getFullYear()}`;

      data.formattedDate = { fromDate, toDate };
      const firstImage = data.uploadPicture?.[0];
      const imageUrl = firstImage?.data?.url || 'https://s3.amazonaws.com/img.studenthub.in/CMCVConnect_Portal/Pictures/_43782473c4ed75b1e167091821a4d700_Pictures.png';
      data.imageUrl = imageUrl;

      return `
      <div class="d-flex align-items-center grandRounds bg-light rounded mb-1 py-2 px-0"
         onclick='openModal("preMmsVisits", "", ${JSON.stringify(data).replace(/'/g, "&apos;")})'>
        <img class="rounded-3 p-1" src="${data.imageUrl}" height="100" width="100" alt="Picture">

        <div class="flex-grow-1">
          <div class="mb-2">
            <h5 class="text-center text-md-start">${data.name}</h5>
            <p class="text-dark mb-0" style="font-size: small;">${data.formattedDate.fromDate} - ${data.formattedDate.toDate}</p>
            <p class="text-dark text-center text-md-start">Brief Report</p>
          </div>
        </div>
      </div>
    `;
    }).join('');

  },
  userMmsVisitsCard: (list) => {


    return list.map((data) => {
      const dateObj = new Date(data.fromDate2 || data.fromDate);
      const dateObj2 = new Date(data.toDate2 || data.toDate);

      const fromDate = `${dateObj.getDate()} ${dateObj.toLocaleString('en-US', { month: 'short' })} ${dateObj.getFullYear()}`;
      const toDate = `${dateObj2.getDate()} ${dateObj2.toLocaleString('en-US', { month: 'short' })} ${dateObj2.getFullYear()}`;

      data.formattedDate = { fromDate, toDate };

      return `
      <div class="d-flex text-start grandRounds text-black bg-light rounded mb-1 p-2"
         onclick='openModal("preMmsVisits", "", ${JSON.stringify(data).replace(/'/g, "&apos;")})'>
        <div class="flex-grow-1">
          <div class="mb-2">
          <h6 class="text-center text-md-start">${data.missionHospital.missionHospitalName}</h6>
            <p class="text-dark mb-0" style="font-size: small;">${data.formattedDate.fromDate} - ${data.formattedDate.toDate}</p>
            <p class="text-dark mb-0" style="font-size: small;">Brief Report</p>
          </div>
        </div>
      </div>
    `;
    }).join('');

  },

  mmsApprovedCard: (data) => {
    //console.log("MMS approved data", data);
    if (!data) return "";

    data.from = data.formattedDates?.from || "";
    data.to = data.formattedDates?.to || "";
    data.hospitalName = data.missionHospital?.missionHospitalName || "";
    data._id = data._id || "";
    data.hospitalImg = data.hospitalImage?.url || "";

    data.status =
      data.status === "approved"
        ? "Approved"
        : data.status === "submitted"
          ? "Submitted"
          : "";

    return `
<div class="col-12 col-md-6 col-lg-6">
    <div class="card approval-card shadow-sm bg-primarycolor text-white h-100"
         onclick='openModal("mmsApprovedPanel", "", ${JSON.stringify(data).replace(/'/g, "&apos;")})'>

      <div class="card-body d-flex flex-column flex-md-row align-items-center gap-3">

        <!-- Image -->
        <div class="approval-img-wrapper">
          <img src="${data.hospitalImg}"
               alt="Hospital"
               class="img-fluid rounded-3">
        </div>

        <!-- Content -->
        <div class="flex-grow-1 w-100">
          <h6 class="secondary-color mb-1">
            ${data.hospitalName}
          </h6>

          <p class="mb-2 small">
            ${data.from} – ${data.to}
          </p>

          <div class="d-flex justify-content-between align-items-center">
            <span class="badge 
              ${data.status === 'Approved' ? 'bg-success' : 'bg-warning text-dark'}">
              ${data.status}
            </span>

            <span class="secondary-bg-color blink text-white p-1 rounded update-visit ${data.status !== 'Approved' ? 'invisible' : ''}">
              Update your Visit <i class="fa-regular fa-pen-to-square"></i>
            </span>
          </div>
        </div>

      </div>
    </div>
  </div>`;
  },


  recentgrandRoundsCard: (data) => {
    const embedURL = convertToEmbedURL(data.resourceLink);
    const uniqueId = `video-${data._id || Math.random().toString(36).substr(2, 9)}`;

    return `<div class="col-12 p-1 ">
        <div class="resource-wrapper mb-3">
      <div id="${uniqueId}" class="dropdown-video mt-2" style="display: none;">
      </div>
        <div class="card shadow h-100 p-2 card-with-triangle pe-pointer" style="border-radius: 12px; position: relative;" onclick='toggleVideoDropdown("${uniqueId}", ${JSON.stringify(embedURL).replace(/"/g, '&quot;')})'>
          <!-- Top-left thumbnail -->
          <div class="header d-flex justify-content-between align-items-center z-1" >
            <img src="${data.thumbnail}" alt="${data.type}" style="object-fit: cover; height:30px">
          </div>
  
          <!-- Card Body -->
          <div class="card-body text-center text-line bg w-100" style="max-height:250px">
            <h6 class="cnt mb-0">${data.title}</h6>
            <p class="mb-1">${data.resourcePerson}</p>
            <span class="fw-lighter text-muted" style="font-size:13px">${data.metaTags}</span>
          </div>
          <button class="btn btn-sm bg-body-secondary d-none d-md-block ms-2" >View</button>
        </div>
        </div>
      </div>`;
  },

  conclaveParticipantsCards: (list) => {
    return list.map((data) => {
      return `
    <div class="col-12 col-md-3 mb-4"> 
      <div class="card h-100 border-0 shadow-sm rounded-3 overflow-hidden">
        <div class="card-body d-flex flex-column p-0">
          
          <div class="ratio ratio-16x9 mb-3">
            <img src="${data.hospitalImages?.[0]?.data?.url || 'https://s3.amazonaws.com/img.studenthub.in/CMCVConnect_Portal/Pictures/_43782473c4ed75b1e167091821a4d700_Pictures.png'}" 
                 alt="${data.hospitalName}" 
                 class="rounded-2 img-fluid">
          </div>

          <h5 class="card-title fs-6 fw-bold flex-grow-1 px-3">
            ${data.hospitalName}
          </h5>

          <div class="d-flex justify-content-center align-items-center">
            <button class="btn text-body-secondary fs-3" 
                    onclick="window.open('${data.hospitalWebsite}', '_blank')"
                    style="width:55px; height: 46px;">
              <i class="fa-solid fa-right-long"></i>
            </button>
          </div>
          
        </div>
      </div>
    </div>
    `;
    }).join('');
  },

  clinicalSnip: (data) => {
    // console.log(data)
    const list = Array.isArray(data) ? data : data?.data;

    if (!Array.isArray(list)) return "";

    return list.map((item) => {
      const questionId = item._id;
      const imgUrl = item.uploadImage?.[0]?.data?.url;

      return `
      <div class="col-md-12 col-12 mb-4">
        <div class="card h-100 shadow-sm border-0 rounded-3 mcq-card" id="card-${questionId}">
          <div class="card-header bg-white border-0 pt-4 px-4">
             <span class="badge bg-secondary mb-2">${item.topics || 'General'}</span>
             <h5 class="card-title roboto-regular">${item.question}</h5>
          </div>
          
          <div class="card-body px-4">
          ${imgUrl ? `
            <div class="d-flex justify-content-center mb-3" onclick='openModal("image", " ",  ${JSON.stringify(imgUrl).replace(/'/g, "&apos;")})'>
          <img src="${imgUrl}" alt="${item.title}" class="img-fluid" style="width:50%; object-fit:cover;">
          </div>` : ''}
            <div class="options-container d-grid gap-2">
              ${item.options.map((opt, index) => `
                <button class="btn btn-outline-secondary text-start p-3 mcq-option" 
                  data-correct="${opt.answer || ''}"
                  data-explanation="${encodeURIComponent(opt.explanation || '')}"
                  onclick="checkAnswer(this)">
                  <div class="d-flex justify-content-between align-items-center">
                    <span><strong>${String.fromCharCode(65 + index)}.</strong> ${opt.option}</span>
                    <i class="status-icon fas"></i>
                  </div>
                </button>
              `).join('')}
            </div>
          </div>

          <div class="card-footer bg-light border-0 py-3 explanation-box d-none" id="explain-${questionId}">
             <small class="text-muted d-block mb-1">Explanation:</small>
             <p class="small m-0 text-dark"></p>
          </div>
        </div>
      </div>
    `;
    }).join("");
  },

  notesFromJourney: (data) => {
    return data.map((item) => {
      const formatDate = (dateStr) => {
        const d = new Date(dateStr);
        return `${d.getDate()} ${d.toLocaleString('en-US', { month: 'short' })} ${d.getFullYear()}`;
      };

      const fromDate = formatDate(item.fromDate);
      const toDate = formatDate(item.toDate);

      const imageUrl = item.uploadPicture?.[0]?.data?.url || item.imageUrl || 'https://s3.amazonaws.com/img.studenthub.in/CMCVConnect_Portal/Pictures/_43782473c4ed75b1e167091821a4d700_Pictures.png';

      item.imageUrl = imageUrl;
      item.formattedDate = {
        fromDate: fromDate,
        toDate: toDate
      };

      return `
<div class="col-xl-4 col-lg-6 col-md-6 col-12 mb-4">
  <div class="card h-100 shadow-sm border rounded-3 p-3 d-flex flex-column">
    <div class="row g-3 flex-grow-1">
      
      <div class="col-sm-6 col-12 text-center d-flex flex-column">
        <img src="${imageUrl}" 
             alt="Journey Image" 
             class="img-fluid rounded-2 w-100" 
             style="height:180px; object-fit:cover;">
        <div class="mt-2">
          <h6 class="mb-1 fw-bold">Dr. ${item.name || ''}</h6>
          <p class="small text-muted mb-1">${item.missionHospital?.missionHospitalName || ''}</p>
          <p class="small text-secondary mb-0">${fromDate} - ${toDate}</p>
        </div>
      </div>
      
      <div class="col-sm-6 col-12 d-flex flex-column justify-content-between mt-3 mt-sm-0">
        <div class="quote-container" style="font-size:12px">
          <blockquote class="text-center fst-italic mt-sm-2 mb-0">
            ${item.highlightedQuote || ''}
          </blockquote>
        </div>
        
        <div class="text-center mt-3">
          <button class="read-btn w-75 p-1 px-4" 
                  onclick='openModal("preMmsVisits", " ", ${JSON.stringify(item).replace(/'/g, "&apos;")})'>
            Read More
          </button>
        </div>
      </div>
      
    </div>
  </div>
</div>
    `;
    }).join("");
  },
  ncThemesList: (data) => {
    return data.map((item) => {
      const imageUrl = item.iconUpload?.[0]?.data?.url || 'https://s3.amazonaws.com/img.studenthub.in/CMCVConnect_Portal/Pictures/_43782473c4ed75b1e167091821a4d700_Pictures.png';

      return `
      <div class="col-md-5 m-4"> <div class="row align-items-center shadow-sm border rounded-3 p-3 bg-white">
          
          <div class="col-md-3">
            <div class="text-center">
              <img src="${imageUrl}" 
                   alt="${item.themeName}" 
                   class="rounded-circle img-fluid" 
                   style="width:70px; height:70px; object-fit:cover;">
            </div>
          </div>

          <div class="col-md-9">
            <h5 class="fs-6 fw-bold mb-1">
              ${item.themeName}
            </h5>
            <p class="text-muted">
              ${item.description || 'No description available.'}
            </p>
          </div>

        </div>
      </div>
    `;
    }).join('');
  },

  sponsoringBodyCard: (data, allottedIds = []) => {

    return data.map(item => {

      const isAllotted = allottedIds.includes(item._id);

      const images = item.hospitalImages?.length
        ? item.hospitalImages
        : [{ url: "./images/icons/hospital-icon.png" }];

      const carouselId = `carousel-${item._id}`;

      return `
        <div class="card m-3 mt-0 rounded-3 overflow-hidden col-md-3 px-0
            ${isAllotted ? "border border-primary border-2 shadow-lg allotted-card" : ""}">

            ${isAllotted ? `
                <div class="badge secondary-bg-color position-absolute m-2" style="z-index:1000;">
                    Assigned
                </div>
            ` : ""}

            <div id="${carouselId}" class="carousel slide" data-bs-ride="carousel">

                <div class="carousel-inner" style="height:210px;">

                    ${images.map((image, idx) => `
                        <div class="carousel-item ${idx === 0 ? "active" : ""}">
                            <img
                                src="${image.url}"
                                class="d-block w-100"
                                alt="Hospital Image"
                                onerror="this.src='./images/icons/hospital-icon.png'">
                        </div>
                    `).join("")}

                </div>

                ${images.length > 1 ? `
                    <button class="carousel-control-prev"
                        type="button"
                        data-bs-target="#${carouselId}"
                        data-bs-slide="prev">
                        <span class="carousel-control-prev-icon"></span>
                    </button>

                    <button class="carousel-control-next"
                        type="button"
                        data-bs-target="#${carouselId}"
                        data-bs-slide="next">
                        <span class="carousel-control-next-icon"></span>
                    </button>
                ` : ""}

            </div>

            <div class="card-body text-center">
                <p class="fw-bold mb-0">${item.missionHospitalName}</p>
                <p class="text-muted mb-0">${item.hospitalState ?? ""}</p>
            </div>

        </div>
        `;
    }).join("");
  },

  // ---- shared helpers, now top-level on renderFunctions ----
  getFileType: (doc) => {
    const url = doc?.url || doc?.data?.url || doc?.path || doc?.name || doc?.originalName || '';
    const type = (doc?.type || '').toLowerCase();
    const ext = (url.split('.').pop() || '').toLowerCase().split('?')[0];

    if (type.startsWith('image/') || /^(jpg|jpeg|png|gif|webp|bmp|svg)$/.test(ext)) return 'image';
    if (type === 'application/pdf' || ext === 'pdf') return 'pdf';
    if (type.startsWith('video/') || /^(mp4|webm|mov|avi|mkv)$/.test(ext)) return 'video';
    if (type.startsWith('audio/') || /^(mp3|wav|ogg|m4a)$/.test(ext)) return 'audio';
    if (/^(doc|docx|xls|xlsx|ppt|pptx)$/.test(ext)) return 'office';
    if (ext === 'csv') return 'csv';
    if (ext === 'txt') return 'text';
    return 'other';
  },

  getIcon: (fileType) => ({
    image: '🖼️', pdf: '📄', video: '🎬', audio: '🎵',
    office: '📊', csv: '📈', text: '📝', other: '📎'
  }[fileType] || '📎'),

  buildViewerHTML: (fileUrl, fileType) => {
    switch (fileType) {
      case 'image':
        return `
          <div class="w-100 h-100 p-2 d-flex justify-content-center align-items-center">
              <img src="${fileUrl}" class="img-fluid rounded shadow-sm" style="max-height: 500px; object-fit: contain;" alt="Document Preview" />
          </div>`;
      case 'pdf':
        return `
          <iframe class="doc-viewer-iframe w-100 h-100 rounded"
                  src="${fileUrl}#toolbar=1"
                  style="min-height: 520px; border: none;">
          </iframe>`;
      case 'video':
        return `
          <div class="w-100 h-100 p-2 d-flex justify-content-center align-items-center">
              <video controls class="w-100 rounded shadow-sm" style="max-height: 500px;">
                  <source src="${fileUrl}" />
                  Your browser does not support video playback.
              </video>
          </div>`;
      case 'audio':
        return `
          <div class="w-100 h-100 p-4 d-flex justify-content-center align-items-center">
              <audio controls class="w-100">
                  <source src="${fileUrl}" />
                  Your browser does not support audio playback.
              </audio>
          </div>`;
      case 'office':
      case 'excel':
      case 'csv':
      case 'xlsx': {
        const containerId = 'excel-viewer-' + Math.random().toString(36).slice(2);
        setTimeout(() => renderFunctions.renderExcelFile(fileUrl, containerId), 0);
        return `
      <div id="${containerId}" class="w-100 h-100 p-3" style="overflow: auto;">
          <div class="text-center text-muted p-5">
              <div class="spinner-border spinner-border-sm me-2" role="status"></div>
              Loading spreadsheet...
          </div>
      </div>`;
      }
      case 'text':
        return `
          <iframe class="doc-viewer-iframe w-100 h-100 rounded bg-white"
                  src="${fileUrl}"
                  style="min-height: 520px; border: none;">
          </iframe>`;
      default:
        return `
          <div class="text-center p-5">
              <div style="font-size: 3rem;">📎</div>
              <p class="text-muted mt-2">Preview not available for this file type.</p>
              <a href="${fileUrl}" target="_blank" rel="noopener" class="btn btn-primary btn-sm">
                  Open / Download File
              </a>
          </div>`;
    }
  },
  renderExcelFile: async (fileUrl, containerId) => {
    const container = document.getElementById(containerId);
    if (!container) return;

    try {
      const response = await fetch(fileUrl); // ← no credentials, plain fetch
      if (!response.ok) throw new Error(`Fetch failed: ${response.status}`);
      const arrayBuffer = await response.arrayBuffer();

      const workbook = XLSX.read(arrayBuffer, { type: 'array' });
      const sheetNames = workbook.SheetNames;

      const tabsHTML = sheetNames.length > 1 ? `
            <ul class="nav nav-tabs mb-2" role="tablist">
                ${sheetNames.map((name, i) => `
                    <li class="nav-item">
                        <button class="nav-link excel-sheet-tab ${i === 0 ? 'active' : ''}"
                                data-sheet="${name}" type="button">
                            ${name}
                        </button>
                    </li>
                `).join('')}
            </ul>
        ` : '';

      const renderSheet = (sheetName) => {
        const sheet = workbook.Sheets[sheetName];
        const html = XLSX.utils.sheet_to_html(sheet, { id: 'excel-table', editable: false });
        return `<div class="table-responsive">${html}</div>`;
      };

      container.innerHTML = `
            ${tabsHTML}
            <div class="excel-sheet-content">${renderSheet(sheetNames[0])}</div>
        `;

      container.querySelectorAll('.excel-sheet-tab').forEach(tab => {
        tab.addEventListener('click', () => {
          container.querySelectorAll('.excel-sheet-tab').forEach(t => t.classList.remove('active'));
          tab.classList.add('active');
          container.querySelector('.excel-sheet-content').innerHTML =
            renderSheet(tab.dataset.sheet);
        });
      });

      if (!document.getElementById('excel-table-style')) {
        const style = document.createElement('style');
        style.id = 'excel-table-style';
        style.textContent = `
                #excel-table { border-collapse: collapse; font-size: 13px; width: max-content; background: #fff; color: #212529; }
                #excel-table td, #excel-table th { border: 1px solid #dee2e6; padding: 4px 8px; white-space: nowrap; }
                #excel-table tr:nth-child(even) { background: #f8f9fa; }
            `;
        document.head.appendChild(style);
      }

    } catch (err) {
      console.error('Excel render error:', err);
      container.innerHTML = `
            <div class="text-center p-4">
                <p class="text-danger">Could not preview this spreadsheet.</p>
                <a href="${fileUrl}" target="_blank" rel="noopener" class="btn btn-primary btn-sm">
                    Open / Download File
                </a>
            </div>`;
    }
  },

  forceDownload: async (fileUrl, fileName) => {
    console.log("fileUrl", fileUrl);
    console.log("fileName", fileName);
    try {
      const response = await fetch(fileUrl);
      if (!response.ok) throw new Error(`Fetch failed: ${response.status}`);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = fileName || 'document';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      // Free the memory after the browser has started the download
      setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
    } catch (err) {
      console.error('Download failed:', err);
      // Last-resort fallback: at least open it so the user can save manually
      window.open(fileUrl, '_blank');
    }
  },

  // ---- main render function ----
  fovAppPDF: (data) => {
    console.log("fovAppPDF", data);
    const content = data?.content || data || {};

    const getFileType = renderFunctions.getFileType;
    const getIcon = renderFunctions.getIcon;
    const buildViewerHTML = renderFunctions.buildViewerHTML;

    // Helper to sanitize array inputs and filter out empty objects like {}
    const normalizeDocs = (docs) => {
      if (!Array.isArray(docs)) return [];
      return docs.filter(doc => doc && (doc.url || doc.data?.url || doc.path || doc.name || doc.originalName));
    };

    // Safely parse supporting documents (nested inside uploadDoc / uploadedDoc)
    const parsedSupportingDocs = [];
    if (Array.isArray(content.supportingDoc)) {
      content.supportingDoc.forEach(item => {
        const docsArray = item.uploadDoc || item.uploadedDoc;
        if (Array.isArray(docsArray)) {
          docsArray.forEach(doc => {
            if (doc && (doc.url || doc.data?.url || doc.path || doc.name || doc.originalName)) {
              parsedSupportingDocs.push({
                ...doc,
                displayName: item.docName || doc.originalName || doc.name || 'Supporting Document'
              });
            }
          });
        }
      });
    }

    // Build document categories, safely validating valid entries
    const docCategories = [
      { id: 'finalPDFDocs', title: 'Final Application PDFs', docs: normalizeDocs(content.finalPDFDocs) },
      { id: 'uploadBudget', title: 'Budget Documents', docs: normalizeDocs(content.uploadBudget) },
      { id: 'buildPlan', title: 'Building Plan / Cost Estim', docs: normalizeDocs(content.IFbuildPlanAndCostEstimPrepared || content.buildPlanAndCostEstimPrepared) },
      { id: 'supportingDoc', title: 'Supporting Documents', docs: parsedSupportingDocs }
    ].filter(category => category.docs.length > 0);

    const modalContentHTML = docCategories.length > 0 ? `
    <div class="container-fluid p-0">
        <!-- Category Navigation Tabs -->
        <ul class="nav nav-pills mb-3 flex-column flex-sm-row border-bottom pb-2" id="docCategoryTabs" role="tablist">
            ${docCategories.map((cat, catIdx) => `
                <li class="nav-item me-1 mb-1" role="presentation">
                    <button class="nav-link ${catIdx === 0 ? 'active' : ''} btn-sm w-100"
                            id="tab-${cat.id}"
                            data-bs-toggle="pill"
                            data-toggle="pill"
                            data-bs-target="#cat-${cat.id}"
                            href="#cat-${cat.id}"
                            type="button"
                            role="tab">
                        ${cat.title} <span class="badge bg-secondary rounded-pill ms-1">${cat.docs.length}</span>
                    </button>
                </li>
            `).join('')}
        </ul>

        <!-- Tab Content Panes -->
        <div class="tab-content" id="docCategoryTabsContent">
            ${docCategories.map((cat, catIdx) => {
      const firstDoc = cat.docs[0];
      const firstUrl = firstDoc?.url || firstDoc?.data?.url || firstDoc?.path || '';
      const firstType = getFileType(firstDoc);

      return `
              <div class="tab-pane fade ${catIdx === 0 ? 'show active' : ''}" id="cat-${cat.id}" role="tabpanel">
                  <div class="row g-3">

                      <!-- File List Sidebar -->
                      <div class="col-12 col-md-4 col-lg-3">
                          <div class="list-group pdf-file-list" style="max-height: 550px; overflow-y: auto;">
                              ${cat.docs.map((doc, docIdx) => {
        const fileUrl = doc.url || doc.data?.url || doc.path || '#';
        const fileTitle = doc.displayName || doc.originalName || doc.name || `Document ${docIdx + 1}`;
        const fileType = getFileType(doc);

        let formattedDate = '';
        let formattedTime = '';
        const rawDate = doc.createdAt?.$date || doc.createdAt;
        if (rawDate) {
          formattedDate = new Date(rawDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
          formattedTime = new Date(rawDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        }

        return `
              <a href="javascript:void(0)"
                  class="list-group-item list-group-item-action doc-item ${docIdx === 0 ? 'active' : ''}"
                  data-url="${fileUrl}"
                  data-file-type="${fileType}"
                  data-filename="${fileTitle}">
                  <div class="fw-bold text-truncate" title="${fileTitle}">
                      ${getIcon(fileType)} ${fileTitle}
                  </div>
                  ${formattedDate ? `
                      <small class="text-muted d-block mt-1">
                          📅 ${formattedDate} ${formattedTime ? `| 🕒 ${formattedTime}` : ''}
                      </small>
                  ` : ''}
              </a>
                          `;
      }).join('')}
                                </div>
                            </div>

                            <!-- Document Viewer Canvas -->
                            <div class="col-12 col-md-8 col-lg-9">
                                <div class="d-flex justify-content-end mb-2">
                                    <button type="button" class="btn btn-sm btn-outline-secondary doc-download-btn"
                                        data-url="${firstUrl}"
                                        data-filename="${firstDoc?.displayName || firstDoc?.originalName || firstDoc?.name || 'document'}">
                                        ⬇️ Download
                                    </button>
                                </div>
                                <div class="doc-viewer-container rounded border bg-light d-flex justify-content-center align-items-center"
                                    style="min-height: 520px; height: 100%; max-height: 600px; overflow: hidden;">
                                    ${buildViewerHTML(firstUrl, firstType)}
                                </div>
                            </div>

                        </div>
                    </div>
                `;
    }).join('')}
        </div>
    </div>
` : `
    <div class="alert alert-warning text-center my-4" role="alert">
        No uploaded documents or images are available for this application.
    </div>
`;

    return modalContentHTML;
  },

  fovAppComments: (data) => {
    console.log("fovAppComments", data);

    currentFovCommentApplication = data;

    editingFovCommentIndex = null;

    const comments =
      Array.isArray(data?.fovFeedback)
        ? data.fovFeedback
        : [];

    const lastPDF = data?.finalPDFDocs[data?.finalPDFDocs.length - 1];
    const lastPDFUrl = lastPDF?.url || "";

    // Render previous comments

    let commentsHTML = '';

    if (comments.length === 0) {

      commentsHTML = `

            <div class="text-center text-muted py-5 border rounded-3">
                <i class="fa fa-comments fa-2x mb-3"></i>
                <div>No feedback comments yet.</div>
            </div>
        `;

    } else {

      commentsHTML =
        comments.map((comment, index) =>
          renderSingleFovComment(comment, index)
        ).join('');
    }

    // Return complete modal content

    return `

        <div class="fov-feedback-container">
        <div class="row g-3">
          <div class="col-12 col-md-6">
          <div class="mb-3">
          <h5><i class="fa fa-file-pdf me-2"></i>Latest Submitted Form</h5>
          <small class="text-muted">View the latest submitted form for review.</small>
          </div>
            <iframe class="doc-viewer-iframe w-100 rounded"
                    src="${lastPDFUrl}#toolbar=1"
                    style="min-height: 550px; border: none;">
            </iframe>
          </div>
        <div class="col-12 col-md-6">
                    <!-- Header -->
            <div class="d-flex justify-content-between align-items-center mb-3">
                <div>
                    <h5 class="mb-1">
                        <i class="fa fa-comments me-2"></i>
                        FOV Feedback
                    </h5>
                    <small class="text-muted">
                        Review previous feedback and provide comments.
                    </small>
                </div>
            </div>
            <!-- Previous comments -->

            <div id="fovCommentsList" class="fov-comments-list" style="${data.Editor ? 'max-height:400px;' : 'max-height:550px;'}overflow-y:auto;padding-right:5px;' : ''}">
                ${commentsHTML}
            </div>
            ${data.Editor ? `
            <hr class="my-4">
            <!-- Editor -->
            <div id="fovCommentEditorSection">
                <label class="form-label fw-bold">
                    Add Feedback
                </label>
                <div id="fovNewComment" class="fov-editor"></div>
                <div class="d-flex justify-content-between align-items-center mt-2">
                    <small id="fovCommentError" class="text-danger"></small>
                    <button type="button" class="btn btn-primary" id="saveFovComment" data-fov-id="${escapeFovHtml(data?._id || '')}">
                        <i class="fa fa-paper-plane me-1"></i>
                        Add Comment
                    </button>
                </div>
            </div>
            ` : ''}
            </div>
            </div>
        </div>
    `;
  },
}

function convertToEmbedURL(url) {
  // YouTube
  const ytmatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/);
  if (ytmatch) {
    return {
      type: 'iframe',
      content: `https://www.youtube.com/embed/${ytmatch[1]}`
    };
  }

  // Vimeo (keep token if available)
  // const vimeoMatch = url.match(/vimeo\.com\/(?:video\/)?(\d+)(?:\/([\w-]+))?/);
  // if (vimeoMatch) {
  //   const videoId = vimeoMatch[1];
  //   const token = vimeoMatch[2] ? `/${vimeoMatch[2]}` : '';
  //   return { 
  //     type: 'iframe', 
  //     content: `https://player.vimeo.com/video/${videoId}${token}`
  //   };
  // }

  // Default fallback
  return {
    type: 'unsupported',
    content: url
  };
}

function toggleVideoDropdown(id, urlObj) {
  document.querySelectorAll('.dropdown-video').forEach(el => {
    if (el.id !== id) {
      el.innerHTML = '';
      el.style.display = 'none';
    }
  });

  const container = document.getElementById(id);
  const isOpen = container.style.display === 'block';

  if (isOpen) {
    container.innerHTML = '';
    container.style.display = 'none';
  } else {
    if (urlObj.type === 'iframe') {
      container.innerHTML = `<iframe width="100%" height="250" src="${urlObj.content}" frameborder="0" allowfullscreen></iframe>`;
    } else {
      window.open(urlObj.content, '_blank');
    }
    container.style.display = 'block';
  }
}


function arrayDataRenderInCard(cardtype, data, lastMonth) {
  return renderFunctions[cardtype] ? renderFunctions[cardtype](data, lastMonth) : '';
}

let avtrCurrTab = 'moreDetails'; // Initialize the current active tab
function avatarCardtoggleManager(type, data) {
  if (avtrCurrTab) {// Remove 'show' class from the current active tab
    document.getElementById(avtrCurrTab).classList.remove('show');
  }
  const newTab = document.getElementById(type);
  newTab.classList.add('show');

  const actions = {
    moreDetails: () => {
      if (avtrCurrTab !== 'moreDetails') {
        document.getElementById('moreDetails').classList.add('toggle_open');
      }
      else document.getElementById('moreDetails').classList.toggle('toggle_open');
    },
    logMeeting: () => {
      // document.getElementById('logMeeting').classList.toggle('toggle_open');
    },
    meetings: (data) => {
      const parsedData = JSON.parse(data);
      datatablesMyMeetings('#mymeetings', {
        isDeleted: false,
        "mentee.menteeId": parsedData.menteeId,
        "mentor.mentorId": parsedData.mentorId,
      }, 'addedBy');
    },
  };
  actions[type]?.(data);// Execute type appropriate function 
  avtrCurrTab = type;// Update the current selected tab
}


async function avatarcardClickManager(unParsedData) {
  let safeJson = unParsedData.replace(/\t/g, "\\t");
  const data = JSON.parse(safeJson);
  const isMentee = data.mentee;
  const isMentor = data.mentor;
  content = {
    info1: isMentee ? data.menteeUserEmail || '' : isMentor ? data.mentorUserEmail || '' : '',
    info2: isMentee ? `${data.course || ''} ${data.batch || ''}` : isMentor ? `${data.city || ''} ${data.state || ''}` : '',
    info3: isMentee ? (data.phoneNumber1 ? `Ph : ${data.phoneNumber1}` : '') : isMentor ? (data.pincode ? `Pin : ${data.pincode}` : '') : '',
    title: isMentee ? data.menteeUserName || '' : isMentor ? data.mentorUserName || '' : '',
    aboutme: data.aboutme,
    menteeId: data.menteeId,
    mentorId: data.mentorId,
    avatar: data.avatar,
    isMentee
  };
  console.log(content)

  context = {
    avatarCard: renderFunctions.avatarCard(content)
  }
  openModal('avatarCard', '', context).then(() => {
    fetchCollectionData('fetchCollectionData', { "collection": "FormIO", "query": { formKey: "mentorshipMeeting" } },)
      .then((results) => { formLoadMeeting(results.data[0], data) })
  });
}


async function loadGoogleMapsScript() {
  console.log('loadGoogleMapsScript')
  return new Promise((resolve, reject) => {
    if (window.google && window.google.maps) {
      resolve();
      return;
    }

    const script = document.createElement("script");
    script.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyCwln9Lfdk4lJMfbIKbJyk7ctVL3fe3Bfk";
    script.async = true;
    script.defer = true;
    script.onload = resolve;
    script.onerror = () => reject(new Error("Google Maps API failed to load."));

    document.head.appendChild(script);
  });
}

async function getCoordinatesFromPincode(address) {
  try {
    const API_KEY = "AIzaSyCwln9Lfdk4lJMfbIKbJyk7ctVL3fe3Bfk";
    const API_URL = "https://maps.googleapis.com/maps/api/geocode/json";

    const response = await fetch(`${API_URL}?address=${address},India&key=${API_KEY}`);
    // console.log('response', response)

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    if (data.results && data.results.length > 0) {
      const { lat, lng } = data.results[0].geometry.location;
      // console.log(address, 'lat', lat, 'lng', lng)
      return [lat, lng];
    } else {
      console.warn(`No location data found for address: ${address}`);
      return [0, 0]; // Return dummy coordinates if not found
    }
  } catch (error) {
    console.error("Error fetching coordinates:", error);
    return [0, 0]; // Return default value in case of error
  }
}



let activeMarker = null;

function generateHospitalCards(hospitals, markerArray, map, departments, missionRequests, specializations, mapLocationId, data) {

  const container = document.getElementById("hospitalCards");
  container.innerHTML = "";

  const userRole = usrDetails?.data?.roles;
  let hospitalCards = [];
  let scrollMarker = null;
  let markers = [];

  const statePincodeRanges = {
    "Andhra Pradesh": [500001, 534999],
    //  "Arunachal Pradesh": [791001, 792999],
    "Assam": [781001, 788999],
    "Bihar": [800001, 854999],
    "Chhattisgarh": [490001, 497999],
    "Delhi": [110000, 110099],
    // "Goa": [403001, 403999],
    "Gujarat": [360001, 396999],
    "Haryana": [121001, 136999],
    "Himachal Pradesh": [171001, 177999],
    "Jharkhand": [815001, 834999],
    "Karnataka": [560001, 591999],
    "Kerala": [670001, 695999],
    "Madhya Pradesh": [450001, 488999],
    "Maharashtra": [400001, 444999],
    // "Manipur": [795001, 795159],
    "Meghalaya": [793001, 794999],
    "Mizoram": [796001, 796999],
    "Nagaland": [797001, 798999],
    "Odisha": [751001, 770017],
    "Punjab": [140001, 160999],
    // "Rajasthan": [300001, 349999],
    // "Sikkim": [737101, 737139],
    "Tamil Nadu": [600001, 643999],
    "Telangana": [500001, 509999],
    // "Tripura": [799001, 799289],
    "Uttar Pradesh": [200001, 285999],
    "Uttarakhand": [244001, 263999],
    "West Bengal": [700001, 743999]
  };

  hospitals.forEach((hospital, index) => {

    // match the hospital id with msnHsptlMap
    let matchedMap = null;

    // match only if data exists
    if (data && Array.isArray(data)) {
      matchedMap = data.find(map => map.hospitalId === hospital._id);
    }
    const card = document.createElement("div");
    if (mapLocationId === 'conclaveHsptlMap') {
      card.className = "card m-3 mt-0 rounded-3 overflow-hidden hospital-card-wrapper col-md-3 px-0";
    }
    else {
      card.className = "card m-3 mt-0 rounded-3 overflow-hidden";
    }
    //card.style.maxHeight = "410px";
    card.dataset.index = index;
    card.dataset.hospitalName = (hospital.missionHospitalName || hospital.hospitalName || "Hospital").toLowerCase();
    hospitalCards.push(card);

    // Carousel for Images
    const carouselId = `carousel-${hospital._id}`;
    const images = hospital.hospitalImages && hospital.hospitalImages.length
      ? hospital.hospitalImages
      : [{ url: "./images/icons/hospital-icon.png" }];

    const carousel = `
        <div id="${carouselId}" class="carousel slide" data-bs-ride="carousel">
          <div class="carousel-inner" style="height: 210px;">  
            ${images.map((image, idx) => `
              <div class="carousel-item ${idx === 0 ? "active" : ""}">
                <img src="${image.url}" class="d-block w-100" alt="Hospital Image" onerror="this.onerror=null; this.src='./images/icons/hospital-icon.png'">
              </div>
            `).join("")}
          </div>
          ${images.length > 1 ? `
            <button class="carousel-control-prev" type="button" data-bs-target="#${carouselId}" data-bs-slide="prev">
              <span class="carousel-control-prev-icon"></span>
            </button>
            <button class="carousel-control-next" type="button" data-bs-target="#${carouselId}" data-bs-slide="next">
              <span class="carousel-control-next-icon"></span>
            </button>` : ""}
        </div>
      `;


    // Card Body
    const cardBody = `
   <div class="card-body pb-0 d-flex flex-column">

  <div>
    <p class="fs-6">
      <span class="fs-6 card-title">${hospital.missionHospitalName || hospital.hospitalName || "Hospital"}</span>
      ${hospital.hospitalWebsite ? `<a href="${hospital.hospitalWebsite}" target="_blank" style="font-size:12px;"><i class='fas fa-globe secondary-color'></i></a><br>` : ""}
    </p>
${!userRole.includes("VConnect Guest") ? `
    <p class="card-text text-black mb-0" style="font-size: small;">
      ${!matchedMap ? `
        ${hospital.hospitalBedStrength ? `<span class="text-muted"><i class="fas fa-procedures secondary-color"></i> Bed Strength:</span> ${hospital.hospitalBedStrength}<br>` : ''}
        ${hospital.hospitalPincode ? `<span class="text-muted"><i class="fa-map-marker-alt fas me-1 secondary-color"></i> Pincode:</span> ${hospital.hospitalPincode}<br>` : ''}
        ${hospital.hospitalEmail ? `<i class="fas fa-envelope secondary-color"></i><span class="text-muted"> Email:</span> <a href="mailto:${hospital.hospitalEmail}"> ${hospital.hospitalEmail}</a><br>` : ''}
      ` : ''}

      ${matchedMap ? `
        <span class="text-muted"><i class="fas fa-user secondary-color"></i> Contact Person:</span> ${matchedMap.contactPerson}<br>
        <span class="text-muted"><i class="fas fa-phone secondary-color"></i> Contact:</span> ${matchedMap.contactNumber}<br>
      ` : ''}
    </p>
  </div>

  <div class="d-flex justify-content-end mt-auto mb-3">
    <button class="read-more-btn" onclick="renderHospitalDetails('${hospital._id}', '${mapLocationId}')">Read More...</button>
  </div>
  ` : ''}

</div>
`;


    card.innerHTML = carousel + cardBody;
    container.appendChild(card);

    const scrollicon = {
      url: "./images/icons/location-icon-orange.png",
      scaledSize: new google.maps.Size(30, 30),
    };
    card.addEventListener("mouseenter", () => {
      // Only show scrollMarker if there's no active marker or if they are at different locations
      if (!activeMarker || activeMarker.getPosition().lat() !== markerArray[index].coords.lat || activeMarker.getPosition().lng() !== markerArray[index].coords.lng) {
        if (scrollMarker) {
          scrollMarker.setMap(null);
        }

        scrollMarker = new google.maps.Marker({
          position: markerArray[index].coords,
          map: map,
          title: markerArray[index].hsName,
          icon: scrollicon,
          zIndex: 1000,
          Animation: google.maps.Animation.BOUNCE
        });
      }
    });

    card.addEventListener("mouseleave", () => {
      if (scrollMarker) {
        scrollMarker.setMap(null);
        scrollMarker = null;
      }
    });

    card.addEventListener("click", () => {
      if (activeMarker) {
        activeMarker.setMap(null);
      }
      if (scrollMarker) {
        scrollMarker.setMap(null);
      }

      // Set the new active marker
      activeMarker = new google.maps.Marker({
        position: markerArray[index].coords,
        map: map,
        title: markerArray[index].hsName,
      });
      hospitalCards.forEach((card) => card.classList.remove("border", "border-primary"));
      card.classList.add("border", "border-primary");

    });
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const cardIndex = parseInt(entry.target.dataset.index, 14);
          if (isNaN(cardIndex)) return;

          //map.setCenter(markerArray[cardIndex].coords);

          // if (activeMarker) {
          //   activeMarker.setMap(null);
          // }

          // activeMarker = new google.maps.Marker({
          //   position: markerArray[cardIndex].coords,
          //   map: map,
          //   title: markerArray[cardIndex].hsName,
          // });
        }
      });
    },
    { threshold: 0.5 }
  );

  document.querySelectorAll(".card").forEach((card) => observer.observe(card));

  setTimeout(() => {
    markerArray.forEach((markerData, index) => {
      const hospital = hospitals[index];
      if (!hospital || !hospital.hospitalLatitude || !hospital.hospitalLongitude) return;

      let iconUrl;
      if (mapLocationId !== "conclaveHsptlMap") {
        const isCredentialed = hospital.hospitalCredentialed === true;
        const isMnwHospital = hospital.mnwHospital === true;

        iconUrl = (isCredentialed && isMnwHospital)
          ? "./images/icons/location-icon.png"
          : "./images/icons/pin.png";
      } else if (mapLocationId === "conclaveHsptlMap") {
        iconUrl = "https://s3.amazonaws.com/img.studenthub.in/CMCVConnect_Portal/Pictures/_9f26889742ea80f2711a02a7dec36ddb_Pictures.png";
      }

      const markerObj = {
        coords: markerData.coords,
        title: markerData.hsName,
        iconUrl,
        index
      };

      markers.push(markerObj);
    });

    const zoomLevel = map.getZoom();
    const scaledSize = getScaledSize(zoomLevel);
    markers.forEach(markerObj => {
      const marker = new google.maps.Marker({
        position: markerObj.coords,
        map: map,
        title: markerObj.title,
        icon: {
          url: markerObj.iconUrl,
          scaledSize: scaledSize,
        }
      });

      // Add click handler
      marker.addListener("click", () => {
        if (activeMarker) activeMarker.setMap(null);
        activeMarker = new google.maps.Marker({
          position: markerObj.coords,
          map: map,
          title: markerObj.title,
        });

        const targetCard = hospitalCards[markerObj.index];
        targetCard.scrollIntoView({ behavior: "auto", block: "center" });
        hospitalCards.forEach(card => card.classList.remove("border", "border-primary"));
        targetCard.classList.add("border", "border-primary");
      });

      markerObj.markerInstance = marker;
    });


    // Zoom-based resizing
    map.addListener("zoom_changed", () => {
      const zoomLevel = map.getZoom();
      const newSize = getScaledSize(zoomLevel);

      markers.forEach(markerObj => {
        if (markerObj.markerInstance) {
          markerObj.markerInstance.setIcon({
            url: markerObj.iconUrl,
            scaledSize: newSize,
          });
        }
      });
    });

    function getScaledSize(zoom) {
      iconBaseSize = mapLocationId === "conclaveHsptlMap" ? 35 : 20;
      const size = Math.max(iconBaseSize, Math.min(zoom * 3, 30)); // Adjust range here
      return new google.maps.Size(size, size);
    }

  }, 200);

  function populateStateFilter() {

    const searchInput = document.createElement("input");
    searchInput.type = "text";
    searchInput.className = "border p-1 my-2 w-100";
    searchInput.style.fontSize = "12px";
    searchInput.placeholder = "Search State...";

    const selectAllWrapper = document.createElement("li");
    selectAllWrapper.className = "dropdown-item";
    const selectAllCheckbox = document.createElement("input");
    selectAllCheckbox.type = "checkbox";
    selectAllCheckbox.className = "me-2";
    selectAllCheckbox.id = "stateSelectAll";
    const selectAllLabel = document.createElement("label");
    selectAllLabel.setAttribute("for", "stateSelectAll");
    selectAllLabel.textContent = "Select All";

    selectAllWrapper.appendChild(selectAllCheckbox);
    selectAllWrapper.appendChild(selectAllLabel);
    if (mapLocationId === "contactMap") {
      const stateCheckboxList = document.getElementById("stateCheckboxList");
      stateCheckboxList.innerHTML = "";
      stateCheckboxList.appendChild(searchInput);
      stateCheckboxList.appendChild(selectAllWrapper);
    }

    const scrollableDiv = document.createElement("div");
    scrollableDiv.style.maxHeight = "200px";
    scrollableDiv.style.overflowY = "auto";
    scrollableDiv.style.scrollbarWidth = "thin";

    Object.keys(statePincodeRanges).sort().forEach(state => {
      const listItem = document.createElement("li");
      listItem.className = "dropdown-item state-item";

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.value = state;
      checkbox.className = "state-checkbox me-2";

      const label = document.createElement("label");
      label.textContent = state;
      label.className = "ms-1 flex-grow-1";

      listItem.addEventListener("click", function (event) {
        event.stopPropagation();
        if (event.target !== checkbox) {
          checkbox.checked = !checkbox.checked;
          checkbox.dispatchEvent(new Event("change"));
        }
      });

      checkbox.addEventListener("change", () => {
        updateFilters();

        const checkboxes = scrollableDiv.querySelectorAll(".state-checkbox");
        const allChecked = Array.from(checkboxes).every(cb => cb.checked);
        const anyChecked = Array.from(checkboxes).some(cb => cb.checked);
        selectAllCheckbox.checked = allChecked;
        selectAllCheckbox.indeterminate = !allChecked && anyChecked;
      });

      listItem.appendChild(checkbox);
      listItem.appendChild(label);
      scrollableDiv.appendChild(listItem);
    });

    searchInput.addEventListener("input", function () {
      const searchTerm = this.value.toLowerCase();
      document.querySelectorAll(".state-item").forEach(item => {
        const text = item.textContent.toLowerCase();
        item.style.display = text.includes(searchTerm) ? "block" : "none";
      });
    });

    selectAllCheckbox.addEventListener("change", function () {
      const allStateCheckboxes = scrollableDiv.querySelectorAll(".state-checkbox");
      allStateCheckboxes.forEach(cb => {
        cb.checked = this.checked;
      });
      updateFilters();
    });

    stateCheckboxList.appendChild(scrollableDiv);

    const clearFiltersListItem = document.createElement("li");
    clearFiltersListItem.className = "text-center mt-2";
    const clearFiltersButton = document.createElement("button");
    clearFiltersButton.type = "button";
    clearFiltersButton.className = "btn btn-sm btn-outline-secondary";
    clearFiltersButton.textContent = "Clear Filters";
    clearFiltersButton.addEventListener("click", () => {
      clearFilters("state");
    });

    clearFiltersListItem.appendChild(clearFiltersButton);
    stateCheckboxList.appendChild(clearFiltersListItem);
  }


  function populateDepartmentFilter() {

    const selectedDepartmentIds = new Set(
      Array.from(document.querySelectorAll(".department-checkbox:checked")).map(cb => cb.value)
    );


    const searchInput = document.createElement("input");
    searchInput.type = "text";
    searchInput.className = "border p-1 my-2 w-100";
    searchInput.style.fontSize = "12px";
    searchInput.placeholder = "Search Department...";

    const selectAllWrapper = document.createElement("li");
    selectAllWrapper.className = "dropdown-item";
    const selectAllCheckbox = document.createElement("input");
    selectAllCheckbox.type = "checkbox";
    selectAllCheckbox.className = "me-2";
    selectAllCheckbox.id = "departmentSelectAll";
    const selectAllLabel = document.createElement("label");
    selectAllLabel.setAttribute("for", "departmentSelectAll");
    selectAllLabel.textContent = "Select All";

    selectAllWrapper.appendChild(selectAllCheckbox);
    selectAllWrapper.appendChild(selectAllLabel);

    const departmentCount = new Map();
    hospitals.forEach(hospital => {
      if (hospital.hospitalDepartments) {
        hospital.hospitalDepartments.forEach(dept => {
          const deptId = String(dept.missionDepartmentDocId).trim();
          departmentCount.set(deptId, (departmentCount.get(deptId) || 0) + 1);
        });
      }
    });

    const validDepartments = new Map();
    departments.forEach(dept => {
      const deptId = String(dept._id).trim();
      if (departmentCount.has(deptId)) {
        validDepartments.set(deptId, { name: dept.name, count: departmentCount.get(deptId) });
      }
    });

    if (validDepartments.size === 0) return;

    const scrollableDiv = document.createElement("div");
    scrollableDiv.style.maxHeight = "200px";
    scrollableDiv.style.overflowY = "auto";
    scrollableDiv.style.scrollbarWidth = "thin";

    Array.from(validDepartments.entries())
      .sort((a, b) => a[1].name.localeCompare(b[1].name))
      .forEach(([departmentId, data]) => {
        const listItem = document.createElement("li");
        listItem.className = "dropdown-item department-item";

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.value = departmentId;
        checkbox.className = "department-checkbox me-2";
        if (selectedDepartmentIds.has(departmentId)) {
          checkbox.checked = true;
        }

        const label = document.createElement("label");
        label.textContent = `${data.name} (${data.count})`;
        label.className = "ms-1 flex-grow-1";

        listItem.addEventListener("click", function (event) {
          event.stopPropagation();
          if (event.target !== checkbox) {
            checkbox.checked = !checkbox.checked;
            checkbox.dispatchEvent(new Event("change"));
          }
        });

        checkbox.addEventListener("change", () => {
          updateFilters();
          const checkboxes = scrollableDiv.querySelectorAll(".department-checkbox");
          const allChecked = Array.from(checkboxes).every(cb => cb.checked);
          const anyChecked = Array.from(checkboxes).some(cb => cb.checked);
          selectAllCheckbox.checked = allChecked;
          selectAllCheckbox.indeterminate = !allChecked && anyChecked;
        });

        listItem.appendChild(checkbox);
        listItem.appendChild(label);
        scrollableDiv.appendChild(listItem);
      });

    searchInput.addEventListener("input", function () {
      const searchTerm = this.value.toLowerCase();
      document.querySelectorAll(".department-item").forEach(item => {
        item.style.display = item.textContent.toLowerCase().includes(searchTerm) ? "block" : "none";
      });
    });

    selectAllCheckbox.addEventListener("change", function () {
      const checkboxes = scrollableDiv.querySelectorAll(".department-checkbox");
      checkboxes.forEach(cb => {
        cb.checked = this.checked;
      });
      updateFilters();
    });


    const clearFiltersListItem = document.createElement("li");
    clearFiltersListItem.className = "text-center mt-2";
    const clearFiltersButton = document.createElement("button");
    clearFiltersButton.type = "button";
    clearFiltersButton.className = "btn btn-sm btn-outline-secondary";
    clearFiltersButton.textContent = "Clear Filters";
    clearFiltersButton.addEventListener("click", () => clearFilters("department"));
    clearFiltersListItem.appendChild(clearFiltersButton);
    if (!userRole.includes("VConnect Guest")) {
      const departmentCheckboxList = document.getElementById("departmentCheckboxList");
      departmentCheckboxList.innerHTML = "";
      departmentCheckboxList.appendChild(searchInput);
      departmentCheckboxList.appendChild(selectAllWrapper);
      departmentCheckboxList.appendChild(scrollableDiv);
      departmentCheckboxList.appendChild(clearFiltersListItem);
    }
  }

  function populateManpowerFilter() {

    const searchInput = document.createElement("input");
    searchInput.type = "text";
    searchInput.className = "border p-1 my-2 w-100";
    searchInput.style.fontSize = "12px";
    searchInput.placeholder = "Search Specialization...";

    const selectAllWrapper = document.createElement("li");
    selectAllWrapper.className = "dropdown-item";
    const selectAllCheckbox = document.createElement("input");
    selectAllCheckbox.type = "checkbox";
    selectAllCheckbox.className = "me-2";
    selectAllCheckbox.id = "manpowerSelectAll";
    const selectAllLabel = document.createElement("label");
    selectAllLabel.setAttribute("for", "manpowerSelectAll");
    selectAllLabel.textContent = "Select All";

    selectAllWrapper.appendChild(selectAllCheckbox);
    selectAllWrapper.appendChild(selectAllLabel);

    const manpowerCount = new Map();
    missionRequests.forEach(request => {
      const specId = String(request.specializationId).trim();
      manpowerCount.set(specId, (manpowerCount.get(specId) || 0) + 1);
    });

    const validSpecializations = new Map();
    specializations.forEach(spec => {
      const specId = String(spec._id).trim();
      if (manpowerCount.has(specId)) {
        validSpecializations.set(specId, { name: spec.name, count: manpowerCount.get(specId) });
      }
    });

    if (validSpecializations.size === 0) return;

    const scrollableDiv = document.createElement("div");
    scrollableDiv.style.maxHeight = "200px";
    scrollableDiv.style.overflowY = "auto";
    scrollableDiv.style.scrollbarWidth = "thin";

    Array.from(validSpecializations.entries())
      .sort((a, b) => a[1].name.localeCompare(b[1].name))
      .forEach(([specId, data]) => {
        const listItem = document.createElement("li");
        listItem.className = "dropdown-item manpower-item";

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.value = specId;
        checkbox.className = "manpower-checkbox me-2";

        const label = document.createElement("label");
        label.textContent = `${data.name} (${data.count})`;
        label.className = "ms-1 flex-grow-1";

        listItem.addEventListener("click", function (event) {
          event.stopPropagation();
          if (event.target !== checkbox) {
            checkbox.checked = !checkbox.checked;
            checkbox.dispatchEvent(new Event("change"));
          }
        });

        checkbox.addEventListener("change", () => {
          updateFilters();
          const checkboxes = scrollableDiv.querySelectorAll(".manpower-checkbox");
          const allChecked = Array.from(checkboxes).every(cb => cb.checked);
          const anyChecked = Array.from(checkboxes).some(cb => cb.checked);
          selectAllCheckbox.checked = allChecked;
          selectAllCheckbox.indeterminate = !allChecked && anyChecked;
        });

        listItem.appendChild(checkbox);
        listItem.appendChild(label);
        scrollableDiv.appendChild(listItem);
      });

    searchInput.addEventListener("input", function () {
      const searchTerm = this.value.toLowerCase();
      document.querySelectorAll(".manpower-item").forEach(item => {
        item.style.display = item.textContent.toLowerCase().includes(searchTerm) ? "block" : "none";
      });
    });

    selectAllCheckbox.addEventListener("change", function () {
      const checkboxes = scrollableDiv.querySelectorAll(".manpower-checkbox");
      checkboxes.forEach(cb => {
        cb.checked = this.checked;
      });
      updateFilters();
    });


    const clearFiltersListItem = document.createElement("li");
    clearFiltersListItem.className = "text-center mt-2";
    const clearFiltersButton = document.createElement("button");
    clearFiltersButton.type = "button";
    clearFiltersButton.className = "btn btn-sm btn-outline-secondary";
    clearFiltersButton.textContent = "Clear Filters";
    clearFiltersButton.addEventListener("click", () => clearFilters("manpower"));
    clearFiltersListItem.appendChild(clearFiltersButton);
    if (!userRole.includes("VConnect Guest")) {
      const manpowerCheckboxList = document.getElementById("manpowerCheckboxList");
      manpowerCheckboxList.innerHTML = "";
      manpowerCheckboxList.appendChild(searchInput);
      manpowerCheckboxList.appendChild(selectAllWrapper);
      manpowerCheckboxList.appendChild(scrollableDiv);
      manpowerCheckboxList.appendChild(clearFiltersListItem);
    }
  }

  // Clear All Filters Button
  function addClearAllButton() {
    const filtersContainer = document.getElementById("Clearfilters");

    if (document.getElementById("clearAllButton")) return;

    const clearAllButton = document.createElement("button");
    clearAllButton.id = "clearAllButton";
    clearAllButton.type = "button";
    clearAllButton.className = "btn border btn-outline-secondary";
    clearAllButton.textContent = "Clear All";
    clearAllButton.addEventListener("click", () => {
      clearFilters("state");
      clearFilters("department");
      clearFilters("manpower");
      populateStateFilter();
      populateDepartmentFilter();
      populateManpowerFilter();
    });

    filtersContainer.appendChild(clearAllButton);
  }

  function clearFilters(type) {
    // Uncheck all individual checkboxes
    document.querySelectorAll(`.${type}-checkbox`).forEach(cb => cb.checked = false);

    // Uncheck the Select All checkbox
    const selectAllCheckbox = document.querySelector(`#${type}SelectAll`);
    if (selectAllCheckbox) selectAllCheckbox.checked = false;

    updateFilters();
  }

  function updateFilters() {
    const selectedStates = Array.from(document.querySelectorAll(".state-checkbox:checked")).map(cb => cb.value);
    const selectedDepartmentIds = Array.from(document.querySelectorAll(".department-checkbox:checked")).map(cb => String(cb.value));
    const selectedManpowerIds = Array.from(document.querySelectorAll(".manpower-checkbox:checked")).map(cb => String(cb.value));

    document.getElementById("searchInput").value = "";
    document.getElementById("clearSearch").style.display = "none";

    let bounds = new google.maps.LatLngBounds();
    let hasVisibleHospitals = false;

    hospitals.forEach((hospital, index) => {
      const hospitalCard = hospitalCards[index];
      const markerObj = markers[index];
      if (!hospitalCard || !markerObj || !markerObj.markerInstance) return;

      const pincode = parseInt(hospital.hospitalPincode, 10);

      // State Filtering
      const isWithinStateRange = selectedStates.length === 0 || selectedStates.some(state => {
        const [minPincode, maxPincode] = statePincodeRanges[state] || [0, 999999];
        return pincode >= minPincode && pincode <= maxPincode;
      });

      // Department Filtering
      const hasDepartment = selectedDepartmentIds.length === 0 || (
        hospital.hospitalDepartments &&
        hospital.hospitalDepartments.some(dept => selectedDepartmentIds.includes(String(dept.missionDepartmentDocId)))
      );

      // Manpower Request Filtering
      const hasManpowerRequest = selectedManpowerIds.length === 0 || (
        missionRequests.some(request =>
          request.missionHospitalId === hospital._id &&
          selectedManpowerIds.includes(String(request.specializationId))
        )
      );

      if (isWithinStateRange && hasDepartment && hasManpowerRequest) {
        hospitalCard.style.display = "block";
        markerObj.markerInstance.setMap(map);
        bounds.extend(markerObj.markerInstance.getPosition());
        hasVisibleHospitals = true;
      } else {
        hospitalCard.style.display = "none";
        markerObj.markerInstance.setMap(null);
      }
    });

    searchitems = hospitals
      .filter((_, index) => hospitalCards[index].style.display === "block")
      .map(hospital => hospital.missionHospitalName);

    if (hasVisibleHospitals) {
      map.fitBounds(bounds);
      if (map.getZoom() > 12) map.setZoom(12);
    }
  }

  if (mapLocationId === "contactMap") {
    document.querySelectorAll('.accordion-button').forEach(button => {
      const targetSelector = button.getAttribute('data-bs-target');
      const collapseEl = document.querySelector(targetSelector);
      const icon = button.querySelector('.arrow-icon i');

      collapseEl.addEventListener('show.bs.collapse', () => {
        icon.classList.remove('fa-chevron-right');
        icon.classList.add('fa-chevron-down');
      });

      collapseEl.addEventListener('hide.bs.collapse', () => {
        icon.classList.remove('fa-chevron-down');
        icon.classList.add('fa-chevron-right');
      });
    });
  }


  document.querySelectorAll('.dropdown-menu').forEach(menu => {
    menu.addEventListener('click', (e) => {
      e.stopPropagation(); // Prevent Bootstrap from closing dropdown
    });
  });


  // Initialize Filters
  if (mapLocationId === "contactMap") {
    populateStateFilter();
    populateDepartmentFilter();
    populateManpowerFilter();
    addClearAllButton();
  }
}

const hospitalsWithCoord = [];

async function loadMap(mapLocationId, hospIds, data) {
  await loadGoogleMapsScript();

  const toggleBtn = document.getElementById("layoutToggleBtn");
  const mapColumn = document.getElementById("mapColumn");
  const cardColumn = document.getElementById("cardColumn");
  const hospitalCards = document.getElementById("hospitalCards");

  let isMapVisible = false;

  if (toggleBtn && mapColumn && cardColumn && hospitalCards) {
    toggleBtn.addEventListener("click", function () {

      isMapVisible = !isMapVisible;

      if (isMapVisible) {

        // SHOW MAP MODE
        mapColumn.classList.remove("d-none");
        cardColumn.classList.remove("col-12");
        cardColumn.classList.add("col-md-3");

        hospitalCards.classList.remove("row"); // remove grid
        hospitalCards.style.maxHeight = "70vh";

        // Make cards full width in side panel
        document.querySelectorAll(".hospital-card-wrapper").forEach(el => {
          el.className = "hospital-card-wrapper card m-3 mt-0 px-0 rounded-3 overflow-hidden"; // remove col-md-6 and col-lg-3
        });

        toggleBtn.textContent = "Back to Hospital Tiles";

        setTimeout(() => {
          if (window.map) {
            google.maps.event.trigger(window.map, "resize");
          }
        }, 300);

      } else {

        // CARDS ONLY MODE
        mapColumn.classList.add("d-none");
        cardColumn.classList.remove("col-md-3");
        cardColumn.classList.add("col-12");

        hospitalCards.classList.add("row");
        hospitalCards.style.maxHeight = "unset";
        hospitalCards.style.overflowY = "unset";

        // Restore 4 column grid
        document.querySelectorAll(".hospital-card-wrapper").forEach(el => {
          el.className = "hospital-card-wrapper col-md-6 col-lg-3 card m-3 px-0 rounded-3 overflow-hidden"; // restore col-md-6 and col-lg-3
        });

        toggleBtn.textContent = "Show Interactive Map";
      }

    });
  }

  const userRole = usrDetails?.data?.roles;
  hospitalsWithCoord.length = 0;
  activeMarker = null;

  let collections = [];

  if ((mapLocationId === "contactMap" || mapLocationId === "msnHsptlMap" || mapLocationId === "msnVisitMap") && !userRole.includes("VConnect Guest")) {
    collections = [
      {
        "collection": "MissionHospital",
        "query": { _id: { $in: hospIds }, isDeleted: "false" },
        projection: {
          _id: 1, missionHospitalName: 1, hospitalWebsite: 1, hospitalPincode: 1, hospitalDepartments: 1, mnwHospital: 1, hospitalCredentialed: 1,
          hospitalPhone: 1, hospitalEmail: 1, hospitalBedStrength: 1, hospitalLatitude: 1, hospitalLongitude: 1, hospitalState: 1,
          hospitalImages: {
            $map: { input: "$hospitalImages", as: "image", in: { name: "$$image.name", url: "$$image.url" } }
          }
        }
      },
      { "collection": "MissionDepartments", "query": { isDeleted: "false" }, projection: { _id: 1, name: 1 } },
      { "collection": "MissionRequests", "query": { isDeleted: 'false', "missionStatus": { $in: ['Open', 'InProgress'] } }, projection: { _id: 1, missionHospitalId: 1, specializationId: 1 } },
      { "collection": "MissionSpecializations", "query": { isDeleted: 'false' }, projection: { _id: 1, name: 1 } }
    ];
  } else if (mapLocationId === "conclaveHsptlMap" && !userRole.includes("VConnect Guest")) {
    collections = [
      {
        "collection": "ConclaveHsptl",
        "query": { isDeleted: false },
        projection: {
          _id: 1, hospitalName: 1, hospitalWebsite: 1, hospitalPincode: 1, hospitalDepartments: 1, mnwHospital: 1, hospitalCredentialed: 1,
          hospitalPhone: 1, hospitalEmail: 1, hospitalBedStrength: 1, hospitalLatitude: 1, hospitalLongitude: 1, hospitalState: 1,
          hospitalImages: {
            $map: { input: "$hospitalImages", as: "image", in: { name: "$$image.name", url: "$$image.url" } }
          }
        }
      }
    ];
  } else if (mapLocationId === "contactMap" && userRole.includes("VConnect Guest")) {
    console.log("VConnect Guest");
    collections = [
      {
        "collection": "MissionHospital",
        "query": { _id: { $in: hospIds }, isDeleted: "false" },
        projection: {
          _id: 1, missionHospitalName: 1, hospitalWebsite: 1, hospitalPincode: 1, hospitalDepartments: 1, mnwHospital: 1, hospitalCredentialed: 1,
          hospitalPhone: 1, hospitalEmail: 1, hospitalBedStrength: 1, hospitalLatitude: 1, hospitalLongitude: 1, hospitalState: 1,
          hospitalImages: {
            $map: { input: "$hospitalImages", as: "image", in: { name: "$$image.name", url: "$$image.url" } }
          }
        }
      }
    ];
  }

  const fetchedResults = await fetchedDataAPI("fetchCollectionData", collections);

  let hospitals = fetchedResults["MissionHospital"]?.data || [];
  const departmentsData = fetchedResults["MissionDepartments"]?.data || [];
  const missionRequests = fetchedResults["MissionRequests"]?.data || [];
  const specializations = fetchedResults["MissionSpecializations"]?.data || [];
  const conclaveHospitals = fetchedResults["ConclaveHsptl"]?.data || [];

  if (mapLocationId === "conclaveHsptlMap") {
    hospitals = conclaveHospitals;
  }

  if (hospitals.length === 0) return console.warn("No hospitals found.");

  const markerArray = [];
  const bounds = new google.maps.LatLngBounds();

  for (const hospital of hospitals) {
    const displayName = hospital.missionHospitalName || hospital.hospitalName;

    if (hospital.hospitalLatitude && hospital.hospitalLongitude) {
      const coords = {
        lat: parseFloat(hospital.hospitalLatitude),
        lng: parseFloat(hospital.hospitalLongitude)
      };

      markerArray.push({ id: hospital._id, coords, hsName: displayName });
      hospitalsWithCoord.push(hospital);
      bounds.extend(new google.maps.LatLng(coords.lat, coords.lng));
    }
    // else {
    //   const coords = await getCoordinatesFromPincode(hospital.missionHospitalName);
    //   if (coords) {
    //     markerArray.push({ id: hospital._id, coords: { lat: coords[0], lng: coords[1] }, hsName: hospital.missionHospitalName });
    //     bounds.extend(new google.maps.LatLng(coords[0], coords[1])); // Extend bounds for each marker
    //     hospitalsWithCoord.push(hospital); // Store only hospitals with valid coordinates

    //   }
    // }
  }

  if (markerArray.length === 0) {
    console.warn("No valid coordinates found.");
    return;
  }

  window.mapInstance = new google.maps.Map(document.getElementById(mapLocationId), {
    center: markerArray[0].coords,
    zoom: 6,
  });

  window.mapInstance.fitBounds(bounds);

  google.maps.event.addListenerOnce(window.mapInstance, "idle", function () {
    if (window.mapInstance.getZoom() > 18) {
      window.mapInstance.setZoom(18);
    }
  });

  setTimeout(() => {
    generateHospitalCards(hospitalsWithCoord, markerArray, window.mapInstance, departmentsData, missionRequests, specializations, mapLocationId, data);
  }, 500);

  searchitems = hospitalsWithCoord.map(h => h.missionHospitalName || h.hospitalName);
}
function showSuggestions() {
  let input = document.getElementById("searchInput").value.toLowerCase();
  let suggestionsBox = document.getElementById("suggestionsBox");
  let clearButton = document.getElementById("clearSearch");
  suggestionsBox.innerHTML = "";

  if (input) {
    clearButton.style.display = "block";
    let filteredItems = searchitems.filter(item => item.toLowerCase().includes(input));

    if (filteredItems.length > 0) {
      suggestionsBox.style.display = "block";
      filteredItems.forEach(item => {
        let div = document.createElement("div");
        div.textContent = item;
        div.onclick = function () {
          document.getElementById("searchInput").value = item;
          suggestionsBox.style.display = "none";
          clearButton.style.display = "block";

          scrollToHospitalCard(item);
        };
        suggestionsBox.appendChild(div);
      });
    } else {
      suggestionsBox.style.display = "none";
    }
  } else {
    clearButton.style.display = "none"; // Hide button if input is empty
    suggestionsBox.style.display = "none";
  }
}

function scrollToHospitalCard(hospitalName) {

  document.querySelectorAll("[data-hospital-name]").forEach(card => {
    card.classList.remove("border", "border-primary");
  });

  let hospitalCard = document.querySelector(`[data-hospital-name="${hospitalName.toLowerCase()}"]`);

  if (hospitalCard) {
    hospitalCard.scrollIntoView({ behavior: 'auto', block: 'center' });
    hospitalCard.classList.add("border", "border-primary");

    // Find the hospital data
    let hospital = hospitalsWithCoord.find(h => h.missionHospitalName.toLowerCase() === hospitalName.toLowerCase());
    if (!hospital) return;

    if (activeMarker) {
      activeMarker.setMap(null);
    }

    activeMarker = new google.maps.Marker({
      position: { lat: hospital.hospitalLatitude, lng: hospital.hospitalLongitude },
      map: window.mapInstance,
      title: hospital.missionHospitalName,
      animation: google.maps.Animation.DROP
    });

    // Center the map on the selected hospital
    // window.mapInstance.setCenter({ lat: hospital.hospitalLatitude, lng: hospital.hospitalLongitude });
    // window.mapInstance.setZoom(14);
  }
}

function clearSearch() {
  document.getElementById("searchInput").value = "";
  document.getElementById("suggestionsBox").style.display = "none";
  document.getElementById("clearSearch").style.display = "none";
  searchInput.focus();
}

async function locateMap(mapLocationId, hospIds) {

  let collections = null;

  if (mapLocationId === "contactMap" || mapLocationId === "msnHsptlMap" || mapLocationId === "msnVisitMap") {
    collections = {
      collection: "MissionHospital",
      query: { _id: { $in: hospIds }, isDeleted: "false" },
      projection: {
        _id: 1, missionHospitalName: 1, hospitalLatitude: 1, hospitalLongitude: 1,
      }
    }
  } else if (mapLocationId === "conclaveHsptlMap") {
    collections = {
      collection: "ConclaveHsptl",
      query: { _id: { $in: hospIds }, isDeleted: false },
      projection: {
        _id: 1, hospitalName: 1, hospitalLatitude: 1, hospitalLongitude: 1,
      }
    }
  }

  const fetchedResults = await fetchCollectionData("fetchCollectionData", collections);
  const hospitals = fetchedResults.data;

  if (hospitals.length === 0) {
    console.warn("No hospitals found.");
    return;
  }

  const hospital = hospitals[0];

  if (!hospital.hospitalLatitude || !hospital.hospitalLongitude) {
    console.warn("No valid coordinates found for the selected hospital.");
    return;
  }

  const coords = { lat: hospital.hospitalLatitude, lng: hospital.hospitalLongitude };

  window.mapInstance = new google.maps.Map(document.getElementById('mapOnCard'), {
    center: coords,
    zoom: 17,
  });

  activeMarker = new google.maps.Marker({
    position: coords,
    map: window.mapInstance,
    title: hospital.missionHospitalName,
  });

  google.maps.event.addListenerOnce(window.mapInstance, "idle", function () {
    if (window.mapInstance.getZoom() > 17) {
      window.mapInstance.setZoom(17);
    }
  });
}

let news;  // Array to store fetched news
let skip;  // Tracks the number of items already fetched
let searchQuery;
let currMonth; //Last month for feedbacking for archive news
const initialLimit = 20; // Number of news items to fetch initially
const scrollLimit = 4; // Number of news items to fetch on each scroll

async function fetchNews(query, limit, skip = 0) {
  console.log('query', query)
  const fetchQuery = {
    "collection": "NewsData",
    "query": {
      ...query,
      'newsEditorStatus': 'approved', 'newsTags.newsTagId': 'MSN',
      "isDeleted": "false",

    },
    "projection": { "_id": 1, "newsTitle": 1, "newsSubTitle": 1, "newsImage": 1, "newsDate": 1 },
    "options": { "limit": limit, "skip": skip, "sort": { "newsDate": -1 } }
  };
  console.log('fetchQuery', fetchQuery)
  try {
    const response = await fetchCollectionData('fetchCollectionData', fetchQuery);
    console.log("Response from fetchCollectionData:", response);

    // Check if data exists
    if (response && Array.isArray(response.data)) {
      return response.data;
    } else {
      console.error("Response data is not an array:", response);
      return []; // Return an empty array if data is not as expected
    }
  } catch (error) {
    console.error("Error in fetchCollectionData:", error);
    return []; // Return an empty array in case of an error
  }
}

async function loadInitialNews(query) {
  const initialNews = await fetchNews(query, initialLimit, skip);
  news = [...news, ...initialNews];
  skip += initialNews.length;
}

async function loadMoreNews() {
  const additionalNews = await fetchNews(searchQuery, scrollLimit, skip);
  news = [...news, ...additionalNews];
  skip += additionalNews.length; // Increment skip by the number of records fetched
  console.log('Loaded more news:', additionalNews);
  const renderedNews = arrayDataRenderInCard('archiveNews', additionalNews, currMonth);
  currMonth = renderedNews.currentMonth
  document.getElementById('archiveNews').innerHTML += renderedNews.html;
}

function setupInfiniteScroll(type, streamId) {
  const container = document.getElementById("content");
  container.addEventListener("scroll", () => {
    if (container.scrollTop + container.clientHeight >= container.scrollHeight) {
      if (type == 'news') loadMoreNews(); // Fetch more content when reaching the bottom
      if (type == 'resource') loadMoreResource(streamId);
    }
  });
}

async function loadAllNews(query, redirectFun) {
  news = []; // Array to store fetched news
  skip = 0; // Tracks the number of items already fetched
  searchQuery = '';
  currMonth = ''; //Last month for feedbacking for archive news
  if (query === 'faculty') {
    if (usrDetails.data.profile.userType === 'faculty') {
      searchQuery = { "newsUserType.newsUserTypeName": "faculty" }
    } else if (usrDetails.data.profile.userType === 'external user' && usrDetails.data.roles.includes('Missions')) {
      searchQuery = { "newsUserType.newsUserTypeName": { "$in": ["external user", "faculty"] } }
    }
  } else if (query === 'student') {
    if (usrDetails.data.profile.userType === 'student') {
      searchQuery = { "newsUserType.newsUserTypeName": "student" }
    } else if (usrDetails.data.profile.userType === 'external user' && usrDetails.data.roles.includes('student')) {
      searchQuery = { "newsUserType.newsUserTypeName": { "$in": ["external user", "student"] } }
    }
  } else if (query === 'guest') {
    console.log('guest')
    searchQuery = { 'newsUserType.newsUserTypeName': { "$all": ["external user", "other"] } }
  }

  await loadInitialNews(searchQuery);
  setupInfiniteScroll();
  const archivednews = arrayDataRenderInCard('archiveNews', news.slice(16, 20));
  currMonth = archivednews.currentMonth;
  context = {
    latestNews: news[0],
    topNews: arrayDataRenderInCard('topNews', news.slice(1, 6)),
    recentNews: arrayDataRenderInCard('recentNews', news.slice(6, 16)),
    archiveNews: archivednews.html,
    redirectFun
  }
  await navigateTo('detailedNews', context);
  const searchFilter = document.getElementById('searchFilter');
  const mainNews = document.getElementById('mainNews');
  const archive = document.getElementById('archive');
  const closeSearchBtn = document.getElementById('closeSearch');
  document.getElementById('allNewsFilterInput').addEventListener('input', async function () {
    const filterKeyword = this.value.toLowerCase();
    if (filterKeyword.length >= 3) {
      const modifiedSearchQuery = {
        ...searchQuery, // Existing searchQuery (if any)
        "isDeleted": "false",
        "$or": [
          { "newsTitle": { "$regex": filterKeyword, "$options": "i" } },
          { "newsSubTitle": { "$regex": filterKeyword, "$options": "i" } }
        ]
      };
      fetchNews(modifiedSearchQuery, 50, skip = 0)
        .then((resp) => {
          // Hide the main content
          closeSearchBtn.style.display = 'inline-block';
          mainNews.classList.add('d-none');
          archive.classList.add('d-none');

          // Update the search results
          searchFilter.innerHTML = renderFunctions.detailNewsSearch(resp);
          searchFilter.classList.replace('h-0', 'h-auto');
        })
    } else {
      // Reset to the main content
      mainNews.classList.remove('d-none');
      archive.classList.remove('d-none');
      closeSearchBtn.style.display = 'none';

      // Clear the search results
      searchFilter.innerHTML = '';
      searchFilter.classList.replace('h-auto', 'h-0');
    }
  });
  // Function to clear the search field when close button is clicked
  document.getElementById('closeSearch').addEventListener('click', function () {
    // Reset to the main content
    mainNews.classList.remove('d-none');
    archive.classList.remove('d-none');
    closeSearchBtn.style.display = 'none';

    // Clear the search results
    searchFilter.innerHTML = '';
    document.getElementById('allNewsFilterInput').value = '';
    searchFilter.classList.replace('h-auto', 'h-0');
  });
}

function resourceCardClickManager(data) {
  // if (data.type === 'pdf') {
  //   openModal('dls');
  //   loadPdf(data.url);
  // }
  // if (data.type === 'video') {
  //   openModal('video', '', data);
  // }
  // if (data.type === 'audio') {
  //   openModal('audio', '', data);
  // }
  window.open(data.resourceLink)
}

async function dataCardClickManager(type, userId) {
  try {
    openModal('formIO', '', `${type} details`);
    let formQuery = {};

    if (type.toLowerCase() === 'mentor') {
      formQuery = { "collection": "FormIO", "query": { formKey: "mentorDetails" } };
      mentorRoleQuery = { "collection": "MentorRole", "query": { isDeleted: false, _id: userId } }
      updateQuery = { "collection": "MentorRole", query: { selector: { _id: userId }, data: {} } }
      mentorMenteeEditForm(formQuery, mentorRoleQuery, updateQuery)
    } else if (type.toLowerCase() === 'mentee') {
      formQuery = { "collection": "FormIO", "query": { formKey: "menteeDetails" } };
      menteeRoleQuery = { "collection": "MenteeRole", "query": { isDeleted: false, _id: userId } }
      updateQuery = { "collection": "MenteeRole", query: { selector: { _id: userId }, data: {} } }
      mentorMenteeEditForm(formQuery, menteeRoleQuery, updateQuery)
    } else {
      console.error('Invalid type provided. Expected "mentor" or "mentee".');
      return;
    }

  } catch (error) {
    console.error('Error in dataCardClickManager:', error);
  }
}

async function loadResearchCards() {
  navigateTo('research', {});
  const collections = [
    { collection: "ResearchNews", query: { isDeleted: false, showOnCarousel: "yes" }, "options": { "sort": { "newsDate": -1 } }, projection: { uploadImage: 1, newsTitle: 1, content: 1, link: 1, newsBody: 1 } },
    { collection: "ResearchPublications", query: { isDeleted: false, showOnCarousel: "yes" }, "options": { "sort": { "date": -1 } }, projection: { uploadImage: 1, title: 1, authors: 1, abstractKeyFindings: 1, link: 1, publishedDate: 1 } },
    { collection: "ResearchLegacies", query: { isDeleted: false, showOnCarousel: "yes" }, options: { "sort": { "year": 1 } } }
  ];

  const fetchedData = await fetchedDataAPI("fetchCollectionData", collections);
  const researchNews = fetchedData["ResearchNews"].data || [];
  const researchPublic = fetchedData["ResearchPublications"].data || [];
  const researchLegacies = fetchedData["ResearchLegacies"].data || [];
  //console.log("Research Data:", fetchedData);

  // For News (3 per view, slide 1 at a time, image top)
  document.getElementById("recentNewsCards").innerHTML = createCarousel("newsCarousel", researchNews, {
    cardsPerView: 1,
    slideByOne: true,
    layout: "vertical"
  });

  // For Publications (1 per view, full slide change, image left)
  document.getElementById("recentPublicCards").innerHTML = createCarousel("publicationsCarousel", researchPublic, {
    cardsPerView: 1,
    slideByOne: false,
    layout: "horizontal"
  });

  document.getElementById("timelineContainer").innerHTML = renderFunctions.timeline(researchLegacies);
}


function createCarousel(id, items = [], options = {}) {
  const {
    cardsPerView = 1,
    layout = "vertical", // "vertical" | "horizontal"
    imgHeight = 350,
    gap = 3,
    showControls = true
  } = options;

  if (!items.length) return `<p>No items found.</p>`;

  const safeImage = (src) => src || "https://s3.amazonaws.com/img.studenthub.in/CMCVConnect_Portal/Pictures/_43782473c4ed75b1e167091821a4d700_Pictures.png";
  const safeText = (text, fallback = "") => text || fallback;

  const renderVerticalCard = (item) => {
    const firstImage = item.uploadImage?.[0];
    const imageUrl = firstImage?.data?.url || firstImage?.url || "https://s3.amazonaws.com/img.studenthub.in/CMCVConnect_Portal/Pictures/_43782473c4ed75b1e167091821a4d700_Pictures.png";
    item.image = imageUrl;
    return `
      <div class="col-12 col-md-${Math.floor(12 / cardsPerView)}" >
        <div class="card text-center h-100 shadow-sm">
          <img src="${safeImage(imageUrl)}" 
               class="card-img-top mx-auto d-block" 
             style="max-height:${imgHeight}px; max-width: 690px; object-fit:cover;" 
             alt="${safeText(item.newsTitle, "Untitled")}">
        <div class="card-body">
          <h6 class="card-title">${safeText(item.newsTitle, "Untitled")}</h6>
          <p class="card-text small text-muted">${safeText(item.content)}</p>
          <button onclick='openModal("researchNews", "", ${JSON.stringify(item).replace(/'/g, "&apos;")})' target="_blank" class="px-3 py-2 btn-sm read-more-btn mt-2">Read More...</button>       
        </div>
      </div>
    </div>
  `;
  }
  const renderHorizontalCard = (item) => {
    // Safely get the first image URL
    const firstImage = item.uploadImage?.[0];
    const imageUrl = firstImage?.data?.url || firstImage?.url || "https://s3.amazonaws.com/img.studenthub.in/CMCVConnect_Portal/Pictures/_43782473c4ed75b1e167091821a4d700_Pictures.png";

    return `
    <div class="col-12">
      <div class="h-100 shadow-sm p-2 d-flex flex-column flex-md-row">
        <div class="mb-3 mb-md-0 d-flex flex-column justify-content-between">
          <img src="${safeImage(imageUrl)}" 
               width="150" height="150" 
               class="img-fluid rounded" 
               alt="${safeText(item.title, "Untitled")}">
        <a href="${item.link}" target="_blank" class=" w-75 btn-sm read-more-btn mt-2 z-3">Read More...</a>       
        </div>
        <div style="flex:1; padding-left:15px; max-height: 445px; overflow:auto;">
          <h5 class="fs-md-5 text-primary">${safeText(item.title, "Untitled")}</h5>
          <p class="mb-0 mt-0 text-muted fs-md-6" style="white-space: pre-line; color: black;">${safeText(item.authors)}</p>
          <p class="fs-md-6 text-dark">${safeText(item.publishedDate, " ")}</p>
          <div class="mb-0 mt-3 text-muted fs-md-6" style="white-space: pre-line; color: black;">${safeText(item.abstractKeyFindings)}</div>
        </div>
      </div>
    </div>
  `;
  };


  const totalSlides = Math.ceil(items.length / cardsPerView);
  let slides = "";

  for (let i = 0; i < totalSlides; i++) {
    let cardHTML = "";

    for (let j = 0; j < cardsPerView; j++) {
      const index = i * cardsPerView + j;
      if (index >= items.length) break;

      cardHTML += layout === "vertical"
        ? renderVerticalCard(items[index])
        : renderHorizontalCard(items[index]);
    }

    slides += `
      <div class="carousel-item ${i === 0 ? "active" : ""}">
        <div class="row g-${gap} justify-content-center p-1">${cardHTML}</div>
      </div>
    `;
  }

  return `
    <div id="${id}" class="carousel slide position-relative" data-bs-ride="false" data-bs-interval="false">
      <div class="carousel-inner">${slides}</div>

      ${showControls && totalSlides > 1 ? `
        <button class="carousel-control-prev" 
                type="button" data-bs-target="#${id}" data-bs-slide="prev">
          <span class="carousel-control-prev-icon" style="background-color: rgba(0, 0, 0, 0.5); border-radius: 50%;"></span>
        </button>
        <button class="carousel-control-next" 
                type="button" data-bs-target="#${id}" data-bs-slide="next">
          <span class="carousel-control-next-icon" style="background-color: rgba(0, 0, 0, 0.5); border-radius: 50%;"></span>
        </button>
      ` : ""}
    </div>
  `;



}
// Helper function to build a carousel from an array


/* -------------------- Carousel Renderer -------------------- */
// function createCarousel(id, items = [], options = {}) {
//   console.log("creating itmes", items)
//   const {
//     cardsPerView = 1,
//     layout = "vertical",
//     imgHeight = 350,
//     gap = 3,
//     showControls = true,
//     collectionName = null
//   } = options;

//   const safeImage = (src) => src || "placeholder.jpg";
//   const safeText = (text, fallback = "") => text || fallback;

//   const renderVerticalCard = (item) => {
//     const firstImage = item.uploadImage?.[0];
//     const imageUrl = firstImage?.data?.url || firstImage?.url || "placeholder.jpg";
//     item.image = imageUrl;
//     return `
//       <div class="col-12 col-md-${Math.floor(12 / cardsPerView)}">
//         <div class="card text-center h-100 shadow-sm">
//           <img src="${safeImage(imageUrl)}" 
//                class="card-img-top mx-auto d-block" 
//                style="max-height:${imgHeight}px; max-width: 690px; object-fit:cover;" 
//                alt="${safeText(item.newsTitle, "Untitled")}">
//           <div class="card-body">
//             <h6 class="card-title">${safeText(item.newsTitle, "Untitled")}</h6>
//             <p class="card-text small text-muted">${safeText(item.content)}</p>
//             <button onclick='openModal("researchNews", "", ${JSON.stringify(item).replace(/'/g, "&apos;")})' 
//               class="btn btn-sm read-more-btn mt-2">
//               <i class="fa-solid fa-arrow-right pe-2"></i>Read More
//             </button>       
//           </div>
//         </div>
//       </div>
//     `;
//   };

//   const renderHorizontalCard = (item) => {
//     const firstImage = item.uploadImage?.[0];
//     const imageUrl = firstImage?.data?.url || firstImage?.url || "placeholder.jpg";

//     return `
//       <div class="col-12">
//         <div class="h-100 shadow-sm p-2 d-flex flex-column flex-md-row">
//           <div class="mb-3 mb-md-0 d-flex flex-column justify-content-between">
//             <img src="${safeImage(imageUrl)}" 
//                  width="150" height="150" 
//                  class="img-fluid rounded" 
//                  alt="${safeText(item.title, "Untitled")}">
//             <a href="${item.link}" target="_blank" class="btn btn-sm read-more-btn mt-2">
//               <i class="fa-solid fa-arrow-right p-2"></i>Read More
//             </a>       
//           </div>
//           <div style="flex:1; padding-left:15px; max-height: 445px; overflow:auto;">
//             <h5 class="fs-md-5 text-primary">${safeText(item.title, "Untitled")}</h5>
//             <p class="mb-0 mt-0 text-muted fs-md-6" style="white-space: pre-line; color: black;">
//               ${safeText(item.authors)}
//             </p>
//             <div class="mb-0 mt-3 text-muted fs-md-6" style="white-space: pre-line; color: black;">
//               ${safeText(item.abstractKeyFindings)}
//             </div>
//           </div>
//         </div>
//       </div>
//     `;
//   };

//   const totalSlides = Math.ceil(items.length / cardsPerView);
//   let slides = "";

//   for (let i = 0; i < totalSlides; i++) {
//     let cardHTML = "";
//     for (let j = 0; j < cardsPerView; j++) {
//       const index = i * cardsPerView + j;
//       if (index >= items.length) break;
//       cardHTML += layout === "vertical"
//         ? renderVerticalCard(items[index])
//         : renderHorizontalCard(items[index]);
//     }

//     slides += `
//       <div class="carousel-item ${i === 0 ? "active" : ""}">
//         <div class="row g-${gap} justify-content-center p-1">${cardHTML}</div>
//       </div>
//     `;
//   }

//   return `
//     <div id="${id}" class="carousel slide position-relative" data-bs-ride="false" data-bs-interval="false">
//       <div class="carousel-inner">${slides}</div>
//       ${showControls && totalSlides > 0 ? `
//         <button class="carousel-control-prev" type="button" onclick="lazyPrevPage('${collectionName}')">
//           <span class="carousel-control-prev-icon"></span>
//         </button>
//         <button class="carousel-control-next" type="button" onclick="lazyNextPage('${collectionName}')">
//           <span class="carousel-control-next-icon"></span>
//         </button>
//       ` : ""}
//     </div>
//   `;
// }

// /* --- Lazy loading button control --- */
// function updateCarouselButtons(id, hasPrev, hasNext) {
//   const prevBtn = document.querySelector(`#${id} .carousel-control-prev`);
//   const nextBtn = document.querySelector(`#${id} .carousel-control-next`);
//   if (prevBtn) prevBtn.disabled = !hasPrev;
//   if (nextBtn) nextBtn.disabled = !hasNext;
// }

// /* ----------------- Lazy Loading ------------------- */

// const lazyLoaders = {}; 

// async function fetchCollectionDataLazy(collectionName, query, projection, page = 0, limit = 1) {
//   const collections = [
//     { collection: collectionName, query, projection, options: { skip: page * limit, limit } }
//   ];
//   const fetchedData = await fetchedDataAPI("fetchCollectionData", collections);
//   return fetchedData[collectionName]?.data || [];
// }

// async function loadLazyCollection(collection) {
//   const config = lazyLoaders[collection];
//   if (!config) {
//     console.error("No config for", collection);
//     return;
//   }

//   const { query, projection, containerId, renderer, rendererOptions, page, limit } = config;
//   const data = await fetchCollectionDataLazy(collection, query, projection, page, limit);

// if (data && data.length > 0) {
//   document.getElementById(containerId).innerHTML = renderer(
//     collection + "Carousel",
//     data,
//     { ...rendererOptions, collectionName: collection }
//   );
// } else {

//   // Button states
//   const hasPrev = page > 0;
//   const hasNext = data.length === limit; 
//   updateCarouselButtons(collection + "Carousel", hasPrev, hasNext);
// }
// }

// async function lazyNextPage(collection) {
//   lazyLoaders[collection].page++;
//   await loadLazyCollection(collection);
// }

// async function lazyPrevPage(collection) {
//   if (lazyLoaders[collection].page > 0) {
//     lazyLoaders[collection].page--;
//     await loadLazyCollection(collection);
//   }
// }

// function initLazyCollections() {
//   lazyLoaders["ResearchNews"] = {
//     collection: "ResearchNews",
//     query: { isDeleted: false, showOnCarousel: "yes" },
//     projection: { uploadImage:1, newsTitle:1, content:1, link:1, newsBody:1 },
//     containerId: "recentNewsCards",
//     renderer: createCarousel,
//     rendererOptions: { cardsPerView: 1, layout: "vertical" },
//     limit: 1,
//     page: 0
//   };

//   lazyLoaders["ResearchPublications"] = {
//     collection: "ResearchPublications",
//     query: { isDeleted: false, showOnCarousel: "yes" },
//     projection: { uploadImage:1, title:1, authors:1, abstractKeyFindings:1, link:1 },
//     containerId: "recentPublicCards",
//     renderer: createCarousel,
//     rendererOptions: { cardsPerView: 1, layout: "horizontal" },
//     limit: 1,
//     page: 0
//   };

//   lazyLoaders["ResearchLegacies"] = {
//     collection: "ResearchLegacies",
//     query: { isDeleted: false },
//     projection: { title:1, uploadIcon:1, year:1 },
//     containerId: "timelineContainer",
//     renderer: renderFunctions.timeline,
//     rendererOptions: {},
//     limit: 5,
//     page: 0
//   };
// }

// async function startLazyLoading() {
//   initLazyCollections();
//   for (const col in lazyLoaders) {
//     await loadLazyCollection(col);
//   }
// }


function renderOngoingGrandRounds(data) {
  console.log("data", data)
  const container = document.getElementById("ongoingGrandRounds");
  container.innerHTML = "";

  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  const filteredData = data.filter(item => {
    const endDate = new Date(item.endDate);
    endDate.setHours(0, 0, 0, 0);
    return endDate >= currentDate;
  });

  if (!filteredData.length) {
    container.innerHTML = `<p class="text-muted text-center">No ongoing grand rounds</p>`;
    return;
  }

  let cardsHtml = `<div class="row g-4">`;

  filteredData.forEach(item => {
    const rawPoster = Array.isArray(item.poster) ? item.poster[0] : item.poster;
    item.poster = rawPoster;
    const rawPoster2 = Array.isArray(item.posterCard) ? item.posterCard[0] : item.posterCard;
    const posterUrl2 = rawPoster2?.data?.url || rawPoster2?.url || rawPoster2;

    cardsHtml += `
      <div class="col-md-6 col-sm-12">
        <div class="card h-100 shadow-sm border-0 rounded-4 overflow-hidden">
          
          <div class="position-relative">
            <img 
              src="${posterUrl2}" 
              class="card-img-top"
              style="height: 360px; object-fit: cover; cursor: pointer;"
              alt="Grand Rounds Poster"
              onclick='openModal("grandRounds", "", ${JSON.stringify(item).replace(/'/g, "&apos;")})'
            />
          </div>

        </div>
      </div>
    `;
  });

  cardsHtml += `</div>`;
  container.innerHTML = cardsHtml;
}


let allAwardees = [];

async function loadGrantsAwardee() {
  console.log("loadGrantsAwardee");

  const collection = {
    collection: "GrantsAwardee",
    query: { isDeleted: false },
    options: { limit: 50 }
  };

  const grantsAwardee = await fetchCollectionData("fetchCollectionData", collection);
  console.log("GrantsAwardee", grantsAwardee);

  allAwardees = grantsAwardee.data || [];

  // build year filter options
  buildYearOptions(allAwardees);

  renderAwardees(allAwardees);
}

function buildYearOptions(list) {
  const yearSelect = document.getElementById("awardeeYearFilter");
  if (!yearSelect) return;

  const years = [...new Set(list.map(a => a.yearAwarded).filter(Boolean))];
  years.sort((a, b) => b - a); // descending order

  // reset dropdown
  yearSelect.innerHTML = `<option value="">All Years</option>`;
  years.forEach(y => {
    yearSelect.innerHTML += `<option value="${y}">${y}</option>`;
  });
}

function renderAwardees(list) {
  document.getElementById("grantsAwardeeList").innerHTML =
    `<div class="row">${renderFunctions.grantsAwardeeCard(list)}</div>`;
  document.addEventListener("input", applyFilters);
  document.addEventListener("change", applyFilters);
}

function applyFilters() {
  const query = document.getElementById("awardeeSearch")?.value.toLowerCase() || "";
  const selectedYear = document.getElementById("awardeeYearFilter")?.value || "";

  const filtered = allAwardees.filter(a => {
    const name = a.facultyName?.profile?.name?.toLowerCase() || "";
    const dept = a.department?.toLowerCase() || "";
    const designation = a.facultyName?.profile?.designation?.toLowerCase() || "";
    const project = a.titleOfResearchProject?.toLowerCase() || "";

    const matchesSearch =
      name.includes(query) ||
      dept.includes(query) ||
      designation.includes(query) ||
      project.includes(query);

    const matchesYear = !selectedYear || String(a.yearAwarded) === selectedYear;

    return matchesSearch && matchesYear;
  });

  renderAwardees(filtered);
}

async function loadPublicationsMap() {
  const collections = {
    collection: "MsnPublications",
    query: { isDeleted: false },
  }
  const response = await fetchCollectionData("fetchCollectionData", collections);
  const data = response.data || [];

  //console.log("Publications map data:", data);

  // Collect all hospital IDs from publications
  const publicHsptls = [
    ...new Set(
      data
        .map(pub => pub.missionHospitals?._id)
        .filter(Boolean)
    )
  ];
  //console.log("hsptl", publicHsptls);

  if (publicHsptls.length === 0) {
    console.warn("No hospital IDs found in publications.");
    return;
  }
  const msnHsptl = {
    collection: "MissionHospital",
    query: { isDeleted: "false", _id: { $in: publicHsptls } },
    projection: { _id: 1, missionHospitalName: 1, hospitalLatitude: 1, hospitalLongitude: 1 }
  };

  const hospitalResponse = await fetchCollectionData("fetchCollectionData", msnHsptl);
  const hospitals = hospitalResponse.data || [];
  //console.log("fetched hsptl", hospitalResponse);

  if (hospitals.length === 0) {
    return console.warn("No hospitals found.");
  }

  const markerArray = [];
  const hospitalsWithCoord = [];
  const bounds = new google.maps.LatLngBounds();

  for (const hospital of hospitals) {
    const lat = parseFloat(hospital.hospitalLatitude);
    const lng = parseFloat(hospital.hospitalLongitude);

    if (!isNaN(lat) && !isNaN(lng)) {
      const coords = { lat, lng };
      markerArray.push({ id: hospital._id, coords, hsName: hospital.missionHospitalName });
      hospitalsWithCoord.push(hospital);
      bounds.extend(new google.maps.LatLng(coords.lat, coords.lng));
    }
  }

  if (markerArray.length === 0) {
    console.warn("No valid coordinates found.");
    return;
  }

  const center = markerArray[0].coords;

  window.mapInstance = new google.maps.Map(document.getElementById("publicationsMap"), {
    center: center,
    zoom: 6,
  });

  window.mapInstance.fitBounds(bounds);

  google.maps.event.addListenerOnce(window.mapInstance, "idle", function () {
    if (window.mapInstance.getZoom() > 18) {
      window.mapInstance.setZoom(18);
    }
  });

  markerArray.forEach(markerData => {
    const marker = new google.maps.Marker({
      position: markerData.coords,
      map: window.mapInstance,
      title: markerData.hsName
    });

    const relatedPublications = data.filter(
      pub => pub.missionHospitals?._id === markerData.id
    );

    let contentHtml = `<div style="max-width:250px;">`;
    relatedPublications.forEach(pub => {
      contentHtml += `
      <h4>${pub.title}</h4>
      <p><b>Hospital:</b> ${pub.missionHospitals.missionHospitalName}</p>
      <p><b>Authors:</b> ${pub.authors}</p>
      <p><b>Abstract:</b> ${pub.abstractKeyFindings}</p>
      <p><a href="${pub.link}" target="_blank">View Publication</a></p>
      <hr/>
    `;
    });
    contentHtml += `</div>`;

    const infoWindow = new google.maps.InfoWindow({
      content: contentHtml
    });

    marker.addListener("click", () => {
      infoWindow.open(window.mapInstance, marker);
    });
  });

  //console.log("Hospitals plotted:", hospitalsWithCoord);
}


let allGrandRoundsVideos = [];
let searchInitialized = false;

async function loadGrandRoundsVideos(limit) {

  const hasLimit = Number(limit) > 0;

  const collections = {
    collection: "LearningResources",
    query: { subType: "Grand Rounds", isDeleted: false },
    projection: {
      Date: 1,
      stream: 1,
      resourceLink: 1,
      resourcePerson: 1,
      type: 1,
      typeId: 1,
      subType: 1,
      metaTags: 1,
      title: 1,
    },
    options: { sort: { Date: -1 } }
  };

  if (hasLimit) {
    collections.options.limit = limit;
  }

  try {
    const fetched = await fetchCollectionData("fetchCollectionData", collections);
    allGrandRoundsVideos = fetched?.data || [];

    if (!allGrandRoundsVideos.length) {
      document.getElementById("grandRoundsVideos").innerHTML = "<p>No videos found.</p>";
      return;
    }

    // Generate thumbnails
    allGrandRoundsVideos = await Promise.all(
      allGrandRoundsVideos.map(async (item) => {
        const videoUrl = item.resourceLink || item.url || "";
        return {
          ...item,
          thumbnail: await generateThumbnail(videoUrl, item.type),
        };
      })
    );

    if (hasLimit) {
      const html = allGrandRoundsVideos
        .map(item => renderFunctions.recentgrandRoundsCard(item))
        .join("");
      document.getElementById("grandRoundsVideos").innerHTML = html;
    } else {
      renderFullVideos(allGrandRoundsVideos);

      if (!searchInitialized) {
        searchInitialized = true;

        document.getElementById("grandRoundsSearch").addEventListener("input", (e) => {
          const query = e.target.value.toLowerCase();

          const filtered = allGrandRoundsVideos.filter((item) => {
            const title = item.title?.toLowerCase() || "";
            const person = item.resourcePerson?.toLowerCase() || "";
            const tags = Array.isArray(item.metaTags)
              ? item.metaTags.join(" ").toLowerCase()
              : (item.metaTags || "").toLowerCase();

            return (
              title.includes(query) ||
              person.includes(query) ||
              tags.includes(query)
            );
          });

          renderFullVideos(filtered);
        });
      }
    }

  } catch (error) {
    console.error(error);
    document.getElementById("grandRoundsVideos").innerHTML =
      "<p>Error loading Grand Rounds videos.</p>";
  }

  function renderFullVideos(videos) {
    const html = videos.map(item => renderFunctions.resourcesCard(item)).join("");
    document.getElementById("grandRoundsVideos").innerHTML = html;
  }
}



function initWhatsNewCarousel() {
  const element = document.querySelector('#whatsNewCarousel');
  if (!element) {
    console.warn('Carousel not found — skipping init');
    return;
  }

  new bootstrap.Carousel(element, {
    interval: 10000,
    ride: 'carousel',
    pause: 'hover', // this line makes it pause when hovered
    wrap: true
  });
}


async function loadGrandRoundsCalendar() {


  const calendarEl = document.getElementById('grandRoundsCal');

  const collection = {
    collection: "GrandRounds",
    query: { isDeleted: false, }
  }

  const grandRounds = await fetchCollectionData("fetchCollectionData", collection);
  //console.log("Grand Rounds", grandRounds);

  const events = [];

  if (grandRounds.scheduleDates && grandRounds.scheduleDates.length > 0) {
    grandRounds.scheduleDates.forEach(d => {
      events.push({
        title: grandRounds.grandRoundsTitle,
        start: d.split('T')[0],
        allDay: true,
        extendedProps: {
          speaker: grandRounds.speakerName,
          specialization: grandRounds.speakerSpecialization,
          zoomLink: grandRounds.zoomLink,
          poster: grandRounds.poster?.url
        }
      });
    });
  }

  // Case 2: sessions with start/end
  // if (grandRounds.schedule && grandRounds.schedule.length > 0) {
  //   grandRounds.schedule.forEach(s => {
  //     events.push({
  //       title: grandRounds.grandRoundsTitle,
  //       start: s.startDate,
  //       end: s.endDate,
  // allDay: true,
  //       extendedProps: {
  //         speaker: grandRounds.speakerName,
  //         specialization: grandRounds.speakerSpecialization,
  //         zoomLink: grandRounds.zoomLink,
  //         poster: grandRounds.poster?.url
  //       }
  //     });
  //   });
  // }

  // Initialize calendar

  await loadCalendarScript();
  console.log('FullCalendar =', window.FullCalendar);

  const calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: 'dayGridMonth',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay'
    },
    events: events,
    eventClick: function (info) {
      const props = info.event.extendedProps;
      alert(
        `${info.event.title}\n` +
        `Speaker: ${props.speaker} (${props.specialization})\n` +
        `Zoom: ${props.zoomLink}`
      );
    }
  });

  calendar.render();
}

async function loadCalendarScript() {
  console.log('loadCalendarScript')
  return new Promise((resolve, reject) => {
    if (window.FullCalendar) {
      resolve();
      return;
    }

    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/fullcalendar@6.1.8/index.global.min.js";
    script.async = true;
    script.defer = true;
    script.onload = resolve;
    script.onerror = () => reject(new Error("FullCalendar failed to load."));

    document.head.appendChild(script);
  });
}


let tileData = [];
let tileIndex = 0;
const TILE_PAGE_SIZE = 9;
let filteredTileData = [];

function renderMissionTiles(data, interestRequestIds, hospMap, specMap) {

  tileData = data;
  filteredTileData = [...data];
  tileIndex = 0;

  $('#tileView').empty();

  renderNextTiles(interestRequestIds, hospMap, specMap);
}

function renderNextTiles(interestRequestIds, hospMap, specMap) {

  const container = $('#tileView');
  const nextBatch = filteredTileData.slice(tileIndex, tileIndex + TILE_PAGE_SIZE);
  nextBatch.forEach(req => {
    const isInterested = interestRequestIds.has(req._id);
    const card = `
        <div class="col-md-4">
            <div class="card shadow-sm mission-card card-hover h-100">
                <div class="card-image mb-2">
                        <img class="card-img-top" src="${hospMap[req.missionHospitalId].hospitalImages[0].url || "../images/icons/hospital-icon.png"}" alt="HospitalImage" class="img-fluid" style="height: 220px;">
                    </div>
                <div class="card-body d-flex flex-column">
                    <h6 class="text-center text-primary">${hospMap[req.missionHospitalId].missionHospitalName || ""}</h6>
                    <div class="text-muted mb-2">
                      <b class="text-black">Specialization:</b> ${specMap[req.specializationId] || ""}
                    </div>
                    <div class="small mb-3">
                        <b>From:</b> ${moment(req.fromMsnHospDate).format("DD MMM YYYY")}
                        <b>To:</b> ${moment(req.toMsnHospDate).format("DD MMM YYYY")}
                    </div>
                    <div class="mt-auto text-center">
                        <button class="btn ${isInterested ? 'secondary-bg-color disabled text-white opacity-100' : 'btn-primary'} w-75 interestedTileBtn"
                            data-id="${req._id}">
                            ${isInterested ? '✓ Interest Registered' : 'Interested? Click here'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
        `;

    container.append(card);
  });

  tileIndex += TILE_PAGE_SIZE;
  renderLoadMoreButton(interestRequestIds, hospMap, specMap);
}

function renderLoadMoreButton(interestRequestIds, hospMap, specMap) {

  $('#loadMoreWrapper').remove();
  if (tileIndex >= filteredTileData.length) return;
  const btn = `
        <div id="loadMoreWrapper" class="col-12 text-center mt-3">
            <button id="loadMoreBtn" class="btn btn-outline-primary">
                Load More
            </button>
        </div>
    `;

  $('#tileView').append(btn);
  $('#loadMoreBtn').off('click').on('click', function () {
    renderNextTiles(interestRequestIds, hospMap, specMap);
  });
}

function initTileSearch(interestRequestIds, hospMap, specMap) {

  if (searchInitialized) return;
  searchInitialized = true;

  $('#tileSearchInput').on('input', function () {

    const text = $(this).val().toLowerCase();

    filteredTileData = tileData.filter(req => {

      const hospital = (hospMap[req.missionHospitalId]?.missionHospitalName || "").toLowerCase();
      const specialization = (specMap[req.specializationId] || "").toLowerCase();
      const departments = (req.selectedLinkedDepartments || [])
        .map(d => d.name.toLowerCase()).join(' ');

      return hospital.includes(text) ||
        specialization.includes(text) ||
        departments.includes(text);
    });

    tileIndex = 0;
    $('#tileView').empty();

    renderNextTiles(interestRequestIds, hospMap, specMap);
  });
}


let clinicalSnipState = {
  data: [],
  currentIndex: 0,
  limit: 5,
  isLoaded: false
};
async function loadClinicalSnip(forceRefresh = false) {

  const container = document.getElementById("clinicalSnip");

  if (clinicalSnipState.isLoaded && !forceRefresh) {
    container.innerHTML = "";
    clinicalSnipState.currentIndex = 0;
    loadMoreClinicalSnips();
    return;
  }

  const cached = sessionStorage.getItem("clinicalSnips");

  if (cached && !forceRefresh) {
    clinicalSnipState.data = JSON.parse(cached);
    clinicalSnipState.isLoaded = true;

    container.innerHTML = "";
    clinicalSnipState.currentIndex = 0;
    loadMoreClinicalSnips();
    return;
  }

  const collection = {
    collection: "ClinicalSnip",
    query: { isDeleted: false },
    options: { sort: { "added.addedDate": -1 } }
  };

  const response = await fetchCollectionData("fetchCollectionData", collection);
  const list = Array.isArray(response) ? response : response?.data || [];

  clinicalSnipState.data = list;
  clinicalSnipState.isLoaded = true;

  sessionStorage.setItem("clinicalSnips", JSON.stringify(list));

  container.innerHTML = "";
  clinicalSnipState.currentIndex = 0;

  loadMoreClinicalSnips();
}

function loadMoreClinicalSnips() {

  const { data, currentIndex, limit } = clinicalSnipState;
  const container = document.getElementById("clinicalSnip");

  const nextItems = data.slice(currentIndex, currentIndex + limit);

  container.insertAdjacentHTML(
    "beforeend",
    renderFunctions.clinicalSnip(nextItems)
  );

  clinicalSnipState.currentIndex += limit;

  renderClinicalSnipLoadMoreButton();
}

function renderClinicalSnipLoadMoreButton() {

  let btnContainer = document.getElementById("loadMoreContainer");

  if (!btnContainer) {
    btnContainer = document.createElement("div");
    btnContainer.id = "loadMoreContainer";
    btnContainer.className = "text-center mt-4";

    document.querySelector("#clinicalSnip").after(btnContainer);
  }

  const { currentIndex, data } = clinicalSnipState;

  if (currentIndex >= data.length) {
    btnContainer.innerHTML = "";
    return;
  }

  btnContainer.innerHTML = `
    <button class="btn btn-dark px-4 rounded-pill" onclick="loadMoreClinicalSnips()">
      Load More
    </button>
  `;
}

function checkAnswer(btn) {

  const card = btn.closest('.mcq-card');
  const container = card.querySelector('.options-container');
  const buttons = container.querySelectorAll('.mcq-option');

  const questionId = card.id.replace('card-', '');
  const explanationBox = document.getElementById(`explain-${questionId}`);

  // Get data from button attributes
  const isCorrect = btn.dataset.correct;
  const explanation = decodeURIComponent(btn.dataset.explanation || '');

  // Reset all buttons
  buttons.forEach(b => {
    b.classList.remove('btn-success', 'btn-danger');
    b.classList.add('btn-outline-secondary');

    const icon = b.querySelector('.status-icon');
    icon.classList.remove('fa-check-circle', 'fa-times-circle');
  });

  // Style the clicked button
  if (isCorrect === "yes") {
    btn.classList.replace('btn-outline-secondary', 'btn-success');
    btn.querySelector('.status-icon').classList.add('fa-check-circle');
  } else {
    btn.classList.replace('btn-outline-secondary', 'btn-danger');
    btn.querySelector('.status-icon').classList.add('fa-times-circle');
  }

  // Show explanation
  if (explanationBox) {
    explanationBox.classList.remove('d-none');
    explanationBox.querySelector('p').innerHTML = explanation;
  }
}

// Store data locally to prevent re-fetching from API
let allJourneyData = [];
let filteredJourneyData = [];

let currentIndex = 0;
const pageSize = 9;

async function loadNotesFromJourney() {
  const notesContainer = document.getElementById('notesFromJourney');

  notesContainer.innerHTML = `
    <div class="text-center w-100">
      <div class="spinner-border text-primary"></div>
    </div>`;

  try {
    const collection = { collection: "MsnVisitApp", query: { isDeleted: false, status: "Approved" }, options: { sort: { "added.addedDate": -1 } } };
    const dataN = await fetchCollectionData("fetchCollectionData", collection);

    if (!dataN || dataN.length === 0) {
      notesContainer.innerHTML = '<p class="text-muted text-center">No notes found.</p>';
      return;
    }

    allJourneyData = dataN.data;
    filteredJourneyData = [...allJourneyData];

    resetAndRender();

  } catch (error) {
    console.error("Error loading notes:", error);
    notesContainer.innerHTML = '<p class="text-danger text-center">Failed to load data.</p>';
  }

  document.getElementById('loadMoreBtn').addEventListener('click', function () {
    renderNextBatch();
  });
}

function resetAndRender() {
  currentIndex = 0;
  document.getElementById('notesFromJourney').innerHTML = "";
  renderNextBatch();
}

function renderNextBatch() {

  const container = document.getElementById('notesFromJourney');
  const nextBatch = filteredJourneyData.slice(currentIndex, currentIndex + pageSize);

  if (nextBatch.length === 0) return;

  const html = renderFunctions.notesFromJourney(nextBatch);

  // Append instead of replace
  container.innerHTML += `<div class="row">${html}</div>`;

  currentIndex += pageSize;

  toggleLoadMoreBtn();
}

function toggleLoadMoreBtn() {
  const btn = document.getElementById("loadMoreBtn");
  if (currentIndex >= filteredJourneyData.length) {
    btn.classList.add("d-none");
  } else {
    btn.classList.remove("d-none");
  }
}



let searchTimeout;

function handleSearch(query) {
  clearTimeout(searchTimeout);

  searchTimeout = setTimeout(() => {

    const searchTerm = query.toLowerCase().trim();

    if (!searchTerm) {
      filteredJourneyData = [...allJourneyData];
    } else {
      filteredJourneyData = allJourneyData.filter(item => {

        const name = (item.name || "").toLowerCase();
        const hospital = (item.missionHospital?.missionHospitalName || "").toLowerCase();
        const quote = (item.highlightedQuote || "").toLowerCase();

        return name.includes(searchTerm) ||
          hospital.includes(searchTerm) ||
          quote.includes(searchTerm);
      });
    }

    // Reset pagination after search
    resetAndRender();

  }, 300);
}

// Shared fetch for NetConsltPatient — used by both newPatientReq and myApprovedPatient
async function fetchAllPatients() {
  const response = await fetchCollectionData(
    'fetchCollectionData',
    {
      collection: "NetConsltPatient",
      query: { isDeleted: false },
      options: { sort: { "added.addedDate": -1 } }
    }
  );
  return response?.data || [];
}

function buildPatientCard(item, onclickAttr) {
  const date = item?.added?.addedDate
    ? new Date(item.added.addedDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    : '-';
  return `
    <div class="col-md-2">
      <div class="card shadow-sm border-0 rounded h-100 hover-lift" onclick="${onclickAttr}">
        <div class="card-body">
          <div class="text-end"><i class="fa-solid fa-ellipsis-vertical"></i>
          </div>
          <h5 class="fw-bold mb-1">${item.patientName || ''}</h5>
          <p class="small mb-2">${item.patientId || ''}</p>
          <div class="small">
            <div class="mb-1"><strong>Hospital:</strong> ${item.instHsptlName || '-'}</div>
            <div class="mb-1"><strong>Added By:</strong> Dr. ${item?.added?.userName || '-'}</div>
            <div><strong>Date:</strong> ${date}</div>
          </div>
        </div>
      </div>
    </div>`;
}

async function newPatientReq(pageId) {
  const dataN = await fetchAllPatients();
  const container = document.getElementById(pageId);

  if (!dataN.length) {
    container.innerHTML = `<p class="text-muted text-center">No new patient requests.</p>`;
    return;
  }

  container.innerHTML = `<div class="row g-3">${dataN.map(item => buildPatientCard(item,
    `openPatientWorkspace('${item.patientId}')`
  )).join('')
    }</div>`;
}


/* ─── QUERIES AUTO-REFRESH ──────────────────────────────── */

let _queryPollInterval = null;   // active timer ID
let _lastQuestionData = [];      // last fetched question list (for diffing)
let _pollingPatientId = null;    // which patient we are polling for

/**
 * Fetch questions for the patient and (smart-)refresh the UI.
 * Called both directly and by the poll timer.
 */
async function ncPatientQuery(rowData) {
  console.log('ncPatientQuery called', rowData);

  if (!rowData) return;

  _pollingPatientId = rowData.patientId;

  const response = await fetchCollectionData(
    'fetchCollectionDataFromDB',
    {
      collection: "NetConsltPatientQuery",
      query: { isDeleted: false, patientId: rowData.patientId },
      options: { sort: { "added.addedDate": -1 } },
      queryType: "standard"
    }
  );

  const questions = response?.data || [];

  _refreshQuestionList(questions);
}

function _refreshQuestionList(questions) {

  // Detect change: compare IDs + answer counts
  const signature = questions.map(q => q._id + ':' + (q.answers?.length ?? 0)).join('|');
  const prevSignature = _lastQuestionData.map(q => q._id + ':' + (q.answers?.length ?? 0)).join('|');

  if (signature === prevSignature) return; // nothing changed

  // Find which question is currently active
  const activeEl = document.querySelector('.question-item.active');
  const activeQId = activeEl?.dataset?.qid;

  _lastQuestionData = questions;
  renderQuestionList(questions);

  // Restore active state + refresh answer panel if open question changed
  if (activeQId) {
    const updatedQ = questions.find(q => q._id === activeQId);
    const newEl = document.querySelector(`.question-item[data-qid="${activeQId}"]`);

    if (newEl) {
      newEl.classList.add('active');
      // Silently re-render answers only if answer count changed
      if (updatedQ) {
        const prevQ = _lastQuestionData.find(q => q._id === activeQId);
        const prevCount = prevQ?.answers?.length ?? 0;
        if ((updatedQ.answers?.length ?? 0) !== prevCount) {
          showQuestionAnswers(newEl, updatedQ);
        }
      }
    }
  }
}

/** Start polling every 10 s for a given patient */
function startQueriesPolling(patientId) {
  stopQueriesPolling(); // clear any previous timer
  _pollingPatientId = patientId;
  _lastQuestionData = [];

  _queryPollInterval = setInterval(async () => {
    // Only poll while the queriesPage is actually visible
    const page = document.getElementById('queriesPage');
    if (!page || page.classList.contains('d-none')) {
      stopQueriesPolling();
      return;
    }
    await ncPatientQuery({ patientId: _pollingPatientId });
  }, 10000); // 10 seconds
}

/** Stop polling */
function stopQueriesPolling() {
  if (_queryPollInterval) {
    clearInterval(_queryPollInterval);
    _queryPollInterval = null;
  }
  _lastQuestionData = [];

}

/* ──────────────────────────────────────────────────────── */



function renderQuestionList(questions) {

  const container = document.getElementById('ncQuestionList');

  if (!questions.length) {
    container.innerHTML = `
      <div class="text-center p-4 text-muted">
        No questions available
      </div>
    `;
    return;
  }

  container.innerHTML = questions.map((q, index) => {
    const date = q?.added?.addedDate
      ? new Date(q.added.addedDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
      : '';
    const tagClass = q.questionTag === 'High' ? 'bg-danger' : q.questionTag === 'Medium' ? 'bg-warning text-dark' : 'bg-success';
    return `
      <div class="question-item ${index === 0 ? 'active' : ''}"
           data-qid="${q._id}"
           onclick='showQuestionAnswers(this, ${JSON.stringify(q)})'>
        <div class="question-title">
          ${q.question || 'Untitled Question'}
          ${q.questionTag ? `<span class="badge ${tagClass} ms-1">${q.questionTag}</span>` : ''}
        </div>
        <div class="question-meta">${q?.added?.userName || ''} • ${date}</div>
      </div>`;
  }).join('');

}

function showQuestionAnswers(clickedEl, question) {

  /* ACTIVE SIDEBAR */

  document
    .querySelectorAll('.question-item')
    .forEach(item => item.classList.remove('active'));

  clickedEl?.classList.add('active');

  const container =
    document.getElementById('ncPatientQuery');

  const answers = question.answers || [];

  container.innerHTML = `

    <div class="mb-4">
    <div class="text-end">
    Refresh <i class="fas fa-refresh" onclick='ncPatientQuery(selectedPatient)'></i>
    </div>
      <h5 class="fw-bold mb-3">${question.question}</h5>
      <span class="badge mb-2 ${question.questionTag === 'High' ? 'bg-danger' : question.questionTag === 'Medium' ? 'bg-warning' : 'bg-success'}">${question.questionTag}</span>
      <div class="text-muted small">
        Asked by
        <strong>${question?.added?.userName || ''}</strong>
      </div>
    </div>
    <div class="fw-bold">Answers:</div>

    <div class="answers-list">
      ${answers.length
      ? answers.map(answer => `
          <div class="border rounded-4 p-3 mb-3 bg-light">
            <div class="fw-semibold mb-2">
          ${answer?.added?.userId == usrDetails?.data._id ? 'Me' : `${answer?.added?.userName || ''}`}
            </div>
            <div style="white-space: pre-line;">
              ${answer.answer || ''}
            </div>
          </div>
        `).join('')
      : `
          <div class="text-muted">No answers yet</div>
        `
    }
    </div>

    <div class="mt-4">
      <textarea id="newAnswer" class="form-control rounded-4" rows="4" placeholder="Write your answer..."></textarea>

      <div class="text-end mt-3">
        <button class="btn btn-primary rounded-pill" onclick="submitAnswer('${question._id}')">
          Submit Answer
        </button>
      </div>
    </div>

  `;
}

function openAddQuestionModal() {

  const formContainer = document.getElementById('addQuesFormContainer');
  formContainer.classList.toggle('d-none');

  if (!formContainer.classList.contains('d-none')) {
    document.getElementById('questionTag').value = '';
    document.getElementById('question').value = '';

    setTimeout(() => {
      document.getElementById('question')?.focus();
    }, 200);
  }
}

function closeQuestionForm() {
  document.getElementById('addQuesFormContainer').classList.add('d-none');
}

async function submitQuestion(selectedPatientId) {
  console.log(selectedPatientId);
  const questionTag = document.getElementById('questionTag').value.trim();
  const question = document.getElementById('question').value.trim();

  if (!question) {
    console.log('Please enter question', 'warning');
    return;
  }

  const payload = {

    patientId: selectedPatientId,
    questionTag: questionTag,
    question: question,
    answers: [],
    isDeleted: false,
    added: {
      addedDate: new Date(),
      userId: usrDetails?.data?._id,
      userName: usrDetails?.data?.profile?.name || ''
    }

  };

  try {
    await fetchCollectionData('insertCollectionDataInDB', {
      collection: 'NetConsltPatientQuery',
      query: payload
    });

    console.log('Question added successfully', 'success');
    closeQuestionForm();
    ncPatientQuery({ patientId: selectedPatientId });

  } catch (error) {
    console.error(error);
    console.log('Failed to add question', 'danger');
  }

}

async function submitAnswer(questionId) {

  const answerText = document.getElementById('newAnswer').value.trim();

  if (!answerText) {
    console.log('Please enter an answer', 'warning');
    return;
  }

  const answerObj = {
    answer: answerText,
    added: {
      userId: usrDetails?.data?._id,
      userName: usrDetails?.data?.profile?.name,
      addedDate: new Date()
    }
  };

  try {
    await fetchCollectionData(
      'updateCollectionDataInDB',
      {
        collection: 'NetConsltPatientQuery',
        query: {
          selector: { _id: questionId },
          data: { $push: { answers: answerObj } }
        }
      }
    );

    // Re-fetch the updated question to refresh answers list
    const res = await fetchCollectionData(
      'fetchCollectionDataFromDB',
      {
        collection: 'NetConsltPatientQuery',
        query: { isDeleted: false, _id: questionId },
        queryType: 'standard'
      }
    );
    const updatedQuestion = res?.data?.[0];
    if (updatedQuestion) {
      // Find the clicked element for the active state
      const activeItem = document.querySelector('.question-item.active');
      showQuestionAnswers(activeItem, updatedQuestion);
    }
    console.log('Answer submitted', 'success');
  } catch (err) {
    console.error(err);
    console.log('Failed to submit answer', 'danger');
  }

}

let selectedPatient = null;  // always the latest visit record (for patientId / status ops)
let selectedVisit = null;    // the currently displayed visit (may differ when user picks an older one)
let allVisits = [];          // all visit records for this patient, sorted latest-first
let ncAllotDocLog = [];

async function openPatientWorkspace(patientId) {
  console.log(patientId)
  const response = await fetchCollectionData('fetchCollectionData', {
    collection: "NetConsltPatient",
    query: { patientId: patientId, isDeleted: false },
    options: { sort: { "added.addedDate": -1 } }
  });
  const response2 = await fetchCollectionData('fetchCollectionDataFromDB', {
    collection: "NCAllotDocLog",
    query: { patientId: patientId, 'allottedTo.docId': usrDetails?.data?._id },
    queryType: 'standard'
  });

  ncAllotDocLog = response2?.data || [];
  console.log(ncAllotDocLog);

  allVisits = response?.data || [];
  selectedPatient = allVisits[0];  // latest visit
  selectedVisit = selectedPatient;  // default to latest

  if (!selectedPatient) {
    console.log('Patient record not found', 'danger');
    return;
  }

  // Build context from the latest visit for the initial page render
  const context = _buildContext(selectedPatient);
  navigateTo('patientWorkspace', context, ['initPatientMenu']);
}

/** Shared context builder — avoids repeating key list in two places */
function _buildContext(r) {
  return {
    id: r._id,
    patientName: r.patientName,
    patientId: r.patientId,
    age: r.age,
    gender: r.gender,
    address: r.address,
    instHsptlName: r.instHsptlName,
    pincode: r.pincode,
    diagnosisPrimary: r.diagnosisPrimary,
    icdDiagnosis: r.icdDiagnosis,
    patientRelatedThemeName: r.patientRelatedThemeName,
    patientClinicalDetails: r.patientClinicalDetails,
  };
}

function updateOverviewDOM(r) {
  const set = (sel, val) => {
    const el = document.querySelector(sel);
    if (el) el.textContent = val || '-';
  };

  // Demographics table
  const rows = document.querySelectorAll('#patientContent table tr td');
  const demoCols = [r.patientName, r.patientId, r.gender, r.age, r.instHsptlName, r.pincode];
  demoCols.forEach((val, i) => { if (rows[i]) rows[i].textContent = val || '-'; });

  // Diagnosis table (second table)
  const diagRows = document.querySelectorAll('#patientContent table');
  if (diagRows[1]) {
    const dCols = diagRows[1].querySelectorAll('td');
    const diagData = [r.diagnosisPrimary, r.icdDiagnosis, '-', r.patientRelatedThemeName];
    diagData.forEach((val, i) => { if (dCols[i]) dCols[i].textContent = val || '-'; });
  }

  // Clinical details
  const clinEl = document.querySelector('#patientContent .card-text');
  if (clinEl) clinEl.textContent = r.patientClinicalDetails || '-';
}

function showPage(pageId) {
  const pages = ['patientContent', 'reportsPage', 'imagesPage', 'queriesPage', 'callPage', 'allotLogPage', 'fovAppProRepo', 'fovApplication'];
  if (pageId !== 'queriesPage') stopQueriesPolling();

  pages.forEach(id => {
    const el = document.getElementById(id);
    el?.classList.toggle('d-none', id !== pageId);
  });
}

function handleTabSwitch(page) {
  if (!selectedVisit) return;

  switch (page) {
    case 'patientDetailsPage':
      showPage('patientContent');
      break;
    case 'reportsPage':
      showPage('reportsPage');
      renderReports(selectedVisit);
      break;
    case 'imagesPage':
      showPage('imagesPage');
      renderImages(selectedVisit);
      break;
    case 'queriesPage':
      showPage('queriesPage');
      // queries are per-patient (all visits), use patientId from selectedPatient
      ncPatientQuery(selectedPatient).then(() => {
        startQueriesPolling(selectedPatient.patientId);
      });
      break;
    case 'callPage':
      showPage('callPage');
      break;
    case 'allotLogPage':
      showPage('allotLogPage');
      loadNCAllotLog(selectedVisit.patientId);
      break;
  }
}

function initPatientMenu() {

  const countOfVisitsEl = document.getElementById('countOfVisits');
  const patientVisitsDropdown = document.getElementById('patientVisits');

  if (allVisits.length > 1) {
    countOfVisitsEl?.classList.remove('d-none');

    if (patientVisitsDropdown) {
      patientVisitsDropdown.innerHTML = '';
      allVisits.forEach((visit, index) => {
        const option = document.createElement('option');
        option.value = visit._id;
        option.text = index === 0 ? `Visit ${allVisits.length} (Latest)` : `Visit ${allVisits.length - index}`;
        patientVisitsDropdown.appendChild(option);
      });

      patientVisitsDropdown.value = selectedPatient._id;
      patientVisitsDropdown.onchange = () => {
        selectedVisit = allVisits.find(visit => visit._id === patientVisitsDropdown.value);
        if (!selectedVisit) return;

        updateOverviewDOM(selectedVisit);

        // Refresh whatever tab is currently active
        const activeTab = document.querySelector('.sidebar-btn.active');
        if (activeTab) handleTabSwitch(activeTab.dataset.page);
      };
    }
  } else {
    countOfVisitsEl?.classList.add('d-none');
  }

  const isNodal = usrDetails?.data?.roles?.includes('NC Nodal');
  document.getElementById('patientStatusPanel')?.classList.toggle('d-none', !isNodal);
  document.getElementById('allotLogBtn')?.classList.toggle('d-none', !isNodal);

  const statusSelect = document.getElementById('patientStatus');
  if (statusSelect) {
    statusSelect.onchange = () => updatePatientStatus();
  }
  document.getElementById('callPageBtn')?.classList.remove('d-none');

  const isConsultant = usrDetails?.data?.roles?.includes('NC Consultant');
  document.getElementById('ncCallPanel')?.classList.toggle('d-none', !isConsultant);
  document.getElementById('docApprovalPanel')?.classList.toggle('d-none', !isConsultant);

  const docApprovalSelect = document.getElementById('docApproval');

  const patientDoc = ncAllotDocLog[0];
  let lastAllot = null;

  if (patientDoc && Array.isArray(patientDoc.allottedTo)) {
    lastAllot = patientDoc.allottedTo.find(allot => allot.docId === usrDetails?.data?._id);
  }
  console.log("lastAllot matched doctor object:", lastAllot);

  if (lastAllot && docApprovalSelect) {
    docApprovalSelect.value = lastAllot.status;
  }

  if (docApprovalSelect) {
    docApprovalSelect.onchange = () => updateDocApproval();
  }

  document.querySelectorAll('.sidebar-btn').forEach(btn => {
    btn.onclick = () => {
      document.querySelectorAll('.sidebar-btn').forEach(x => x.classList.remove('active'));
      btn.classList.add('active');
      handleTabSwitch(btn.dataset.page);
    };
  });
}

function renderReports(patientRecord) {
  const p = patientRecord || {};

  const reportConfig = [
    { container: "MedicalReports1", files: "medicalReport1", summary: "summaryOfReport1", date: "medicalReport1Date" },
    { container: "MedicalReports2", files: "medicalReport2", summary: "medicalReport2Summary", date: "medicalReport2Date" },
    { container: "HistopathoReports1", files: "histopathoReport1", summary: "histopathoReport1Summary" },
    { container: "HistopathoReports2", files: "histopathoReport2", summary: "histopathoReport2Summary" },
    { container: "RadioReports", files: "radioImgReports", summary: "radioImgReportsSummary" },
    { container: "BloodReports", files: "bloodReports", summary: "bloodReportsSummary" }
  ];

  reportConfig.forEach(report => {
    const container = document.getElementById(report.container);
    if (!container) return;

    const files = p[report.files] || [];
    const summary = p[report.summary] || "No summary available.";
    const date = report.date && p[report.date]
      ? new Date(p[report.date]).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
      : "";

    if (files.length > 0) {
      missionHospitalImages = files;
    }

    const fileHtml = files.length > 0
      ? renderFunctions['imgArray']({ images: files, hspName: container.id })
      : `<div class="text-muted mb-3">No files uploaded.</div>`;

    container.innerHTML = `
      ${date ? `<p><strong>Date:</strong> ${date}</p>` : ""}
      ${fileHtml}
      <div class="mb-3">
        <strong>Summary</strong>
        <p class="text-muted mb-2">${summary}</p>
      </div>
    `;
  });
}

async function ncCallBtn(patientId) {
  const ncCallSelect = document.getElementById('ncCallSelect')?.value;

  if (confirm("Are you sure you want to enable the call for this patient?")) {
    const dataSet = {
      ncCall: ncCallSelect,
      ncCallUpdatedBy: usrDetails?.data?.userName,
      ncCallUpdatedById: usrDetails?.data?._id,
      ncCallUpdatedOn: new Date(),
    };

    await fetchCollectionData('updateCollectionDataInDB', {
      collection: 'NetConsltPatient',
      query: {
        selector: { patientId: patientId },
        data: { ncCall: dataSet }
      }
    });

    if (ncCallSelect === 'Yes') {
      showPage('callPage');
      document.getElementById('callPageBtn')?.classList.add('d-none');
    }
  }
}

async function updatePatientStatus() {
  if (!selectedPatient) return;

  const statusElement = document.getElementById('patientStatus');
  const patientStatus = statusElement.value;

  if (!confirm("Are you sure you want to update the status for this patient?")) {
    statusElement.value = '';
    return;
  }

  const updateData = {
    patientStatus: patientStatus,
    patientStatusUpdatedBy: usrDetails?.data?.userName,
    patientStatusUpdatedById: usrDetails?.data?._id,
    patientStatusUpdatedOn: new Date(),
  };

  // FIX: If approved, compute new ID and append it to updates object
  if (patientStatus === 'Allotted') {
    // const lastPatientResponse = await fetchCollectionData('fetchCollectionData', {
    //   collection: 'NetConsltPatient',
    //   query: { isDeleted: false },
    //   projection: { patientId: 1 },
    //   options: { limit: 1, sort: { 'added.addedDate': -1 } }
    // });

    // if (lastPatientResponse?.data?.length > 0) {
    //   const currentYear = new Date().getFullYear().toString().slice(2);
    //   const lastIdStr = lastPatientResponse.data[0].patientId || "00NC0000";
    //   const lastPatientIdNum = Number(lastIdStr.split("NC")[1]) || 0;

    //   // Update data block to write back the new patientId string
    //   updateData.patientId = currentYear + "NC" + String(lastPatientIdNum + 1).padStart(4, '0');
    // }

    await fetchCollectionData('insertCollectionDataInDB', {
      collection: 'NCAllotDocLog',
      query: {
        patientId: selectedPatient.patientId,
        allottedTo: []
      }
    }).then(res => {
      console.log(res);
    })
  }

  await fetchCollectionData('updateCollectionDataInDB', {
    collection: 'NetConsltPatient',
    query: {
      selector: { _id: selectedPatient._id }, // Using explicit entry ID matches precisely across multiple visits
      data: updateData
    }
  });
}


async function updateDocApproval() {
  if (!selectedPatient) return;

  const approvalElement = document.getElementById('docApproval');
  const docApproval = approvalElement.value;
  console.log("docApproval", docApproval);

  if (docApproval !== "Accepted" && docApproval !== "Rejected") {
    console.error("Invalid approval status");
    return;
  }

  if (!confirm("Are you sure you want to update the status for this patient?")) {
    approvalElement.value = '';
    return;
  }

  const updateData = {
    $set: {
      "allottedTo.$.status": docApproval,
      "allottedTo.$.updatedDate": new Date()
    }
  };

  try {
    const res = await fetchCollectionData('updateCollectionDataInDB', {
      collection: 'NCAllotDocLog',
      query: {
        selector: {
          patientId: selectedPatient.patientId,
          'allottedTo.docId': usrDetails?.data?._id
        },
        data: updateData
      }
    });
    console.log("Update success:", res);
  } catch (error) {
    console.error("Failed to update database:", error);
  }
}

async function loadFovAppDashboard() {

  document.querySelectorAll('.sidebar-btn').forEach(btn => {
    btn.onclick = () => {
      document.querySelectorAll('.sidebar-btn').forEach(x => x.classList.remove('active'));
      btn.classList.add('active');
      handleTabSwitch(btn.dataset.page,);
    };
  });

  function handleTabSwitch(page) {
    switch (page) {
      case 'fovAppDetailsPage':
        showPage('fovApplication');
        loadFovApplication('Draft');
        break;
      case 'fovAppProRepoPage':
        showPage('fovAppProRepo');
        break;
    }
  }

  $('#fovTabs').off('click', '.fovAppTab').on('click', '.fovAppTab', function (e) {
    e.preventDefault();

    $('#fovTabs li').removeClass('active');
    $(this).parent('li').addClass('active');

    const selectedTab = $(this).attr('id');
    loadFovApplication(selectedTab);
  });

}

async function loadFovAdminDashboard() {
  // 1. Sidebar tab switching logic
  document.querySelectorAll('.sidebar-btn').forEach(btn => {
    btn.onclick = () => {
      document.querySelectorAll('.sidebar-btn').forEach(x => x.classList.remove('active'));
      btn.classList.add('active');
      handleTabSwitch(btn.dataset.page);
    };
  });

  function handleTabSwitch(page) {
    switch (page) {
      case 'fovApplicationPage':
        showPage('fovApplication');
        loadFovAppStatusTable('Pending');
        break;
      case 'fovAppProRepoPage':
        showPage('fovAppProRepo');
        break;
    }
  }

  $('#fovTabs').off('click', '.fovAppTab').on('click', '.fovAppTab', function (e) {
    e.preventDefault();

    $('#fovTabs li').removeClass('active');
    $(this).parent('li').addClass('active');

    const selectedTab = $(this).attr('id');
    loadFovAppStatusTable(selectedTab);
  });
}


function initNcNavigation() {
 
  const pages = document.querySelectorAll('.content-page');
 
  document.querySelectorAll('.nav-btn').forEach(oldBtn => {
 
    // Strip any handlers left over from a previous visit to this module.
    const btn = oldBtn.cloneNode(true);
    oldBtn.parentNode.replaceChild(btn, oldBtn);
 
    btn.addEventListener('click', () => {
 
      const targetPage = btn.dataset.page;
 
      /* ACTIVE BUTTON */
      document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
 
      /* PAGE SWITCH */
      pages.forEach(page => page.classList.add('d-none'));
      document.getElementById(targetPage)?.classList.remove('d-none');
 
      /* CLOSE MOBILE MENU */
      const navbarCollapse = document.getElementById('ncNavbar');
      if (navbarCollapse?.classList.contains('show')) {
        bootstrap.Collapse.getInstance(navbarCollapse)?.hide();
      }
 
      /* LOAD PAGE DATA */
      loadNcPage(targetPage);
    });
  });
}
 
 
/* ─────────────────────────────────────────────────────────────────────────
   [3] app.js — replaces statusCount() at ~line 561
   Two bugs:
     a) It passed an ARRAY of request definitions to fetchCollectionData(),
        which takes a single object everywhere else in the app.
     b) It counted NetConsltPatient where status:'Submitted' — but
        ncPatientReqForm() never writes a `status` field. 'Submitted' is
        written to NetConsltRegApp, a different collection. So the badge
        was always blank.
 
   Below counts patients with no nodal decision yet, i.e. genuinely new
   requests. >>> CONFIRM this is the rule you want before shipping. <<<
   ───────────────────────────────────────────────────────────────────────── */
 
async function statusCount() {
  try {
    const badge = document.getElementById('networkConslt');
    if (!badge) return;   // card not on the current page
 
    const results = await fetchCollectionData('fetchCollectionData', {
      collection: "NetConsltPatient",
      query: { isDeleted: false, patientStatus: { $exists: false } },
      projection: { _id: 1 }
    });
 
    const count = results?.data?.length || 0;
    badge.textContent = count > 0 ? count : ' ';
 
  } catch (error) {
    console.error("Error loading status of cards:", error);
  }
}
 
 
async function ncPatientsAllotList(tableId) {
 
    $.fn.dataTable.ext.errMode = 'none';
 
    if ($.fn.DataTable.isDataTable(`#${tableId}`)) {
        $(`#${tableId}`).DataTable().destroy();
    }
 
    $(`#${tableId}`).DataTable({
        ajax: function (data, callback, settings) {
            (async () => {
                try {
                    const dataN = await fetchCollectionData('fetchCollectionData', {
                        collection: "NCPatientAllotLog",
                        query: { isDeleted: false },
                        options: { sort: { "added.addedDate": -1 } }
                    });
                    callback({ data: dataN.data || [] });
                } catch (err) {
                    console.error("Allot list fetch error:", err);
                    callback({ data: [] });
                }
            })();
        },
        order: [],
        dom: "<'row'<'col-sm-12 col-md-4'><'col-sm-12 col-md-4'><'col-sm-12 col-md-4'f>>" +
            "<'row'<'col-sm-12'tr>>" +
            "<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>",
        columns: [
            { data: "patientId", title: "Patient ID", defaultContent: '-' },
            { data: "patientName", title: "Patient Name", defaultContent: '-' },
            { data: "gender", title: "Gender", defaultContent: '-' },
            {
                data: null,
                title: "Institution/Hospital Name",
                render: function (data) {
                    return data.missionHospital?.missionHospitalName
                        || data.hospitalName
                        || 'CMC';
                }
            },
            {
                data: null,
                title: "Allotted To",
                render: function (data) {
                    return Array.isArray(data.allottedTo)
                        ? data.allottedTo.map(item => item.name).join(', ')
                        : '-';
                }
            },
            {
                data: null,
                title: "View Details",
                orderable: false,
                className: "text-center",
                // FIX: use `row`, not the unrelated patientDataTable handle
                render: function (data, type, row) {
                    if (!row?.patientId) return '-';
                    return `<button class="btn btn-sm btn-info"
                              onclick="openPatientWorkspace('${row.patientId}')">
                              <i class="fas fa-list"></i>
                            </button>`;
                }
            }
        ]
    });
}
 
 
function renderImages(patientRecord) {
  const p = patientRecord || {};
  const container = document.getElementById('imagesPage');
  if (!container) return;
 
  // Same field groups renderReports() reads, flattened into one gallery.
  const imageFields = [
    { key: 'radioImgReports', label: 'Radiological Images' },
    { key: 'histopathoReport1', label: 'Histopathology 1' },
    { key: 'histopathoReport2', label: 'Histopathology 2' },
    { key: 'medicalReport1', label: 'Medical Reports 1' },
    { key: 'medicalReport2', label: 'Medical Reports 2' },
    { key: 'bloodReports', label: 'Blood Reports' }
  ];
 
  const isImage = (f) => {
    const u = (f?.url || f?.originalName || '').toLowerCase();
    return /\.(png|jpe?g|gif|webp|bmp|tiff?)(\?|$)/.test(u);
  };
 
  // Collect every image-type file, keeping its source group as the caption.
  const groups = imageFields
    .map(g => ({ label: g.label, files: (p[g.key] || []).filter(isImage) }))
    .filter(g => g.files.length > 0);
 
  if (!groups.length) {
    container.innerHTML = `
      <div class="card shadow-sm border-0 rounded-3">
        <div class="card-body text-center text-muted py-5">
          <i class="fas fa-x-ray fs-1 mb-3 text-secondary opacity-50"></i>
          <p class="mb-0">No images uploaded for this visit.</p>
        </div>
      </div>`;
    return;
  }
 
  // The gallery modal reads this global for its carousel (see modal.js:339).
  missionHospitalImages = groups.flatMap(g => g.files);
 
  container.innerHTML = groups.map(g => `
    <div class="card shadow-sm border-0 rounded-3">
      <div class="card-body">
        <h4 class="mb-4">${g.label}</h4>
        <div class="row g-3">
          ${renderFunctions['imgArray']({ images: g.files, hspName: 'imagesPage' })}
        </div>
      </div>
    </div>
  `).join('');
}
 
 
async function loadNCAllotLog(patientId) {
 
  $.fn.dataTable.ext.errMode = 'none';
 
  if ($.fn.DataTable.isDataTable('#ncAllotLogTable')) {
    $('#ncAllotLogTable').DataTable().destroy();
  }
 
  $('#ncAllotLogTable').DataTable({
    ajax: function (data, callback) {
      (async () => {
        try {
          const res = await fetchCollectionData('fetchCollectionData', {
            collection: "NCPatientAllotLog",
            query: { isDeleted: false, patientId: patientId },
            options: { sort: { "added.addedDate": -1 } }
          });
          callback({ data: res.data || [] });
        } catch (err) {
          console.error("Allot log fetch error:", err);
          callback({ data: [] });
        }
      })();
    },
    order: [],
    searching: false,
    lengthChange: false,
    columns: [
      {
        data: null,
        title: "Allotted To",
        render: (d) => Array.isArray(d.allottedTo)
          ? d.allottedTo.map(i => i.name).join(', ')
          : '-'
      },
      {
        data: null,
        title: "Department",
        render: (d) => Array.isArray(d.allottedTo)
          ? [...new Set(d.allottedTo.map(i => i.department).filter(Boolean))].join(', ') || '-'
          : '-'
      },
      { data: "allotStatus", title: "Status", defaultContent: '-' },
      { data: "added.userName", title: "Allotted By", defaultContent: '-' },
      {
        data: "added.addedDate",
        title: "Date",
        defaultContent: '-',
        render: (d, type) => (d && type !== 'sort')
          ? moment(d).format("DD-MM-YYYY hh:mm A")
          : d
      }
    ]
  });
}
 
 

function showPage(pageId) {
  const pages = [
    'patientContent',
    'reportsPage',
    'imagesPage',
    'queriesPage',
    'callPage',
    'allotLogPage'      // FIX: was missing
  ];
 
  if (pageId !== 'queriesPage') stopQueriesPolling();
 
  pages.forEach(id => {
    const el = document.getElementById(id);
    el?.classList.toggle('d-none', id !== pageId);
  });
}
 
function initPatientMenu() {
 
  const countOfVisitsEl = document.getElementById('countOfVisits');
  const patientVisitsDropdown = document.getElementById('patientVisits');
 
  if (allVisits.length > 1) {
    countOfVisitsEl?.classList.remove('d-none');
 
    if (patientVisitsDropdown) {
      patientVisitsDropdown.innerHTML = '';
      allVisits.forEach((visit, index) => {
        const option = document.createElement('option');
        option.value = visit._id;
        option.text = index === 0
          ? `Visit ${allVisits.length} (Latest)`
          : `Visit ${allVisits.length - index}`;
        patientVisitsDropdown.appendChild(option);
      });
 
      patientVisitsDropdown.value = selectedPatient._id;
      patientVisitsDropdown.onchange = () => {
        selectedVisit = allVisits.find(v => v._id === patientVisitsDropdown.value);
        if (!selectedVisit) return;
 
        updateOverviewDOM(selectedVisit);
 
        const activeTab = document.querySelector('.sidebar-btn.active');
        if (activeTab) handleTabSwitch(activeTab.dataset.page);
      };
    }
  } else {
    countOfVisitsEl?.classList.add('d-none');
  }
 
  const roles = usrDetails?.data?.roles || [];
  const isNodal = roles.includes('NC Nodal');
  const isConsultant = roles.includes('NC Consultant');
 
  /* Nodal-only: status dropdown + allotment log tab */
  document.getElementById('patientStatusPanel')?.classList.toggle('d-none', !isNodal);
  document.getElementById('allotLogBtn')?.classList.toggle('d-none', !isNodal);
 
  const statusSelect = document.getElementById('patientStatus');
  if (statusSelect) {
    // Reflect the stored value so the nodal sees the current status.
    statusSelect.value = selectedPatient?.patientStatus || '';
    statusSelect.onchange = () => updatePatientStatus();
  }
 
  /* Consultant-only: "does this patient need a conference call?" */
  document.getElementById('ncCallPanel')?.classList.toggle('d-none', !isConsultant);
  const ncCallSelect = document.getElementById('ncCallSelect');
  if (ncCallSelect) ncCallSelect.value = selectedPatient?.ncCall?.ncCall || 'No';
 
  /* Call tab: only when a call has actually been enabled on the record */
  const callEnabled = selectedPatient?.ncCall?.ncCall === 'Yes';
  document.getElementById('callPageBtn')?.classList.toggle('d-none', !callEnabled);
 
  document.querySelectorAll('.sidebar-btn').forEach(btn => {
    btn.onclick = () => {
      document.querySelectorAll('.sidebar-btn').forEach(x => x.classList.remove('active'));
      btn.classList.add('active');
      handleTabSwitch(btn.dataset.page);
    };
  });
}
 
 
function _refreshQuestionList(questions) {
 
  const prevQuestions = _lastQuestionData;   // FIX: snapshot BEFORE overwrite
 
  const signature = questions.map(q => q._id + ':' + (q.answers?.length ?? 0)).join('|');
  const prevSignature = prevQuestions.map(q => q._id + ':' + (q.answers?.length ?? 0)).join('|');
 
  if (signature === prevSignature) return;   // nothing changed
 
  const activeEl = document.querySelector('.question-item.active');
  const activeQId = activeEl?.dataset?.qid;
 
  _lastQuestionData = questions;
 
  // Pass the open question through so the re-render keeps the user's place.
  renderQuestionList(questions, activeQId);
 
  if (!activeQId) return;
 
  const updatedQ = questions.find(q => q._id === activeQId);
  const newEl = document.querySelector(`.question-item[data-qid="${activeQId}"]`);
  if (!newEl || !updatedQ) return;
 
  const prevQ = prevQuestions.find(q => q._id === activeQId);
  const prevCount = prevQ?.answers?.length ?? 0;
 
  // Only redraw the answer panel when an answer actually arrived — otherwise
  // we'd wipe whatever the user is typing in #newAnswer every 10 seconds.
  if ((updatedQ.answers?.length ?? 0) !== prevCount) {
    showQuestionAnswers(newEl, updatedQ);
  }
}
 
function renderQuestionList(questions, activeQId = null) {
 
  const container = document.getElementById('ncQuestionList');
  if (!container) return;
 
  if (!questions.length) {
    container.innerHTML = `<div class="text-center p-4 text-muted">No questions available</div>`;
    return;
  }
 
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g,
    c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
 
  // Keep the open question if it still exists, else fall back to the first.
  const keepId = questions.some(q => q._id === activeQId) ? activeQId : questions[0]._id;
 
  container.innerHTML = questions.map((q) => {
    const date = q?.added?.addedDate
      ? new Date(q.added.addedDate).toLocaleDateString('en-GB',
          { day: '2-digit', month: 'short', year: 'numeric' })
      : '';
    const tagClass = q.questionTag === 'High' ? 'bg-danger'
      : q.questionTag === 'Medium' ? 'bg-warning text-dark'
      : 'bg-success';
 
    return `
      <div class="question-item ${q._id === keepId ? 'active' : ''}" data-qid="${esc(q._id)}">
        <div class="question-title">
          ${esc(q.question) || 'Untitled Question'}
          ${q.questionTag ? `<span class="badge ${tagClass} ms-1">${esc(q.questionTag)}</span>` : ''}
        </div>
        <div class="question-meta">${esc(q?.added?.userName)} &bull; ${date}</div>
      </div>`;
  }).join('');
 
  // Bind by reference — no JSON in markup.
  container.querySelectorAll('.question-item').forEach(el => {
    el.onclick = () => {
      const q = _lastQuestionData.find(x => x._id === el.dataset.qid);
      if (q) showQuestionAnswers(el, q);
    };
  });
 
  // First paint only: open the highlighted question so the right-hand panel
  // isn't stuck on the placeholder. On a poll refresh (activeQId present)
  // _refreshQuestionList decides whether a redraw is warranted.
  if (!activeQId) {
    const first = container.querySelector(`.question-item[data-qid="${esc(keepId)}"]`);
    const firstQ = questions.find(q => q._id === keepId);
    if (first && firstQ) showQuestionAnswers(first, firstQ);
  }
}
 
async function ncCallBtn(patientId) {
  const ncCallSelect = document.getElementById('ncCallSelect')?.value;
  if (!ncCallSelect) return;
 
  if (!confirm("Are you sure you want to update the conference call for this patient?")) return;
 
  const ncCall = {
    ncCall: ncCallSelect,
    ncCallUpdatedBy: usrDetails?.data?.profile?.name || '',   // FIX
    ncCallUpdatedById: usrDetails?.data?._id || '',
    ncCallUpdatedOn: new Date()
  };
 
  try {
    await fetchCollectionData('updateCollectionDataInDB', {
      collection: 'NetConsltPatient',
      query: {
        selector: { patientId: patientId },
        data: { ncCall: ncCall }        // FIX: no double nesting
      }
    });
 
    // Keep the client-side record in step with what we just wrote.
    if (selectedPatient) selectedPatient.ncCall = ncCall;
 
    const callBtn = document.getElementById('callPageBtn');
    if (ncCallSelect === 'Yes') {
      callBtn?.classList.remove('d-none');
      showPage('callPage');
    } else {
      callBtn?.classList.add('d-none');
    }
  } catch (err) {
    console.error('Failed to update conference call:', err);
    alert('Could not update the conference call. Please try again.');
  }
}

async function updatePatientStatus() {
  if (!selectedPatient) return;
 
  const statusElement = document.getElementById('patientStatus');
  const patientStatus = statusElement.value;
  if (!patientStatus) return;
 
  if (!confirm("Are you sure you want to update the status for this patient?")) {
    statusElement.value = selectedPatient.patientStatus || '';
    return;
  }
 
  const updateData = {
    patientStatus: patientStatus,
    patientStatusUpdatedBy: usrDetails?.data?.profile?.name || '',   // FIX
    patientStatusUpdatedById: usrDetails?.data?._id || '',
    patientStatusUpdatedOn: new Date()
  };
 
  // Mint a YYNC#### id on allotment, only if this patient doesn't have one.
  if (patientStatus === 'Allotted' && !selectedPatient.patientId) {
    try {
      const lastPatientResponse = await fetchCollectionData('fetchCollectionData', {
        collection: 'NetConsltPatient',
        query: { isDeleted: false, patientId: { $exists: true, $ne: null } },
        projection: { patientId: 1 },
        options: { limit: 1, sort: { patientId: -1 } }     // FIX: sort by id, not date
      });
 
      const currentYear = new Date().getFullYear().toString().slice(2);
      const lastIdStr = lastPatientResponse?.data?.[0]?.patientId || `${currentYear}NC0000`;
      const lastPatientIdNum = Number(String(lastIdStr).split("NC")[1]) || 0;
 
      updateData.patientId = currentYear + "NC" + String(lastPatientIdNum + 1).padStart(4, '0');
    } catch (err) {
      console.error('Could not generate patient id:', err);
      alert('Could not generate a patient ID. Status not updated.');
      statusElement.value = selectedPatient.patientStatus || '';
      return;
    }
  }
 
  try {
    await fetchCollectionData('updateCollectionDataInDB', {
      collection: 'NetConsltPatient',
      query: {
        selector: { _id: selectedPatient._id },   // explicit visit record
        data: updateData
      }
    });
 
    Object.assign(selectedPatient, updateData);
    if (updateData.patientId) {
      document.querySelectorAll('.patient-header small, .d-lg-none small')
        .forEach(el => { el.textContent = updateData.patientId; });
    }
  } catch (err) {
    console.error('Failed to update patient status:', err);
    alert('Could not update the status. Please try again.');
    statusElement.value = selectedPatient.patientStatus || '';
  }
}

// SAM Project script starts

function escapeSamHtml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

const SAM_STATUS_META = {
  Draft:        { label: 'Draft',        cls: 'sam-status-draft' },
  Submitted:    { label: 'Submitted',    cls: 'sam-status-submitted' },
  UnderReview:  { label: 'Under Review', cls: 'sam-status-underreview' },
  Approved:     { label: 'Approved',     cls: 'sam-status-approved' },
  Rejected:     { label: 'Rejected',     cls: 'sam-status-rejected' }
};

function renderSamStatusBadge(status) {
  const meta = SAM_STATUS_META[status] || { label: status || 'Draft', cls: 'sam-status-draft' };
  return `<span class="sam-status-badge ${meta.cls}">${escapeSamHtml(meta.label)}</span>`;
}

function formatSamDate(value) {
  if (!value) return '';
  const d = new Date(value);
  if (isNaN(d.getTime())) return '';
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) +
    ' ' + d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
}

renderFunctions.samAppView = (data) => {
  return `
    <div class="p-2">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h5 class="mb-0"><i class="fa fa-file-lines me-2"></i>Application ${escapeSamHtml(data?.samGrantId || '')}</h5>
        ${renderSamStatusBadge(data?.applicationStatus)}
      </div>
      <div id="samAppViewForm"></div>
    </div>
  `;
};

renderFunctions.samReportView = (data) => {
  return `
    <div class="p-2">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h5 class="mb-0"><i class="fa fa-file-circle-check me-2"></i>Training Report — ${escapeSamHtml(data?.samGrantId || '')}</h5>
        ${renderSamStatusBadge(data?.reportStatus)}
      </div>
      <div id="samReportViewForm"></div>
    </div>
  `;
};

async function renderSamReadOnlyForm(targetElId, formKey, submissionData) {
  const el = document.getElementById(targetElId);
  if (!el) return;
  const schemaResp = await window.getSamFormSchema(formKey);
  const schema = schemaResp?.data?.[0];
  if (!schema) {
    el.innerHTML = '<div class="alert alert-warning">Could not load the form to display this record.</div>';
    return;
  }
  Formio.createForm(el, schema, { readOnly: true, hide: { style: true, missionOfficeUse: true } })
    .then((form) => {
      form.submission = { data: submissionData || {} };
    });
}

function renderSingleSamChatMessage(msg, index, viewerRole, viewerUserId) {
  const isMine = msg.authorRole === viewerRole && (!msg.authorId || msg.authorId === viewerUserId);
  const roleLabel = msg.authorRole === 'admin' ? 'SAM Grant Committee' : (msg.authorName || 'Applicant');
  const canDelete = isMine; // only the author can delete their own message
  return `
    <div class="sam-chat-bubble-row ${isMine ? 'mine' : 'theirs'}">
      <div class="sam-chat-bubble">
        <div class="fw-bold small mb-1">${escapeSamHtml(roleLabel)}</div>
        <div>${msg.message || ''}</div>
        <div class="sam-chat-meta">
          <span>${formatSamDate(msg.postedAt)}</span>
          ${canDelete ? `<span class="sam-chat-delete delete-sam-chat" data-index="${index}">Delete</span>` : ''}
        </div>
      </div>
    </div>
  `;
}

renderFunctions.samAppChat = (data) => {
  currentSamChatRecord = data;

  const thread = Array.isArray(data?.samChatThread) ? data.samChatThread : [];
  const viewerRole = data?.viewerRole || 'applicant';
  const viewerUserId = usrDetails?.data?._id || '';

  const bubblesHTML = thread.length === 0
    ? `<div class="sam-chat-empty"><i class="fa fa-comments fa-2x mb-3"></i><div>No messages yet — start the conversation below.</div></div>`
    : thread.map((m, i) => renderSingleSamChatMessage(m, i, viewerRole, viewerUserId)).join('');

  return `
    <div class="sam-chat-container">
      <div class="d-flex justify-content-between align-items-center mb-2">
        <div>
          <h5 class="mb-0"><i class="fa fa-comments me-2"></i>Application Chat</h5>
          <small class="text-muted">${escapeSamHtml(data?.samGrantId || '')} &middot; ${escapeSamHtml(data?.applicantName || '')}</small>
        </div>
      </div>
      <div id="samChatThread" class="sam-chat-thread">
        ${bubblesHTML}
      </div>
      <div class="sam-chat-editor-wrap">
        <div id="samNewChatMessage" class="sam-chat-editor"></div>
        <div class="d-flex justify-content-between align-items-center mt-2">
          <small id="samChatError" class="text-danger"></small>
          <button type="button" class="btn sam-btn-gold btn-sm" id="saveSamChatMessage"
              data-sam-id="${escapeSamHtml(data?._id || '')}" data-viewer-role="${escapeSamHtml(viewerRole)}">
            <i class="fa fa-paper-plane me-1"></i> Send
          </button>
        </div>
      </div>
    </div>
  `;
};

//SAM Project script