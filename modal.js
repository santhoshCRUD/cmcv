async function openModal(category = '', identifier = '', data) {
  console.log(category, identifier, data)
  function carouselImage(identifier, missionHospitalImages) {
    return `
        ${missionHospitalImages.map((image, index) => `
          <div class="carousel-item ${image.url === identifier ? 'active' : ''}">
            <img src="${image.url}" class="d-block w-100" alt="...">
          </div>
        `).join('')}
    `;
  }
  try {
    const collections = {
      "News": {
        "collection": "NewsData",
        "query": {
          '_id': identifier,
          'newsUserType.newsUserTypeName': "external user",
          isDeleted: 'false'
        }
      },
      "Bio Ethics": {
        "collection": "BioEthics",
        "query": {},
        "options": { "sort": { "$natural": -1 }, "limit": 1 }
      }
    };
    const staticModalData = {
      "contactMissions": {
        title: 'For assistance in Missions Department, please contact',
        contactList: [
          {
            iconImage: 'fa-circle-user',
            detail: 'Missions Department- Directorate'
          },
          {
            iconImage: 'fa-envelope',
            detail: 'missionsoffice@cmcvellore.ac.in​'
          },
          {
            iconImage: 'fa-phone',
            detail: 'Phone: 0416- 228 6117/ 6229​'
          },
        ],
        cardData: {
          type: 'cardList',
          cardName: 'Mission Office Members',
          icon: "./images/feather-solid.svg",
          heading: "Mission Office Members",
          cardWidth: '',
          data: {
            missionOfficeMembers: [
              { "salutation": "Dr. ", "name": "Jachin Velavan", "employeeNo": "28170", "designation": "Associate Director (Missions)" },
              { "salutation": "Dr. ", "name": "Anne Jennifer Prabhu", "employeeNo": "28224", "designation": "Deputy Director (Missions)" },
              { "salutation": "Dr. ", "name": "Sebin G Abraham", "employeeNo": "29425", "designation": "Institutional Missions Coordinator" },
              { "salutation": "Dr. ", "name": "Carol", "employeeNo": "28941", "designation": "Network Research Coordinator" },
              { "salutation": "Ms. ", "name": "Bency Vinitha Chhatria", "employeeNo": "43753", "designation": "Missions Network Coordinator" },
              { "salutation": "Mr. ", "name": "Abishek P", "employeeNo": "P4541", "designation": "Mission Help-desk Coordinator" },
              { "salutation": "Ms. ", "name": "Sharon Roshan", "employeeNo": "P4542", "designation": "Missions Communication Officer" },
              { "salutation": "Mr. ", "name": "Xavier Raja", "employeeNo": "T6506", "designation": "Missions Programmer" },
              { "salutation": "Ms. ", "name": "Jibi", "employeeNo": "44666", "designation": "Missions Communication Officer" },
              { "salutation": "Mr. ", "name": "Santhosh kumar", "employeeNo": "55896", "designation": "Missions Programmer" },


            ],
          }
        }
      },
      "nabhEntryLevel": {
        title: 'For assistance in applying for entry-level NABH accreditation from CMC, please contact:',
        contactList: [
          {
            iconImage: 'fa-user',
            detail: 'Dr. Lallu Joseph'
          },
          {
            iconImage: 'fa-circle-user',
            detail: 'Directorate - Quality Management Cell​'
          },
          {
            iconImage: 'fa-envelope',
            detail: 'missionsoffice@cmcvellore.ac.in  directorate.qmc@cmcvellore.ac.in'
          },
          {
            iconImage: 'fa-phone',
            detail: 'Phone: 0416-2282437​'
          },
        ],
      },
      "dls": {
        pdf: true
      },
      'contactHospitals': { contactHospitals: true, title: "Contact Hospitals", legalDetails: 'Please write to us: missionsoffice@cmcvellore.ac.in <br> Or call: +91 416 228 6119' },
      'missionHospitalVisits': { title: "Mission Hospital Visits", "cmgSoon": true }, 'trainingOrObservership': { title: "Training/Observership", "cmgSoon": true },
      // 'equipment': { title: "Equipment", "cmgSoon": true },
      "audio": {
        title: 'Audio resource',
        audio: true,
        audioData: data
      },
      "video": {
        title: 'Video resource',
        video: true,
        videoData: data
      },
      "image": {
        image: true,
        image: data
      },
      "popUpWindow": {
        title: data?.title ? `${data.title}` : '',
        popUpWindow: true,
        url: data?.url ? `${data.url}` : ''
      },
      "manpowerRequest": {
        table: true,
        type: 'manReq',
        request: {
          missionHospitalName: data?.msnHosp || '',
          specialization: data?.msnSpec || '',
          reqStatus: data?.msnReq?.requestStatus || '',
          reqType: data?.msnReq?.requestType || '',
          msqStatus: data?.msnReq?.missionStatus || ''
        }
      },
      "missionRequest": {
        chat: true,
        type: 'msnReq',
        request: {
          specialization: data?.missionSpecialization || '',
          reqStatus: data?.msnReq?.requestStatus || '',
          reqType: data?.msnReq?.requestType || '',
          msqStatus: data?.msnReq?.missionStatus || '',
        }
      },
      "gallery": {
        gallery: true,
        title: `Image Gallery of ${data}`,
      },
      "formIO": {
        formIO: true,
        title: `${data}`,
      },
      "instructions": {
        instructions: true,
        title: data?.userType ? `${data.userType} instructions` : '',
        instructionData: data?.userData ? `${data.userData}` : ''
      },
      "avatarCard": { "avatarCard": true },
      "weeklyManna": {
        weeklyManna: true,
        weMannaData: data
      },
      "researchNews": {
        researchNews: true,
        researchNews: data
      },
      "timeline": {
        timeline: true,
        timeline: data
      },
      "grandRounds": {
        grandRounds: true,
        grandRounds: data,
      },
      "grantsList": {
        grantsList: true,
        title: "Grants List"
      },
      "grantsAwardee": {
        grantsAwardee: true,
        title: "Grant Awardee",
        grantsAwardee: data,
      },
      "grandRoundsCal": {
        grandRoundsCal: true,
        title: "Grand Rounds Calendar",
      },
      "connectOneOnOne": {
        connectOneOnOne: true,
      },
      "preMmsVisits": {
        preMmsVisits: true,
        preMmsVisits: data,
      },
      "whatsNew": {
        whatsNew: true,
        whatsNew: data,
      },
      "grandRoundSchedule": {
        grandRoundSchedule: true,
        grandRoundSchedule: data,
        title: data?.grandRoundsTitle ? `${data.grandRoundsTitle}` + ' Schedule' : '',
      },
      "mmsApprovedPanel": {
        mmsApprovedPanel: true,
        mmsApprovedPanel: data,
      },
      "conclaveSummary": {
        conclaveSummary: true,
        conclaveSummary: data,
      },
      "eBook": {
        eBook: true,
        title: "E-Book",
      },
      "confirmModal": {
        confirmModal: true,
        message: data?.message || 'message',
        btnText: data?.btnText || 'Confirm'
      },
      "infoModal": {
        infoModal: true,
        infoModal: data,
      },
      "msgModal": {
        msgModal: true,
        msgModal: data,
      },
      "selectListModal": {
        selectListModal: true,
        selectListModal: data,
      },
      "fovAppDocs": {
        fovAppDocs: true,
      },
      "samAppDocs": {
        samAppDocs: true,
      },
    };
    let results = '';
    let content = {};
    if (collections[category]) {
      const { collection } = collections[category];
      const results = await fetchedDataAPI('fetchCollectionData', [collections[category]]);
      const { newsImage, modifiedDate, newsTitle, bioethicsTitle, newsSubTitle, newsDescription, bioethicsDescription } = results?.[collection]?.data?.[0] || {};

      content = await Object.fromEntries(
        Object.entries({
          image: newsImage || '',
          updatedDate: modifiedDate,
          title: newsTitle || bioethicsTitle,
          subTitle: newsSubTitle,
          description: newsDescription || bioethicsDescription,
        }).filter(([_, value]) => value)
      );
    } else if (staticModalData[category]) {
      if (category === "contactMissions") {
        content = staticModalData[category];
        const employeeNumbers = content.cardData.data.missionOfficeMembers.map(member => member.employeeNo);
        const facultiesCollection = [
          { "collection": "Faculties", "query": { employeeNo: { $in: employeeNumbers }, isDeleted: 'false' }, projection: { _id: 1, firstName: 1, lastName: 1, employeeNo: 1, avatar: 1 } }
        ];

        const fetchedData = await fetchedDataAPI('fetchCollectionData', facultiesCollection);

        // Update the missionMembers with fetched details from Faculties collection.
        fetchedData["Faculties"].data.forEach(faculty => {
          let member = content.cardData.data.missionOfficeMembers.find(member => member.employeeNo === faculty.employeeNo);
          if (member) {
            member._id = faculty._id;
            member.firstName = faculty.firstName;
            member.lastName = faculty.lastName;
            member.avatar = faculty.avatar;
          }
        });
        staticModalData['contactMissions'].cardData.data.memberCardTable = arrayDataRenderInCard('cardList', staticModalData['contactMissions'].cardData.data.missionOfficeMembers)

      }
      if (category === "manpowerRequest" || category === "missionRequest") {
        const generateList = (items, key) =>
          items?.length ? items.map(item => `<li>${item[key] || item}</li>`).join('') : '-nill-';
        const generateChat = (chats) =>
          chats?.length
            ? chats.map(chat => `
                  <div class="msg from ">
                    <div>${chat.misnExtcomment}</div>
                    <div class="grey-color1">on  ${moment(chat.misnExtcmtDate).format('DD-MM-YYYY')} by ${chat.misnExtcmtaddedBy}</div>
                  </div>
                `).join('')
            : '';

        // Generate each list
        const linkedCourses = generateList(data.msnReq?.selectedLinkedCourses, 'name');
        const visitPurposeTable = generateList(data.msnReq?.visitPurpose);
        const selectedLinkedDepartmentsTable = generateList(data.msnReq?.selectedLinkedDepartments, 'name');
        const chatTable = generateChat(data.msnReq?.misnExtupdateComments)
        // Assign to staticModalData
        Object.assign(staticModalData[category].request, {
          selectedLinkedCoursesTable: linkedCourses,
          visitPurposeTable: visitPurposeTable,
          selectedLinkedDepartmentsTable: selectedLinkedDepartmentsTable,
          frm_date: data.msnReq.fromMsnHospDate ? moment(data.msnReq.fromMsnHospDate).format('DD-MM-YYYY') : '',
          to_date: data.msnReq.toMsnHospDate ? moment(data.msnReq.toMsnHospDate).format('DD-MM-YYYY') : '',
          chatTable: chatTable,
          reqId: data.msnReq._id
        });
        const { type, request } = staticModalData[category];
        const requestSections = [
          { label: 'Request for Specialization: ', icon: 'fa-clipboard', id: 'specialization_name', value: request.specialization, hide: type === 'msnReq' },
          { label: 'Request Status: ', icon: 'fa-clipboard', id: 'req_status', value: request.reqStatus, fullWidth: type === 'msnReq' },
          { label: 'Request Type: ', icon: 'fa-user-doctor', id: 'req_type', value: request.reqType, fullWidth: type === 'msnReq' },
          { label: 'Mission Status: ', icon: 'fa-clipboard', id: 'status', value: request.msqStatus, fullWidth: type === 'msnReq' },
          { label: 'Linked Courses: ', icon: 'fa-graduation-cap', id: 'link_course', value: request.selectedLinkedCoursesTable, isList: true, fullWidth: type === 'msnReq' },
          { label: 'Linked Departments: ', icon: 'fa-building-user', id: 'link_dep', value: request.selectedLinkedDepartmentsTable, isList: true, fullWidth: type === 'msnReq' },
          { label: 'Visit Purpose: ', icon: 'fa-eye', id: 'visit_purpose', value: request.visitPurposeTable, isList: true, fullWidth: type === 'msnReq' }
        ];
        requestTable = requestSections.map(section => `
  <div class="col-12 ${section.fullWidth ? '' : 'col-md-6'} ${section.hide ? 'd-none' : ''} mb-3">
    <div class="px-3 py-2 h-100">
      <div class="d-flex align-items-start">
        <i class="fa-solid ${section.icon} me-3 mt-1 fs-5"></i>
        <div class="flex-grow-1">
          <div class="fw-semibold text-dark">${section.label}</div>
          <div class="mt-1">
            ${section.isList
            ? `<ul class="mb-0 ps-4 text-success" id="${section.id}">${section.value}</ul>`
            : `<span id="${section.id}" class="text-success">${section.value}</span>`}
          </div>
        </div>
      </div>
    </div>
  </div>
`).join('') + `

  <div class="col-12 ${type === 'msnReq' ? '' : 'col-md-6'} mb-3">
    <div class="px-3 py-2 h-100">
      <div class="d-flex align-items-start mb-2">
        <i class="fa-solid fa-calendar-days me-3 mt-1 fs-5"></i>
        <div class="fw-semibold text-dark">Mission Request</div>
      </div>
      <div class="ms-4 mb-1">
        <i class="fa-solid fa-calendar-plus me-2 text-primary"></i>
        <span class="text-dark">Valid from:</span> 
        <span id="frm_date" class="text-success">${request.frm_date}</span>
      </div>
      <div class="ms-4">
        <i class="fa-solid fa-calendar-xmark me-2 text-danger"></i>
        <span class="text-dark">Upto:</span> 
        <span id="to_date" class="text-success">${request.to_date}</span>
      </div>
    </div>
  </div>
`;


        staticModalData[category].request.tableData = requestTable;
      }
      if (category === "gallery") {
        console.log(identifier, missionHospitalImages)
        staticModalData[category].imageTable = carouselImage(identifier, missionHospitalImages)
      }
      if (category === 'avatarCard') {
        staticModalData['avatarCard'].renderedCard = `${data.avatarCard}`
      }
      content = staticModalData[category];
    } else {
      throw new Error(`Category "${category}" not found in collections or staticModalData`);
    }

    const dataToRender = {
      category: category || '',
      content: content || {},
    };
    return new Promise((resolve, reject) => {
      var modalElement = document.getElementById('modal-content');
      modalElement.classList.remove('d-none');
      var templateName = 'modal';

      if (window.precompiledTemplates && typeof window.precompiledTemplates[templateName] === 'function') {
        var templateFunction = window.precompiledTemplates[templateName];
        try {
          console.log('datatorender', dataToRender)
          var renderedHtml = templateFunction(dataToRender);
          modalElement.innerHTML = renderedHtml;
          resolve(true);
        } catch (e) {
          console.error('Error rendering modal template:', e);
          reject(e);
        }
      } else {
        console.error('Modal template not found or not a function:', templateName);
        reject(new Error('Modal template not found or not a function'));
      }
    });
  } catch (e) {
    console.error('Error parsing JSON from data-item:', e);
  }
}

function closeModal() {
  return new Promise((resolve) => {
    var modalElement = document.getElementById('modal-content');
    if (modalElement) {
      modalElement.classList.add('d-none');
      modalElement.innerHTML = '';
      resolve(true);
    } else {
      console.error('Modal element not found');
      resolve(false); // Resolve with false if the modal element was not found
    }
  });
}