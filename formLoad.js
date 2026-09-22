function formLoadMeeting(form, data) {
    Formio.createForm(document.getElementById('logMeeting'), form)
        .then(function (form) {
            form.ready.then(() => { });
            form.on('change', async function (fm) { });
            form.on('submit', function (submitForm) {
                const userLogInfo = usrDetails.data;
                var logMeetData = submitForm.data;
                logMeetData.Date = new Date();
                logMeetData.addedBy = (userLogInfo) ? userLogInfo.profile.name : '';
                logMeetData.addedById = (userLogInfo) ? userLogInfo._id : '';
                logMeetData.isDeleted = false;
                logMeetData.mentor = {};
                logMeetData.mentor.mentorId = data.mentorId;
                logMeetData.mentor.mentorUserId = data.mentorUserId;
                logMeetData.mentor.mentorUserName = data.mentorUserName;
                logMeetData.mentor.mentorUserEmail = data.mentorUserEmail || '';
                logMeetData.mentor.organization = data.organization || '';

                logMeetData.mentee = {};
                logMeetData.mentee.menteeId = data.menteeId;
                logMeetData.mentee.menteeUserId = data.menteeUserId;
                logMeetData.mentee.menteeUserName = data.menteeUserName;
                logMeetData.mentee.course = data.course || '';
                logMeetData.mentee.batch = data.batch || '';
                logMeetData.mentee.menteeUserEmail = data.menteeUserEmail || '';
                logMeetData.mentee.college = data.college || '';

                var fetchQuery = { "collection": "MissionsMentorshipMeetings", "query": logMeetData };
                fetchCollectionData('insertCollectionData', fetchQuery)
                    .then(resp => {
                        console.log(resp)
                        $('#formTableallMeetings').DataTable().ajax.reload();
                        closeModal()
                    })
                form.components.forEach(function (component) {
                    component.setValue('');
                })
            });
        });
}
function datatablesMsnLoad(context) {
    $.fn.dataTable.ext.errMode = 'none';
    let selectedStatuses = [];
    $(document).ready(function () {
        // Register custom sorting for ISO date format
        $.fn.dataTable.ext.type.order['iso-date-pre'] = function (date) {
            return date ? new Date(date).getTime() : 0; // Convert to timestamp
        };
        egDataTable = $('#viewMissionTable').DataTable({
            data: context.missionRequests,
            order: [[3, 'desc']],
            paging: true,
            searching: true,

            dom: "<'row'<'col-sm-12 col-md-4'l><'col-sm-12 col-md-4'><'col-sm-12 col-md-4'f>>" +
                "<'row'<'col-sm-12'tr>>" +
                "<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>",
            columns: [
                {
                    data: null,
                    title: "Mission Hospital Name",
                    render: function (data, type, row) {
                        let matchedHospital = context.msnHosps.find(msn => msn._id === data["missionHospitalId"]);
                        row.matchedHospitalName = matchedHospital ? matchedHospital.missionHospitalName : ''; // Set a default if not found
                        return row.matchedHospitalName;
                    }
                },
                {
                    data: null,
                    title: "Department Name",
                    render: function (data, type, row) {
                        const departments = data.selectedLinkedDepartments || [];
                        const deptList = departments.map(dep => `<div>${dep.name}</div>`).join('');
                        return `
                            <div style="
                                max-height: 60px;
                                overflow-y: auto;
                                padding-right: 5px;
                            ">
                                ${deptList}
                            </div>
                        `;
                    }
                },

                {
                    data: null,
                    title: "Specialization Name",
                    render: function (data, type, row) {
                        let matchedSpecialization = context.msnSpecs.find(msn => msn._id === data["specializationId"]);
                        row.specializationName = matchedSpecialization ? matchedSpecialization.name : ''; // Set a default if not found
                        return row.specializationName;
                    }
                },
                {
                    data: "fromMsnHospDate",
                    title: "From Date",
                    className: "col-md-1",
                    type: "iso-date",
                    render: function (data, type, row) {
                        return data && type !== 'sort' ? moment(data).format("DD-MM-YYYY") : data;
                    }
                },
                {
                    data: "toMsnHospDate",
                    title: "To Date",
                    className: "col-md-1",
                    type: "iso-date",
                    render: function (data, type, row) {
                        return data && type !== 'sort' ? moment(data).format("DD-MM-YYYY") : data;
                    }
                },
                {
                    data: null,
                    title: "View Details",
                    render: function (data, type, row, meta) {
                        return `<button class="btn btn-warning reqDetailModal" id="${data._id}" data-hosp="${row.matchedHospitalName}" data-spec="${row.specializationName}">Details</button>`;
                    }
                }
            ]
        });

        $('#viewMissionTable').on('click', '.reqDetailModal', async (e) => {
            const missionId = e.target.id;
            const hospitalName = e.target.getAttribute("data-hosp");
            const specializationName = e.target.getAttribute("data-spec");

            var collections = [
                { "collection": "MissionRequests", "query": { "_id": missionId, "isDeleted": "false" } }
            ];

            await fetchedDataAPI('fetchCollectionData', collections)
                .then(fetchedData => {
                    const data = {
                        msnSpec: specializationName,
                        msnHosp: hospitalName,
                        msnReq: fetchedData['MissionRequests'].data[0]
                    };
                    openModal('manpowerRequest', '', data);
                });
        });
        $.fn.dataTable.ext.search = $.fn.dataTable.ext.search.filter(fn => fn.name !== "statusFilter");
        $.fn.dataTable.ext.search.push(function statusFilter(settings, data, dataIndex) {
            if (settings.nTable.id !== 'viewMissionTable') return true;
            const row = egDataTable.row(dataIndex).data();
            const rowStatus = row.missionStatus?.toLowerCase().replace(/\s+/g, '');
            return selectedStatuses.length === 0 || selectedStatuses.includes(rowStatus);
        });

        $(document).on('click', '.status-filter-btn', function () {
            let clickedStatus = $(this).data('status').toLowerCase().replace(/\s+/g, '');
            clickedStatus = clickedStatus === 'submitted' ? 'open' : clickedStatus;
            console.log("clickedStatus", clickedStatus);
            const index = selectedStatuses.indexOf(clickedStatus);
            if (index > -1) {
                selectedStatuses.splice(index, 1);
                $(this).removeClass('bg-body-secondary');
            } else {
                selectedStatuses.push(clickedStatus);
                $(this).addClass('bg-body-secondary');
            }
            egDataTable.draw();
        });

        $('#clearStatusFilters').on('click', function () {
            selectedStatuses = [];
            $('.status-filter-btn').removeClass('bg-body-secondary');
            egDataTable.draw();
        });
    });
    // update status counters
    setTimeout(() => {
        const data = egDataTable.rows().data().toArray();
        let open = 0, inProgress = 0;

        data.forEach(row => {
            const status = row.missionStatus?.toLowerCase().replace(/\s+/g, '');
            if (status === 'open') open++;
            else if (status === 'inprogress') inProgress++;
        });

        $('#manpowerStatus1').html(open);
        $('#manpowerStatus2').html(inProgress);
    }, 100);

}

function datatablesMsqLoad(context) {
    // console.log("context.msnReqests",context);
    $.fn.dataTable.ext.errMode = 'none';
    $.fn.dataTable.ext.type.order['iso-date-pre'] = function (date) {
        return date ? new Date(date).getTime() : 0;
    };
    egDataTable = $('#msnReqTable').DataTable({
        data: context.msnReqests,
        order: [[1, 'desc']],
        dom: "<'row'<'col-sm-12 col-md-4'l><'col-sm-12 col-md-4'B><'col-sm-12 col-md-4'f>>" +
            "<'row'<'col-sm-12'tr>>" +
            "<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>",
        buttons: [{
            "className": 'btn btn-warning',
            "text": 'Add',
            action: async function (e, dt, node, config) {
                openModal('formIO', '', `Add a mission request to ${context.missionHospital}`)
                // const msnHosp = [{ label: context.missionHospital, value: context.msnHosp._id }];
                // const missionsSpecializations = context['specialization'].map(specialization => ({
                //     label: specialization.name,
                //     value: specialization._id
                // }));

                Formio.createForm(document.getElementById('missionsFormIOAdd'), context['formIO'])
                    .then(function (form) {
                        form.ready.then(() => {

                            form.getComponent('missionHospitalId').component.valueProperty = '_id';
                            form.getComponent('missionHospitalId').setValue(context.msnHosp._id);
                            form.getComponent('missionHospitalId').disabled = true;
                            //form.getComponent('missionHospitalId').setValue({ label: context.missionHospital, value: context.msnHosp._id });
                            // const msnHospId = form.getComponent('missionHospitalId');
                            // if (msnHospId && msnHosp && msnHosp[0].value) {
                            //     msnHospId.component.data.values = msnHosp;
                            //     msnHospId.setValue(msnHosp[0].value);
                            // }
                            // const msnSpecId = form.getComponent('specializationId');
                            // if (msnSpecId && missionsSpecializations.length > 0) {
                            //     msnSpecId.component.data.values = missionsSpecializations;
                            // }
                            console.log("form ready");
                        });
                        var lnkDepts, lnkCrs;
                        form.on('change', async function (event) {
                            if (event.changed?.component?.key === 'specializationId' && event.data.specializationId) {
                                console.log("form change happening")
                                const specId = form.getComponent('specializationId').getValue();
                                const msnLnkDept = form.getComponent('selectedLinkedDepartments');
                                const msnLnkCrs = form.getComponent('selectedLinkedCourses');
                                if (specId) {
                                    var fetchQuery = { "collection": "MissionSpecializations", "query": { _id: specId._id, isDeleted: 'false' }, projection: { _id: 1, linkedDepartments: 1, linkedCourses: 1 } };
                                    const msnSpl = await fetchCollectionData('fetchCollectionData', fetchQuery);
                                    // console.log("msnSpl",msnSpl.data[0]);
                                    const data = msnSpl.data;
                                    if (data[0].linkedDepartments && data[0].linkedDepartments.length > 0 && data[0].linkedCourses && data[0].linkedCourses.length > 0) {
                                        const convertedLinkedDepartments = data[0].linkedDepartments.map(ldp => ({
                                            label: ldp.name,
                                            value: ldp._id
                                        }));
                                        const convertedLinkedCourses = data[0].linkedCourses.map(lc => ({
                                            label: lc.name,
                                            value: lc._id
                                        }));
                                        lnkDepts = data[0].linkedDepartments;
                                        lnkCrs = data[0].linkedCourses;
                                        if (msnLnkDept && data[0].linkedDepartments.length > 0) {
                                            msnLnkDept.component.values = convertedLinkedDepartments;
                                            const allDeptIds = convertedLinkedDepartments.map(item => item.value);
                                            msnLnkDept.setValue(allDeptIds);
                                            msnLnkDept.redraw();
                                        }
                                        if (msnLnkCrs && data[0].linkedCourses.length > 0) {
                                            msnLnkCrs.component.values = convertedLinkedCourses;
                                            const allCourseIds = convertedLinkedCourses.map(item => item.value);
                                            msnLnkCrs.setValue(allCourseIds);
                                            msnLnkCrs.redraw();
                                        }
                                        // await fetchCollectionData('fetchCollectionData', fetchQuery)
                                        //     .then(resp => {
                                        //         const data = resp;

                                        //         if (data[0].linkedDepartments && data[0].linkedDepartments.length > 0 && data[0].linkedCourses && data[0].linkedCourses.length > 0) {
                                        //             const convertedLinkedDepartments = data[0].linkedDepartments.map(ldp => ({
                                        //                 label: ldp.name,
                                        //                 value: ldp._id
                                        //             }));
                                        //             const convertedLinkedCourses = data[0].linkedCourses.map(lc => ({
                                        //                 label: lc.name,
                                        //                 value: lc._id
                                        //             }));
                                        //             lnkDepts = data[0].linkedDepartments;
                                        //             lnkCrs = data[0].linkedCourses;

                                        //             if (msnLnkDept && data[0].linkedDepartments.length > 0) {
                                        //                 msnLnkDept.component.values = convertedLinkedDepartments;
                                        //                 msnLnkDept.redraw();
                                        //             }
                                        //             if (msnLnkCrs && data[0].linkedCourses.length > 0) {
                                        //                 msnLnkCrs.component.values = convertedLinkedCourses;
                                        //                 msnLnkCrs.redraw();
                                        //             }

                                        //         }
                                        //     }).catch(err => { console.log('Error: ', err); })
                                    }
                                }
                            }
                        });

                        form.on('submit', function (submitForm) {
                            var userLogInfo = usrDetails;
                            var saveButton = form.getComponent('submit');
                            if (saveButton) {
                                saveButton.loading = false; // Set loading state
                                saveButton.element.querySelector('button').removeAttribute('disable');
                            }
                            var fnlData = submitForm.data;
                            fnlData.Date = new Date();
                            fnlData.addedBy = (userLogInfo) ? userLogInfo.data.profile.name : '';
                            fnlData.addedById = (userLogInfo) ? userLogInfo.data._id : '';
                            fnlData.isDeleted = 'false';
                            fnlData.requestType = 'ManPower';
                            fnlData.missionStatus = 'Open';
                            fnlData.misnExtupdateComments = [];
                            const visitPurposeArray = Object.keys(fnlData.visitPurpose).filter(purpose => fnlData.visitPurpose[purpose]);
                            fnlData.visitPurpose = visitPurposeArray.length > 0 ? visitPurposeArray : [];
                            const trueDepartmentKeys = Object.keys(fnlData.selectedLinkedDepartments).filter(departmentId => fnlData.selectedLinkedDepartments[departmentId]);

                            const selectedDepartmentsArray = trueDepartmentKeys.map(departmentId => {
                                return lnkDepts.find(department => department._id === departmentId);
                            });
                            fnlData.selectedLinkedDepartments = selectedDepartmentsArray;
                            const trueCourseKeys = Object.keys(fnlData.selectedLinkedCourses).filter(courseId => fnlData.selectedLinkedCourses[courseId]);
                            const selectedCoursesArray = trueCourseKeys.map(courseId => {
                                return lnkCrs.find(course => course._id === courseId);
                            });
                            fnlData.selectedLinkedCourses = selectedCoursesArray;
                            fnlData.specializationId = fnlData.specializationId ? fnlData.specializationId._id : '';
                            //console.log("fnlData", fnlData);
                            var fetchQuery = { "collection": "MissionRequests", "query": fnlData };
                            fetchCollectionData('insertCollectionData', fetchQuery)
                                .then(async (resp) => {
                                    // console.log("resp",resp);
                                    var msnReqcollections = [
                                        { "collection": "MissionRequests", "query": { missionHospitalId: context.msnHosp._id, isDeleted: 'false' }, "projection": { _id: 1, missionHospitalId: 1, specializationId: 1, missionStatus: 1, requestStatus: 1, requestType: 1, fromMsnHospDate: 1, toMsnHospDate: 1, misnExtupdateComments: 1 } },
                                    ]
                                    const loadMsqData = await fetchedDataAPI('fetchCollectionData', msnReqcollections);
                                    context.msnReqests = loadMsqData['MissionRequests'].data;
                                    //datatablesMsqLoad(context);
                                    //console.log("calling the new msn req data",loadMsqData['MissionRequests'].data);
                                    closeModal()
                                    $('#msnReqTable').DataTable().clear().rows.add(context.msnReqests).draw()
                                })
                            form.components.forEach(function (component) {
                                component.setValue('');
                            })
                        })
                    })
            }
        }],
        columnDefs: [
            { type: 'datetime-moment', targets: [1, 2] } // Assuming date columns are the first and second columns
        ],
        columns: [
            {
                data: "specializationId",
                title: "Specialization Name",
                render: function (data, type, row) {
                    let matchedSpecialization = context.specialization.find(msn => msn._id === data);
                    row.specializationName = matchedSpecialization ? matchedSpecialization.name : '';
                    return row.specializationName;
                }
            },
            {
                data: "fromMsnHospDate",
                title: "From Date",
                type: "iso-date",
                render: function (data, type, row) {
                    return data && type !== 'sort' ? moment(data).format("DD-MM-YYYY") : data;
                }
            },
            {
                data: "toMsnHospDate",
                title: "To Date",
                type: "iso-date",
                render: function (data, type, row) {
                    return data && type !== 'sort' ? moment(data).format("DD-MM-YYYY") : data;
                }
            },
            { data: "missionStatus", title: "missionStatus" },
            {
                data: null, title: "Chat", render: function (data, type, row, meta) {
                    // var icon = newNotification ? '<i class="fa-solid fa-envelope fs-5 text-danger"></i>' : '';
                    var icon = ``;
                    return '<button class="btn btn-warning chatCheck" id="' + data._id + '"  data-attr="' + row.specializationName + '">Chat</button> <sup>' + icon + '</sup>';
                }
            },
        ]
    });
    $('#msnReqTable').on('click', '.chatCheck', async (e) => {
        var collections = [
            { "collection": "MissionRequests", "query": { "_id": e.target.id, "isDeleted": "false" } }
        ]
        await fetchedDataAPI('fetchCollectionData', collections)
            .then(fetchedData => {
                let missionSpecialization = $(e.target).data('attr');
                data = { missionSpecialization, msnReq: fetchedData['MissionRequests'].data[0] }
                openModal('missionRequest', '', data)
                console.log('missionRequest', data)
            })
    })

}
async function datatablesMyMeetings(region, tQuery, userName) {
    $.fn.dataTable.ext.errMode = 'none';

    egDataTable = $(region).DataTable({
        ajax: function (data, callback, settings) {
            (async () => {
                let fetchQuery = {
                    collection: "MissionsMentorshipMeetings",
                    query: tQuery,
                    projection: { _id: 1, meetingComment: 1, meetingDateTime: 1, [userName]: 1 }
                };

                const meetingData = await fetchCollectionData('fetchCollectionData', fetchQuery);
                callback({ data: meetingData.data });
            })();
        },
        dom: "<'row'<'col-sm-6 col-md-4'f>>" +
            "<'row'<'col-sm-12 col-md-12 'tr>>",
        columnDefs: [
            { type: 'datetime-moment', targets: [1] }
        ],
        columns: [
            {
                data: userName,
                title: userName === "addedBy" ? "Added By" : "Meet",
            },
            {
                data: "meetingDateTime",
                title: "Meeting Date",
                render: function (data) {
                    return moment(data).format('DD-MM-YYYY hh:mm a');
                }
            },
            {
                data: "meetingComment",
                title: "Meeting Comment",
                render: function (data) {
                    return data || '-';
                }
            },
            {
                data: null,
                title: "Actions",
                className: "col-md-2-5",
                render: function (data, type, row) {
                    return `<button class="btn btn-sm btn-warning edit-btn" data-id="${row._id}" title="Edit"><i class="fas fa-edit"></i></button>
                            <button class="btn btn-sm btn-danger delete-btn" data-id="${row._id}" title="Delete"><i class="fas fa-trash"></i></button>`;
                }
            }
        ]
    });

    // Remove existing event listeners to prevent multiple triggers
    $(region).off('click', '.edit-btn');
    $(region).off('click', '.delete-btn');

    $(region).on('click', '.edit-btn', function () {
        const rowId = $(this).data('id');
        openModal('formIO', null, 'Edit Meeting');
        loadMeetingForm(rowId);
    });

    $(region).on('click', '.delete-btn', async function () {
        const rowId = $(this).data('id');

        if (confirm("Are you sure you want to delete this record?")) {
            const deleteQuery = {
                collection: "MissionsMentorshipMeetings",
                query: {
                    selector: { _id: rowId },
                    data: { $set: { isDeleted: true } }
                }
            };

            try {
                const resp = await fetchCollectionData('updateCollectionData', deleteQuery);
                //console.log('Deleted Meeting record', resp);
                $('#formTableallMeetings').DataTable().ajax.reload();
                $('#mymeetings').DataTable().ajax.reload();

            } catch (error) {
                console.error('Error deleting record:', error);
            }
        }
    });
}

async function loadMeetingForm(id = null) {
    console.log("loadMeetingForm", id);
    const meetingFormData = { collection: "FormIO", query: { formKey: "mentorshipMeeting" } };
    const meetingForm = await fetchCollectionData('fetchCollectionData', meetingFormData);
    Formio.createForm(document.getElementById('genFormIO'), meetingForm.data[0], { hide: { style: true, meetingComment1: true } })
        .then(function (form) {
            form.ready.then(async () => {
                if (id) {
                    const res = await fetchCollectionData('fetchCollectionData', { collection: "MissionsMentorshipMeetings", query: { _id: id } });
                    form.submission = { data: res.data[0] };;
                    //console.log(res, "Meeting form ready");
                }
            });
            form.on('change', async function (fm) { });

            form.on('submit', function (submitForm) {
                const userLogInfo = usrDetails.data;
                const saveButton = form.getComponent('submit');
                if (saveButton) {

                    saveButton.loading = false;
                    saveButton.element.querySelector('button').removeAttribute('disable');
                }
                let fnlData = submitForm.data;
                const userId = userLogInfo?.data?._id || '';
                const username = userLogInfo?.data?.profile?.name || '';
                fnlData.isDeleted = false;
                if (id) {
                    fnlData.modified = {
                        userName: username,
                        userId: userId,
                        modifiedDate: new Date()
                    };
                    const fetchQuery = { collection: "MissionsMentorshipMeetings", query: { selector: { _id: id }, data: { $set: fnlData } } };
                    fetchCollectionData('updateCollectionData', fetchQuery)
                        .then(resp => {
                            //console.log('Updated Meeting record', resp);
                            $('#formTableallMeetings').DataTable().ajax.reload();
                            closeModal();
                        })
                        .catch(error => console.error('Error updating record:', error));
                }
                form.components.forEach(function (component) {
                    component.setValue('');
                })
            });
        });
}


async function loadLegalHelpDataTable(hospIds) {

    //console.log("hospIds", hospIds);
    $.fn.dataTable.ext.errMode = 'none';
    $.fn.dataTable.ext.type.order['iso-date-pre'] = function (date) {
        return date ? new Date(date).getTime() : 0; // Convert to timestamp
    };

    const columns = [
        { data: "added.userName", title: "Added by" },
        {
            data: "added.addedDate",
            title: "Added Date",
            type: "iso-date",
            render: function (data, type, row) {
                return data && type !== 'sort' ? moment(data).format("DD-MM-YYYY") : data;
            }
        },
        { data: "status", title: "Status", name: "Status" },
        {
            data: null,
            title: "Response",
            render: function (data, type, row) {
                if (row.status === 'completed') {
                    if (data.responseFromLegalTeam || (data.supportingDocuments && data.supportingDocuments.length > 0)) {
                        return `<button class="btn btn-sm btn-success legal-response-btn" data-id="${row._id}" title="Response"><i class="fas fa-file"></i></button> `;
                    }
                }
            }
        },
        {
            data: null,
            title: "Actions",
            render: function (data, type, row) {
                if (row.status === 'submitted') {
                    return `<div class="d-flex gap-1">
                                <button class="btn btn-sm btn-warning legal-edit-btn" data-id="${row._id}" title="Edit"><i class="fas fa-edit text-white"></i></button>
                                <button class="btn btn-sm btn-danger legal-delete-btn" data-id="${row._id}" title="Delete"><i class="fas fa-trash"></i></button>
                            </div>`;
                } else if (row.status === 'inProgress' || row.status === 'completed') {
                    return `<button class="btn btn-sm btn-info legal-preview-btn" data-id="${row._id}" title="Preview"><i class="fas fa-binoculars text-white"></i></button>`;
                }
            }
        }
    ];

    if (!hospIds) {
        columns.splice(1, 0, {
            data: "missionHospital.missionHospitalName",
            title: "Hospital Name",
            className: "col-md-4",
        });
    }

    $(document).ready(function () {
        let legalHelpTable = $('#missionLegalHelp').DataTable({
            ajax: function (data, callback, settings) {
                (async () => {
                    let query = { isDeleted: false };

                    if (!hospIds || hospIds.length === 0) {
                        query["added.userId"] = usrDetails.data._id;
                    }

                    const dataN = await fetchCollectionData('fetchCollectionData', {
                        collection: "LegalHelp",
                        query: query
                    });
                    //console.log("dataN", dataN);

                    let rows = dataN.data || [];

                    // If hospIds are passed, filter by hospital IDs
                    if (hospIds && hospIds.length > 0) {
                        rows = rows.filter(item => item?.missionHospital?._id && hospIds.includes(item.missionHospital._id));
                    }
                    callback({ data: rows });
                })();
            },
            order: [[2, 'desc']],
            dom: "<'row'<'col-sm-12 col-md-4'l><'col-sm-12 col-md-4'B><'col-sm-12 col-md-4'f>>" +
                "<'row'<'col-sm-12'tr>>" +
                "<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>",
            columnDefs: [{ type: 'datetime-moment', targets: [1, 2] }],
            buttons: [{
                className: 'btn btn-warning',
                text: 'Add',
                action: async function () {
                    openModal('formIO', null, 'Add new Legal Help');
                    loadHelpForm({
                        formKey: "legalAssistance",
                        collectionName: "LegalHelp",
                        hospIds: hospIds,
                        hiddenFields: ["style", "responseFromLegalTeam1", "confirmationFromLegalResponse"],
                        tableId: "missionLegalHelp"
                    });

                }
            }],
            columns: columns
        });

        $(document).on('click', '.legal-edit-btn', function () {
            const rowId = $(this).data('id');
            openModal('formIO', null, 'Edit Legal Help');
            loadHelpForm({
                formKey: "legalAssistance",
                collectionName: "LegalHelp",
                id: rowId,
                hiddenFields: ["style", "responseFromLegalTeam1", "confirmationFromLegalResponse"],
                tableId: "missionLegalHelp"
            });

        });

        $(document).on('click', '.legal-response-btn', function () {
            const rowId = $(this).data('id');
            openModal('formIO', null, 'Confirmation From Legal Response');
            confirmationResponse(rowId, 'legalHelp');
        });

        $(document).on('click', '.legal-delete-btn', function () {
            const rowId = $(this).data('id');

            // Ask for confirmation before deleting
            if (confirm("Are you sure you want to delete this record?")) {
                const deleteQuery = {
                    collection: "LegalHelp",
                    query: {
                        selector: { _id: rowId },
                        data: { $set: { isDeleted: true } }
                    }
                };
                fetchCollectionData('updateCollectionData', deleteQuery)
                    .then(resp => {
                        //console.log('Deleted LegalHelp record', resp);
                        $('#missionLegalHelp').DataTable().ajax.reload();
                    })
                    .catch(error => console.error('Error deleting record:', error));
            }
        });

        $(document).on('click', '.legal-preview-btn', function () {
            const rowId = $(this).data('id');
            openModal('formIO', null, 'Preview Legal Help');
            loadHelpForm({
                formKey: "legalAssistance",
                collectionName: "LegalHelp",
                id: rowId,
                mode: "preview",
                hiddenFields: ["style", "responseFromLegalTeam1", "confirmationFromLegalResponse"],
                tableId: "missionLegalHelp"
            });
        });

        let selectedLegalStatuses = [];

        // Clear any previous filter for status before adding the new one
        $.fn.dataTable.ext.search = $.fn.dataTable.ext.search.filter(fn => fn.name !== "legalStatusFilter");
        $.fn.dataTable.ext.search.push(function legalStatusFilter(settings, data, dataIndex) {

            if (settings.nTable.id !== 'missionLegalHelp') return true;
            const statusIndex = legalHelpTable.column('Status:name').index();
            //console.log("statusIndex", statusIndex);
            if (statusIndex === -1) return true;

            const rowStatus = (data[statusIndex] || '').toLowerCase().replace(/\s+/g, '');
            //console.log("rowStatus", rowStatus);
            if (selectedLegalStatuses.length === 0) return true;

            return selectedLegalStatuses.includes(rowStatus);
        });

        $(document).on('click', '.status-filter-btn', function () {
            const clickedStatus = $(this).data('status').toLowerCase().replace(/\s+/g, '');
            const index = selectedLegalStatuses.indexOf(clickedStatus);

            if (index > -1) {
                selectedLegalStatuses.splice(index, 1);
                $(this).removeClass('bg-body-secondary');
            } else {
                selectedLegalStatuses.push(clickedStatus);
                $(this).addClass('bg-body-secondary');
            }

            legalHelpTable.draw();
        });


        $('#clearStatusFilters').on('click', function () {
            selectedLegalStatuses = []; // Clear selected statuses
            $('.status-filter-btn').removeClass('bg-body-secondary');
            legalHelpTable.draw();
        });


        $('#missionLegalHelp').on('xhr.dt', function (e, settings, json) {
            const data = json.data;
            let submitted = 0, inProgress = 0, completed = 0;

            data.forEach(row => {
                const status = row.status?.toLowerCase();
                if (status === 'submitted') submitted++;
                else if (status === 'inprogress') inProgress++;
                else if (status === 'completed') completed++;
            });

            $('#legalHelpStatus1').html(submitted);
            $('#legalHelpStatus2').html(inProgress);
            $('#legalHelpStatus3').html(completed);
        });

    });

}

// async function processUploadDocuments(documents = [], id, type = "document") {
//     return Promise.all(documents.map(async (doc, index) => {
//         const fileIndex = index + 1; // Start from 1 instead of 0
//         if (doc.url?.includes(',')) {
//             const base64String = doc.url.split(',')[1];
//             const extension = doc.name.split('.').pop();
//             const filenamePrefix = type === "supporting" ? "supportingdocuments" : "documents";
//             const s3Url = await uploadToS3(base64String, `LegalHelp/${filenamePrefix}/${id}_${fileIndex}.${extension}`);
//             if (s3Url) doc.url = s3Url;
//         }
//         return doc;
//     }));
// }

async function confirmationResponse(id, form = null) {
    let res;
    let response;
    if (form === 'legalHelp') {
        res = await fetchCollectionData('fetchCollectionData', { collection: "LegalHelp", query: { _id: id, isDeleted: false }, projection: { responseFromLegalTeam: 1, supportingDocuments: 1 } });
        response = res.data[0]?.responseFromLegalTeam || '';
    }
    else if (form === 'financeHelp') {
        res = await fetchCollectionData('fetchCollectionData', { collection: "FinancialHelp", query: { _id: id, isDeleted: false }, projection: { responseFromFinanceTeam1: 1, supportingDocuments: 1 } });
        response = res.data[0]?.responseFromFinanceTeam1 || '';
    }
    console.log("Confirmation Response ready");
    const colldata = res.data[0];

    document.getElementById('fileStatus').innerHTML = `
  <h5>Response From ${form === 'legalHelp' ? 'Legal' : 'Finance'} Team : &nbsp;
  <span style="font-size: 0.9em; font-weight: normal;">
    ${response}
  </span>
  </h5>
`;
    // Handle supporting documents
    const files = colldata.supportingDocuments || [];

    if (files.length > 0) {
        let html = '<h5>Download Supporting Documents:</h5><ul>';
        files.forEach((file, index) => {
            const buttonId = `downloadFile${index}`;
            html += `
  <li style="display: flex; align-items: center; max-width: 300px; margin-bottom: 5px;">
    <span style="margin-right: 8px;">•</span>
    <span style="flex: 1;">${file.originalName}</span>
    <button id="${buttonId}" class="btn btn-success btn-sm">Download</button>
  </li>
`;
            // Add the click handler for each button
            setTimeout(() => {
                const btn = document.getElementById(buttonId);
                if (btn) {
                    btn.addEventListener("click", async () => {
                        try {
                            const response = await fetch(file.url);
                            const blob = await response.blob();
                            const link = document.createElement('a');
                            link.href = URL.createObjectURL(blob);
                            link.download = file.originalName;
                            link.click();
                            URL.revokeObjectURL(link.href);
                        } catch (error) {
                            console.error("Download failed", error);
                            alert("Failed to download file.");
                        }
                    });
                }
            }, 100);
        });
        html += '</ul>';
        document.getElementById('downloadLinks').innerHTML = html;
    }
}

function disableAllComponents(components) {
    components.forEach(component => {
        if (component.type !== 'button') {
            component.disabled = true;
        }
        if (component.components && component.components.length > 0) {
            disableAllComponents(component.components);
        }
    });
}

function clearGlobalFilters() {
    $.fn.dataTable.ext.search = $.fn.dataTable.ext.search.filter(function (fn) {
        return fn.name !== "statusFilter";
    });
}


// async function loadLegalHelpForm(id = null, hospIds, mode) {

//     const legalFormData = { collection: "FormIO", query: { formKey: "legalAssistance" } };
//     const legalForm = await fetchCollectionData('fetchCollectionData', legalFormData);

//     legalForm.data[0].components.forEach((page) => {
//         console.log("buttonsetting")
//         if (page.buttonSettings) {
//             page.buttonSettings.cancel = false; // Remove cancel button entirely
//         }
//         if (mode === 'preview') {
//             page.buttonSettings.submit = false; // Disable buttons in preview mode
//         }
//     });

//     Formio.createForm(document.getElementById('genFormIO'), legalForm.data[0], { hide: { style: true, responseFromLegalTeam1: true, confirmationFromLegalResponse: true } })
//         .then(function (form) {
//             form.ready.then(async () => {
//                 const username = usrDetails?.data?.profile?.name || '';
//                 form.getComponent('name')?.setValue(username);
//                 if (hospIds) {
//                     form.getComponent('missionHospital').component.valueProperty = '_id';
//                     form.getComponent('missionHospital').setValue(hospIds);
//                     form.getComponent('missionHospital').disabled = true;
//                 }

//                 if (id) {
//                     const res = await fetchCollectionData('fetchCollectionData', {
//                         collection: "LegalHelp",
//                         query: { _id: id, isDeleted: false }
//                     });

//                     if (res.data && res.data[0]) {
//                         form.submission = { data: res.data[0] };
//                         form.getComponent('missionHospital').disabled = true;

//                         if (mode === 'preview') {
//                             disableAllComponents(form.components);
//                             form.redraw();
//                         }
//                         console.log(res, "LegalHelp form ready");
//                     }
//                 }

//             });

//             form.on('change', async function (fm) { });
//             form.on('submit', function (submitForm) {
//                 const userLogInfo = usrDetails;
//                 const saveButton = form.getComponent('submit');
//                 if (saveButton) {
//                     saveButton.loading = false;
//                     saveButton.element.querySelector('button').removeAttribute('disable');
//                 }

//                 let fnlData = submitForm.data;
//                 const userId = userLogInfo?.data?._id || '';
//                 const username = userLogInfo?.data?.profile?.name || '';
//                 fnlData.isDeleted = false;

//                 if (id) {
//                     fnlData.modified = {
//                         userName: username,
//                         userId: userId,
//                         modifiedDate: new Date()
//                     };

//                     const updateQuery = {
//                         collection: "LegalHelp",
//                         query: { selector: { _id: id }, data: { $set: fnlData } }
//                     };
//                     fetchCollectionData('updateCollectionData', updateQuery)
//                         .then(resp => {
//                             console.log('Updated LegalHelp record (no docs)', resp);
//                             $('#missionLegalHelp').DataTable().ajax.reload();
//                             closeModal();
//                         });

//                 } else {
//                     fnlData.added = {
//                         userName: username,
//                         userId: userId,
//                         addedDate: new Date()
//                     };
//                     fnlData.status = 'submitted';
//                     if (hospIds) {
//                         const missionHospitalComp = form.getComponent('missionHospital');
//                         const hospValue = missionHospitalComp.getValue();
//                         const selectOptions = missionHospitalComp.selectOptions || [];
//                         let hospLabel = selectOptions.find(opt => opt.value === hospValue)?.label || '';
//                         // Strip any HTML tags from hospital name
//                         hospLabel = hospLabel.replace(/<[^>]*>?/gm, '');

//                         fnlData.missionHospital = {
//                             _id: hospValue,
//                             missionHospitalName: hospLabel
//                         };
//                     }

//                     // Insert new document
//                     let insertQuery = { collection: "LegalHelp", query: fnlData };
//                     console.log("insertQuery", insertQuery);
//                     fetchCollectionData('insertCollectionData', insertQuery)
//                     $('#missionLegalHelp').DataTable().ajax.reload();
//                     closeModal();
//                 }

//                 // Reset form fields
//                 form.components.forEach(component => component.setValue(''));
//             });

//         });
// }


async function mentorMenteeEditForm(formQuery, fetchDbQuery, updateDbQuery) {
    const form = await fetchCollectionData('fetchCollectionData', formQuery);
    const dataB = await fetchCollectionData('fetchCollectionData', fetchDbQuery);
    dataBData = dataB.data[0]
    // dataBData=dataB[0];
    Formio.createForm(document.getElementById('genFormIO'), form?.data[0], { "hide": { "style": true, "mentorUserId": true, 'menteeUserId': true } })
        .then((form) => {
            form.ready.then(async () => {

                form.getComponent(['typeOfMentorship']).disabled = true;
                ['spiritualMentees', 'careerCallingMentees', 'othersMentees'].forEach(key => {
                    const comp = form.getComponent(key);
                    if (comp) {
                        comp.component.disabled = true;
                        comp.redraw();
                    }
                });

                if (fetchDbQuery.collection === 'MenteeRole') {
                    var spiritualMentorCollection = { "collection": 'MentorRole', "query": { typeOfMentorship: { $in: ['spiritual'] }, mentorRoleStatus: 'Current' }, "projection": { "_id": 1, "mentorUserName": 1, "mentorUserEmail": 1, "mentorRoleStatus": 1, "typeOfMentorship": 1 } }
                    const spiritualMentor = await fetchCollectionData('fetchCollectionData', spiritualMentorCollection);
                    var ccMentorCollection = { "collection": 'MentorRole', "query": { typeOfMentorship: { $in: ['careerCalling'] }, mentorRoleStatus: 'Current' }, "projection": { "_id": 1, "mentorUserName": 1, "mentorUserEmail": 1, "mentorRoleStatus": 1, "typeOfMentorship": 1 } }
                    const careerCallingMentor = await fetchCollectionData('fetchCollectionData', ccMentorCollection);
                    var othersMentorCollection = { "collection": 'MentorRole', "query": { typeOfMentorship: { $in: ['others'] }, mentorRoleStatus: 'Current' }, "projection": { "_id": 1, "mentorUserName": 1, "mentorUserEmail": 1, "mentorRoleStatus": 1, "typeOfMentorship": 1 } }
                    const othersMentor = await fetchCollectionData('fetchCollectionData', othersMentorCollection);
                    var spiritualMentors = form.getComponent('spiritualMentors');
                    spiritualMentors.component.data.values = spiritualMentor.data;
                    spiritualMentors.component.valueProperty = '_id';
                    var ccMentors = form.getComponent('careerCallingMentors');
                    ccMentors.component.data.values = careerCallingMentor.data;
                    ccMentors.component.valueProperty = '_id';
                    var othersMentors = form.getComponent('othersMentors');
                    othersMentors.component.data.values = othersMentor.data;
                    othersMentors.component.valueProperty = '_id';
                    if (dataBData.hasOwnProperty('spiritualMentors') && dataBData.spiritualMentors.length > 0) {
                        dataBData.spiritualMentors = dataBData.spiritualMentors.map(spiritualMentors => spiritualMentors._id);
                    }
                    if (dataBData.hasOwnProperty('careerCallingMentors') && dataBData.careerCallingMentors.length > 0) {
                        dataBData.careerCallingMentors = dataBData.careerCallingMentors.map(careerCallingMentors => careerCallingMentors._id);
                    }
                    if (dataBData.hasOwnProperty('othersMentors') && dataBData.othersMentors.length > 0) {
                        dataBData.othersMentors = dataBData.othersMentors.map(othersMentors => othersMentors._id);
                    }
                }

                console.log("retrieved data", dataBData)
                form.submission = { data: dataBData } //preload data in form
            });

            form.on('submit', async function (submitForm) {
                var userLogInfo = usrDetails.data;
                var fnlData = submitForm.data;
                if (fetchDbQuery.collection == 'MentorRole') {
                    fnlData.uploadFacultyImage = await Promise.all(fnlData.uploadFacultyImage.map(image => processImage(image, userLogInfo._id, fetchDbQuery.collection)));
                }
                if (fetchDbQuery.collection == 'MenteeRole') {
                    fnlData.uploadStudentImage = await Promise.all(fnlData.uploadStudentImage.map(image => processImage(image, userLogInfo._id, fetchDbQuery.collection)));
                }
                console.log(fnlData.uploadFacultyImage, fnlData.uploadStudentImage);
                const finalData = {
                    ...dataBData, // Retain existing data
                    ...fnlData,      // Override with submitted data
                    modifiedDate: new Date(),
                    modifiedBy: userLogInfo.profile?.name || '',
                    modifiedById: userLogInfo._id || '',
                };
                //console.log("fnlData",finalData);
                if (fetchDbQuery.collection === 'MenteeRole') {
                    var selMentorCollection = { "collection": "MentorRole", "query": { _id: { $in: fnlData.spiritualMentors } }, "projection": { "_id": 1, "mentorUserName": 1, "typeOfMentorship": 1 } }
                    const selSpiritualMentor = await fetchCollectionData('fetchCollectionData', selMentorCollection);
                    finalData['spiritualMentors'] = selSpiritualMentor.data;
                    var selccMentorCollection = { "collection": "MentorRole", "query": { _id: { $in: fnlData.careerCallingMentors } }, "projection": { "_id": 1, "mentorUserName": 1, "typeOfMentorship": 1 } }
                    const selccMentor = await fetchCollectionData('fetchCollectionData', selccMentorCollection);
                    finalData['careerCallingMentors'] = selccMentor.data;
                    var selOthersMentorCollection = { "collection": "MentorRole", "query": { _id: { $in: fnlData.othersMentors } }, "projection": { "_id": 1, "mentorUserName": 1, "typeOfMentorship": 1 } }
                    const selOthersMentor = await fetchCollectionData('fetchCollectionData', selOthersMentorCollection);
                    finalData['othersMentors'] = selOthersMentor.data;
                }
                // console.log("fnlData after",finalData);
                updateDbQuery.query.data = { $set: finalData };
                fetchCollectionData('updateCollectionData', updateDbQuery) //submit data
                    .then(resp => {
                        //console.log('submission response', resp)
                        closeModal()
                    })
                form.components.forEach(function (component) {
                    component.setValue('');
                })
            })
        })
}

async function requestLoginForm() {

    loginReqForm = { collection: "FormIO", query: { formKey: "cmcvconnectLoginApplication" } };
    const reqForm = await fetchCollectionData('fetchCollectionData', loginReqForm);
    Formio.createForm(document.getElementById('genFormIO'), reqForm.data[0], { hide: { style: true, forMissionsOffice: true } })
        .then(function (form) {
            form.ready.then(async () => {
                console.log("form ready");

                form.on('submit', async (submitForm) => {
                    var fnlData = submitForm.data;
                    fnlData.isDeleted = false;
                    fnlData.Date = new Date();
                    fnlData.status = 'inProgress';

                    const insertQuery = { collection: "LoginRequest", query: fnlData };
                    //console.log("fetchQuery", insertQuery);
                    await fetchCollectionData('insertCollectionData', insertQuery);

                    alert("Your request is being processed, you will receive an email after confirmation. Thank you!");

                    closeModal();

                });
            })
        })
}


function loadWeeklyMannaTable() {
    $.fn.dataTable.ext.errMode = 'none';
    $.fn.dataTable.ext.type.order['iso-date-pre'] = function (date) {
        return date ? new Date(date).getTime() : 0; // Convert to timestamp
    };

    $(document).ready(function () {
        $('#weeklyMannaTable').DataTable({
            ajax: function (data, callback, settings) {
                (async () => {
                    const query = { isDeleted: false };
                    const dataN = await fetchCollectionData('fetchCollectionData', { collection: "WeeklyManna", query: query });
                    if (Array.isArray(dataN.data)) {
                        dataN.data.forEach(item => {
                            if (item.devotionalDate) {
                                const dateObj = new Date(item.devotionalDate);
                                const formattedDate = `${dateObj.getDate()} ${dateObj.toLocaleString('en-US', { month: 'long' })} ${dateObj.getFullYear()}`;
                                item.formattedDate = formattedDate; // Update the data object with the formatted date
                            }
                            // Flatten uploadImage
                            if (Array.isArray(item.uploadImage)) {
                                if (item.uploadImage.length === 0) {
                                    delete item.uploadImage;
                                } else {
                                    const firstImage = item.uploadImage[0];
                                    item.uploadImage = (firstImage?.data?.url)
                                        ? { url: firstImage.data.url }
                                        : firstImage; // fallback
                                }
                            }

                        });
                    }
                    callback({ data: dataN.data || [] });
                })();
            },
            order: [[0, 'desc']],
            dom: "<'row'<'col-sm-12 col-md-4'l><'col-sm-12 col-md-4'><'col-sm-12 col-md-4'f>>" +
                "<'row'<'col-sm-12'tr>>" +
                "<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>",
            columns: [
                {
                    data: "devotionalDate",
                    className: "col-md-1",
                    title: "Date",
                    type: "iso-date",
                    render: function (data, type, row) {
                        return data && type !== 'sort' ? moment(data).format("DD-MM-YYYY") : data;
                    }
                },
                { data: "devotionalTitle", title: "Devotional Title" },
                { data: "devotionalKeyVerse", title: "Devotional Key Verse" },
                {
                    data: null,
                    title: "View Details",
                    render: function (data, type, row, meta) {
                        return `<button class="btn btn-warning" onclick='openModal("weeklyManna", "", ${JSON.stringify(data).replace(/'/g, "&apos;")})'>Details</button>`;
                    }
                }
            ]
        });

    });
}



async function loadFinanceDataTable(hospIds) {

    $.fn.dataTable.ext.errMode = 'none';
    $.fn.dataTable.ext.type.order['iso-date-pre'] = function (date) {
        return date ? new Date(date).getTime() : 0;
    };

    const columns = [
        { data: "added.userName", title: "Added by" },
        {
            data: "added.addedDate",
            title: "Added Date",
            type: "iso-date",
            render: function (data, type, row) {
                return data && type !== 'sort' ? moment(data).format("DD-MM-YYYY") : data;
            }
        },
        { data: "status", title: "Status", name: "Status" },
        {
            data: null,
            title: "Response",
            render: function (data, type, row) {
                if (row.status === 'completed') {
                    if (data.responseFromFinanceTeam || (data.supportingDocuments && data.supportingDocuments.length > 0)) {
                        return `<button class="btn btn-sm btn-success finance-response-btn" data-id="${row._id}" title="Response"><i class="fas fa-file"></i></button> `;
                    }
                }
            }
        },
        {
            data: null,
            title: "Actions",
            render: function (data, type, row) {
                if (row.status === 'submitted') {
                    return `<div class="d-flex gap-1">
                                <button class="btn btn-sm btn-warning finance-edit-btn" data-id="${row._id}" title="Edit"><i class="fas fa-edit text-white"></i></button>
                                <button class="btn btn-sm btn-danger finance-delete-btn" data-id="${row._id}" title="Delete"><i class="fas fa-trash"></i></button>
                            </div>`;
                } else if (row.status === 'inProgress' || row.status === 'completed') {
                    return `<button class="btn btn-sm btn-info finance-preview-btn" data-id="${row._id}" title="Preview"><i class="fas fa-binoculars text-white"></i></button>`;
                }
            }
        }
    ];

    if (!hospIds) {
        columns.splice(1, 0, {
            data: "missionHospital.missionHospitalName",
            title: "Hospital Name",
            className: "col-md-4",
        });
    }

    $(document).ready(function () {
        let financeHelpTable = $('#missionFinance').DataTable({
            ajax: function (data, callback, settings) {
                (async () => {
                    let query = { isDeleted: false };

                    if (!hospIds || hospIds.length === 0) {
                        query["added.userId"] = usrDetails.data._id;
                    }
                    const dataN = await fetchCollectionData('fetchCollectionData', {
                        collection: "FinancialHelp",
                        query: query
                    });
                    //console.log("data", dataN);

                    let rows = [].concat(dataN?.data || dataN || []);

                    if (hospIds && hospIds.length > 0) {
                        rows = rows.filter(item => item?.missionHospital?._id && hospIds.includes(item.missionHospital._id));
                    }
                    callback({ data: rows });
                })();
            },

            order: [[3, 'desc']],
            dom: "<'row'<'col-sm-12 col-md-4'l><'col-sm-12 col-md-4'B><'col-sm-12 col-md-4'f>>" +
                "<'row'<'col-sm-12'tr>>" +
                "<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>",
            columnDefs: [{ type: 'datetime-moment', targets: [1, 2] }],
            buttons: [{
                className: 'btn btn-warning',
                text: 'Add',
                action: async function () {
                    openModal('formIO', null, 'Add new Finance');
                    loadHelpForm({
                        formKey: "finance",
                        collectionName: "FinancialHelp",
                        hospIds: hospIds,
                        hiddenFields: ["style", "responseFromFinanceTeam", "confirmationFromFinanceResponse"],
                        tableId: "missionFinance"
                    });

                }
            }],
            columns: columns
        });

        $(document).on('click', '.finance-edit-btn', function () {
            const rowId = $(this).data('id');
            openModal('formIO', null, 'Edit Finance');
            loadHelpForm({
                formKey: "finance",
                collectionName: "FinancialHelp",
                id: rowId,
                hiddenFields: ["style", "responseFromFinanceTeam", "confirmationFromFinanceResponse"],
                tableId: "missionFinance"
            });
        });

        $(document).on('click', '.finance-response-btn', function () {
            const rowId = $(this).data('id');
            openModal('formIO', null, 'Confirmation From Finance Response');
            confirmationResponse(rowId, 'financeHelp');
        });

        $(document).on('click', '.finance-delete-btn', function () {
            const rowId = $(this).data('id');

            // Ask for confirmation before deleting
            if (confirm("Are you sure you want to delete this record?")) {
                const deleteQuery = {
                    collection: "FinancialHelp",
                    query: {
                        selector: { _id: rowId },
                        data: { $set: { isDeleted: true } }
                    }
                };
                fetchCollectionData('updateCollectionData', deleteQuery)
                    .then(resp => {
                        //console.log('Deleted Finance record', resp);
                        $('#missionFinance').DataTable().ajax.reload();
                    })
                    .catch(error => console.error('Error deleting record:', error));
            }
        });

        $(document).on('click', '.finance-preview-btn', function () {
            const rowId = $(this).data('id');
            openModal('formIO', null, 'Preview Finance');
            loadHelpForm({
                formKey: "finance",
                collectionName: "FinancialHelp",
                id: rowId,
                mode: "preview",
                hiddenFields: ["style", "responseFromFinanceTeam", "confirmationFromFinanceResponse"],
                tableId: "missionFinance"
            });
        });

        let selectedFinanceStatuses = [];

        $.fn.dataTable.ext.search = $.fn.dataTable.ext.search.filter(fn => fn.name !== "financeStatusFilter");
        $.fn.dataTable.ext.search.push(function financeStatusFilter(settings, data, dataIndex) {

            if (settings.nTable.id !== 'missionFinance') return true;

            const statusIndex = financeHelpTable.column('Status:name').index();
            //console.log("statusIndex", statusIndex);
            if (statusIndex === -1) return true;

            const rowStatus = (data[statusIndex] || '').toLowerCase().replace(/\s+/g, '');
            //console.log("rowStatus", rowStatus);
            if (selectedFinanceStatuses.length === 0) return true;

            return selectedFinanceStatuses.includes(rowStatus);
        });

        $(document).on('click', '.status-filter-btn', function () {
            const clickedStatus = $(this).data('status').toLowerCase().replace(/\s+/g, '');
            const index = selectedFinanceStatuses.indexOf(clickedStatus);

            if (index > -1) {
                selectedFinanceStatuses.splice(index, 1);
                $(this).removeClass('bg-body-secondary');
            } else {
                selectedFinanceStatuses.push(clickedStatus);
                $(this).addClass('bg-body-secondary');
            }

            financeHelpTable.draw();
        });

        $('#clearStatusFilters').on('click', function () {
            selectedFinanceStatuses = [];
            $('.status-filter-btn').removeClass('bg-body-secondary');
            financeHelpTable.draw();
        });

        $('#missionFinance').on('xhr.dt', function (e, settings, json) {
            const data = json.data;
            let submitted = 0, inProgress = 0, completed = 0;

            data.forEach(row => {
                const status = row.status?.toLowerCase();
                if (status === 'submitted') submitted++;
                else if (status === 'inprogress') inProgress++;
                else if (status === 'completed') completed++;
            });

            $('#financeStatus1').html(submitted);
            $('#financeStatus2').html(inProgress);
            $('#financeStatus3').html(completed);
        });

    });

}


// async function loadFinanceForm(id = null, hospIds, mode) {

//     const financeFormData = { collection: "FormIO", query: { formKey: "finance" } };
//     const financeForm = await fetchCollectionData('fetchCollectionData', financeFormData);

//     financeForm.data[0].components.forEach((page) => {
//         console.log("buttonsetting")
//         if (page.buttonSettings) {
//             page.buttonSettings.cancel = false;
//         }
//         if (mode === 'preview') {
//             page.buttonSettings.submit = false;
//         }
//     });

//     Formio.createForm(document.getElementById('genFormIO'), financeForm.data[0], { hide: { style: true, responseFromFinanceTeam: true, confirmationFromFinanceResponse: true } })
//         .then(function (form) {
//             form.ready.then(async () => {
//                 const username = usrDetails?.data?.profile?.name || '';
//                 form.getComponent('name')?.setValue(username);
//                 if (hospIds) {
//                     form.getComponent('missionHospital').component.valueProperty = '_id';
//                     form.getComponent('missionHospital').setValue(hospIds);
//                     form.getComponent('missionHospital').disabled = true;
//                 }

//                 if (id) {
//                     const res = await fetchCollectionData('fetchCollectionData', {
//                         collection: "FinancialHelp",
//                         query: { _id: id, isDeleted: false }
//                     });

//                     if (res.data && res.data[0]) {
//                         form.submission = { data: res.data[0] };
//                         form.getComponent('missionHospital').disabled = true;

//                         if (mode === 'preview') {
//                             disableAllComponents(form.components);
//                             form.redraw();
//                         }
//                         console.log(res, "Finance form ready");
//                     }
//                 }

//             });

//             form.on('change', async function (fm) { });
//             form.on('submit', function (submitForm) {
//                 const userLogInfo = usrDetails;
//                 const saveButton = form.getComponent('submit');
//                 if (saveButton) {
//                     saveButton.loading = false;
//                     saveButton.element.querySelector('button').removeAttribute('disable');
//                 }

//                 let fnlData = submitForm.data;
//                 const userId = userLogInfo?.data?._id || '';
//                 const username = userLogInfo?.data?.profile?.name || '';
//                 fnlData.isDeleted = false;

//                 if (id) {
//                     fnlData.modified = {
//                         userName: username,
//                         userId: userId,
//                         modifiedDate: new Date()
//                     };

//                     const updateQuery = {
//                         collection: "FinancialHelp",
//                         query: { selector: { _id: id }, data: { $set: fnlData } }
//                     };
//                     fetchCollectionData('updateCollectionData', updateQuery)
//                         .then(resp => {
//                             console.log('Updated Finance record (no docs)', resp);
//                             $('#missionFinance').DataTable().ajax.reload();
//                             closeModal();
//                         });

//                 } else {
//                     fnlData.added = {
//                         userName: username,
//                         userId: userId,
//                         addedDate: new Date()
//                     };
//                     fnlData.status = 'submitted';
//                     if (hospIds) {
//                         const missionHospitalComp = form.getComponent('missionHospital');
//                         const hospValue = missionHospitalComp.getValue();
//                         const selectOptions = missionHospitalComp.selectOptions || [];
//                         let hospLabel = selectOptions.find(opt => opt.value === hospValue)?.label || '';
//                         hospLabel = hospLabel.replace(/<[^>]*>?/gm, '');

//                         fnlData.missionHospital = {
//                             _id: hospValue,
//                             missionHospitalName: hospLabel
//                         };
//                     }

//                     // Insert new document
//                     let insertQuery = { collection: "FinancialHelp", query: fnlData };
//                     console.log("insertQuery", insertQuery);
//                     fetchCollectionData('insertCollectionData', insertQuery)

//                     $('#missionFinance').DataTable().ajax.reload();
//                     closeModal();
//                 }
//                 form.components.forEach(component => component.setValue(''));
//             });

//         });
// }


async function loadHelpForm({ formKey, collectionName, id = null, hospIds, mode, hiddenFields = [], tableId }) {

    const formData = { collection: "FormIO", query: { formKey } };
    const formDefinition = await fetchCollectionData('fetchCollectionData', formData);

    formDefinition.data[0].components.forEach((page) => {
        if (page.buttonSettings) {
            page.buttonSettings.cancel = false;
            if (mode === 'preview') {
                page.buttonSettings.submit = false;
            }
        }
    });

    Formio.createForm(document.getElementById('genFormIO'), formDefinition.data[0], {
        hide: hiddenFields.reduce((acc, field) => {
            acc[field] = true;
            return acc;
        }, {})
    }).then((form) => {
        form.ready.then(async () => {
            const username = usrDetails?.data?.profile?.name || '';
            form.getComponent('name')?.setValue(username);

            if (hospIds) {
                const hospComp = form.getComponent('missionHospital');
                hospComp.component.valueProperty = '_id';
                hospComp.setValue(hospIds);
                hospComp.disabled = true;
            }

            if (id) {
                const existingData = await fetchCollectionData('fetchCollectionData', {
                    collection: collectionName,
                    query: { _id: id, isDeleted: false }
                });

                if (existingData.data && existingData.data[0]) {
                    form.submission = { data: existingData.data[0] };
                    form.getComponent('missionHospital').disabled = true;

                    if (mode === 'preview') {
                        disableAllComponents(form.components);
                        form.redraw();
                    }

                    //console.log(`Loaded ${collectionName} record`, existingData);
                }
            }
        });

        form.on('submit', function (submitForm) {
            const userInfo = usrDetails?.data;
            const userId = userInfo?._id || '';
            const username = userInfo?.profile?.name || '';
            const saveButton = form.getComponent('submit');

            if (saveButton) {
                saveButton.loading = false;
                saveButton.element.querySelector('button')?.removeAttribute('disabled');
            }

            let fnlData = submitForm.data;
            fnlData.isDeleted = false;

            if (id) {
                fnlData.modified = {
                    userName: username,
                    userId: userId,
                    modifiedDate: new Date()
                };

                const updateQuery = {
                    collection: collectionName,
                    query: {
                        selector: { _id: id },
                        data: { $set: fnlData }
                    }
                };

                fetchCollectionData('updateCollectionData', updateQuery).then(resp => {
                    //console.log(`Updated ${collectionName} record`, resp);
                    $(`#${tableId}`).DataTable().ajax.reload();
                    closeModal();
                });

            } else {
                fnlData.added = {
                    userName: username,
                    userId: userId,
                    addedDate: new Date()
                };
                fnlData.status = 'submitted';

                if (hospIds) {
                    const hospComp = form.getComponent('missionHospital');
                    const hospValue = hospComp.getValue();
                    const selectOptions = hospComp.selectOptions || [];
                    let hospLabel = selectOptions.find(opt => opt.value === hospValue)?.label || '';
                    hospLabel = hospLabel.replace(/<[^>]*>?/gm, '');

                    fnlData.missionHospital = {
                        _id: hospValue,
                        missionHospitalName: hospLabel
                    };
                }

                const insertQuery = { collection: collectionName, query: fnlData };
                //console.log("insertQuery", insertQuery);
                fetchCollectionData('insertCollectionData', insertQuery);

                $(`#${tableId}`).DataTable().ajax.reload();
                closeModal();
            }

            // Reset form fields
            form.components.forEach(component => component.setValue(''));
        });
    });
}


// // Function to update pie chart
// let statusCharts = {}; // To store and track chart instances by ID
// function drawStatusPieChart({ data, canvasId, statusPath, chartLabel = 'Status Chart' }) {
//     if (!Array.isArray(data)) {
//         console.error('Data should be an array');
//         return;
//     }

//     const getStatusFromPath = (obj, path) => {
//         return path.split('.').reduce((acc, part) => acc && acc[part], obj);
//     };

//     const statusCounts = {
//         open: 0,
//         submitted: 0,
//         inprogress: 0,
//         completed: 0,
//         unknown: 0
//     };

//     data.forEach(item => {
//         let status = getStatusFromPath(item, statusPath);
//         status = (status || 'unknown').toLowerCase().replace(/\s+/g, '');
//         if (!statusCounts.hasOwnProperty(status)) {
//             status = 'unknown';
//         }
//         statusCounts[status]++;
//     });

//     const labels = Object.keys(statusCounts).map(status =>
//         status.charAt(0).toUpperCase() + status.slice(1)
//     );
//     const values = Object.values(statusCounts);
//     const colors = ['#FFA726', '#42A5F5', '#66BB6A', '#EF5350', '#AB47BC', '#78909C'];

//     // Destroy previous chart on the same canvasId if it exists
//     if (window[canvasId + '_chart']) {
//         window[canvasId + '_chart'].destroy();
//     }

//     const ctx = document.getElementById(canvasId).getContext('2d');
//     window[canvasId + '_chart'] = new Chart(ctx, {
//         type: 'pie',
//         data: {
//             labels: labels,
//             datasets: [{
//                 label: chartLabel,
//                 data: values,
//                 backgroundColor: colors.slice(0, labels.length),
//                 borderWidth: 1
//             }]
//         },
//         options: {
//             responsive: true,
//             plugins: {
//                 legend: {
//                     position: 'bottom'
//                 },
//                 tooltip: {
//                     callbacks: {
//                         label: function (tooltipItem) {
//                             const value = tooltipItem.raw;
//                             const label = tooltipItem.label;
//                             return `${label}: ${value}`;
//                         }
//                     }
//                 }
//             }
//         }
//     });
// }

let skipCheck = false;

async function loadLibraryAccessForm() {
    skipCheck = false;

    const formData = { collection: "FormIO", query: { formKey: "libraryAccess" } };
    const libAccessForm = await fetchCollectionData('fetchCollectionData', formData);

    Formio.createForm(document.getElementById('missionLibraryAccess'), libAccessForm.data[0], {
        hide: { style: true, requestStatus: true, comments: true, accessValidationDate: true }
    }).then(function (form) {
        form.ready.then(async () => {
            const username = usrDetails?.data?.profile?.name || '';
            form.getComponent('name')?.setValue(username);

            console.log("Form ready");

            form.on('change', async function () {
                if (skipCheck) return;

                const instComponent = form.getComponent('nameOfTheInstitution._id');
                const instValue = instComponent ? instComponent.getValue() : null;

                if (!instValue) return;

                const institutionId = typeof instValue === 'object' ? instValue._id : instValue;
                // console.log("Selected Institution ID:", institutionId);

                const msnHpData = {
                    collection: "LibraryAccess",
                    query: { "nameOfTheInstitution._id": institutionId, isDeleted: false }
                };

                const colldata = await fetchCollectionData('fetchCollectionData', msnHpData);
                //console.log("Duplicate check:", Array.isArray(colldata?.data) && colldata.data.length > 0);

                if (Array.isArray(colldata?.data) && colldata.data.length > 0) {
                    alert("This Institution already has a Library Access Request. Please contact your institution for more details.");
                    loadLibraryAccessForm();
                }
            });

            form.on('submit', async (submitForm) => {
                skipCheck = true;

                const fnlData = submitForm.data;
                fnlData.isDeleted = false;
                const userInfo = usrDetails?.data;
                const userId = userInfo?._id || '';
                fnlData.added = {
                    userName: username,
                    userId: userId,
                    addedDate: new Date()
                };
                fnlData.status = 'submitted';

                const insertQuery = { collection: "LibraryAccess", query: fnlData };
                await fetchCollectionData('insertCollectionData', insertQuery);

                alert("Your request is being processed. You will receive an email after confirmation. Thank you!");

                // Reset by destroying and reloading the form
                form.destroy(true);
                await loadLibraryAccessForm();
            });

        });
    });
}



async function connectFeedbackForm() {

    const formData = { collection: "FormIO", query: { formKey: "formAllocation" } };
    const feedBackForm = await fetchCollectionData('fetchCollectionData', formData);

    Formio.createForm(document.getElementById('genFormIO'), feedBackForm.data[0], {
        hide: { style: true, missionOfficeUse: true }
    }).then(function (form) {
        form.ready.then(async () => {
            const username = usrDetails?.data?.profile?.name || '';
            form.getComponent('name')?.setValue(username);

            console.log("Form ready");

            form.on('submit', async (submitForm) => {
                const userInfo = usrDetails?.data;
                const userId = userInfo?._id || '';
                const fnlData = submitForm.data;
                fnlData.isDeleted = false;
                fnlData.added = {
                    userName: username,
                    userId: userId,
                    addedDate: new Date()
                };
                console.log("fnldata", fnlData);
                const insertQuery = { collection: "ConnectFeedback", query: fnlData };
                console.log("insertQuery", insertQuery);
                await fetchCollectionData('insertCollectionData', insertQuery);

                alert("“Thank you for your valuable feedback. We will work on the points you’ve raised to improve our service.”");
                closeModal();
            });

        });
    });
}

async function loadGrandRoundsTable() {

    $.fn.dataTable.ext.errMode = 'none';
    $.fn.dataTable.ext.type.order['iso-date-pre'] = function (date) {
        return date ? new Date(date).getTime() : 0;
    };

    $(document).ready(function () {
        $('#grandRoundsTable').DataTable({
            ajax: function (data, callback, settings) {
                (async () => {
                    const query = { isDeleted: false };
                    const dataN = await fetchCollectionData('fetchCollectionData', { collection: "GrandRounds", query: query, options: { sort: { "added.addedDate": -1 } } });
                    renderOngoingGrandRounds(dataN.data || []);
                    callback({ data: dataN.data || [] });
                })();
            },
            order: [[3, 'desc']],
            dom: "<'row'<'col-sm-12 col-md-4'><'col-sm-12 col-md-4'><'col-sm-12 col-md-4'f>>" +
                "<'row mt-2'<'col-sm-12'tr>>" +
                "<'row mt-2'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>",
            columns: [

                { data: "grandRoundsTitle", title: "Grand Rounds" },
                { data: "speakerName", title: "Speaker Name" },
                {
                    data: null,
                    title: "Schedule", className: "col-md-3 text-center",
                    render: function (data, type, row) {
                        const dateObj = new Date(data.startDate);
                        const formattedDate = dateObj.toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                        });

                        return `<button class="btn" style="text-decoration: underline;" 
                onclick='openModal("grandRoundSchedule", "Grand Rounds Schedule", ${JSON.stringify(data).replace(/'/g, "&apos;")})'>
                Click to view </button>
                <br>Started on <br>${formattedDate}`;
                    }
                },
                // {
                //     data: null,
                //     title: "Register",
                //     render: function (data, type, row, meta) {
                //         //return `<button class="btn btn-warning" onclick='openModal("grandRounds", "", ${JSON.stringify(data).replace(/'/g, "&apos;")})'>Details</button>`;
                //         return `<a href="${data.zoomLink}" target="_blank" class="btn  btn-sm  btn-warning mb-3">Register</a>`;
                //     }
                // }
                {
                    data: null,
                    title: "Register",
                    render: function (data, type, row, meta) {

                        // Get today's date
                        const currentDate = new Date();
                        currentDate.setHours(0, 0, 0, 0);

                        // Get Grand Rounds end date
                        const endDate = new Date(data.endDate);
                        endDate.setHours(0, 0, 0, 0);

                        // Show Register button only if Grand Rounds is ongoing
                        if (endDate >= currentDate) {

                            return `
                <a href="${data.zoomLink}" 
                   target="_blank" 
                   class="btn btn-sm btn-warning mb-3">
                    Register
                </a>
            `;

                        }

                        // Hide button for expired Grand Rounds
                        return `<span class="text-muted">Closed</span>`;
                    }
                }
            ]
        });
    });

}

async function loadGrantsListTable() {
    console.log("LoadGrantsList")

    $.fn.dataTable.ext.errMode = 'none';
    $.fn.dataTable.ext.type.order['iso-date-pre'] = function (date) {
        return date ? new Date(date).getTime() : 0;
    };

    $(document).ready(function () {
        $('#grantsListTable').DataTable({
            ajax: function (data, callback, settings) {
                (async () => {
                    const query = { isDeleted: false };
                    const dataN = await fetchCollectionData('fetchCollectionData', { collection: "GrantsList", query: query });
                    callback({ data: dataN.data || [] });
                })();
            },
            order: [[0, 'desc']],
            dom: "<'row'<'col-sm-12 col-md-4'l><'col-sm-12 col-md-4'><'col-sm-12 col-md-4'f>>" +
                "<'row'<'col-sm-12'tr>>" +
                "<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>",
            columns: [

                { data: "grantName", title: "Grant Name", className: 'col-md-4' },
                { data: "yearOfIntroduction", title: "Year of Introduction" },
                { data: "dateTime", title: "Date" },
                {
                    data: null,
                    title: "Details",
                    render: function (data, type, row, meta) {
                        return `<button class="btn btn-warning" onclick='openModal("grandRounds", "", ${JSON.stringify(data).replace(/'/g, "&apos;")})'>Details</button>`;
                    }
                }
            ]
        });
    });

}



async function loadResearchRequest() {

    researchReqForm = { collection: "FormIO", query: { formKey: "researchRequest" } };
    const reqForm = await fetchCollectionData('fetchCollectionData', researchReqForm);
    Formio.createForm(document.getElementById('genFormIO'), reqForm.data[0], { hide: { style: true, missionOfficeUse: true } })
        .then(function (form) {
            form.ready.then(async () => {
                console.log("form ready");

                form.on('submit', async (submitForm) => {
                    const userInfo = usrDetails?.data;
                    const username = userInfo?.profile?.name || '';
                    const userId = userInfo?._id || '';
                    var fnlData = submitForm.data;
                    fnlData.isDeleted = false;
                    fnlData.status = 'ongoing';
                    fnlData.added = {
                        userName: username,
                        userId: userId,
                        addedDate: new Date()
                    };

                    const insertQuery = { collection: "ResearchRequest", query: fnlData };
                    //console.log("fetchQuery", insertQuery);
                    await fetchCollectionData('insertCollectionData', insertQuery);

                    alert("Your request is being processed, you will receive an email after confirmation. Thank you!");

                    closeModal();

                });
            })
        })
}

async function loadMmsApplication(pagekey, id) {

    console.log("loadMmsApplication", pagekey, id);
    const pageKey = pagekey || 'application';
    const formData = { collection: "FormIO", query: { formKey: "missionVisitApplication" } };
    const reqForm = await fetchCollectionData('fetchCollectionData', formData);
    if (!reqForm?.data?.length) {
        console.error("Form data not found");
        return;
    }

    const formJson = reqForm.data[0];
    console.log("Form JSON: ", formJson);

    formJson.components.forEach((page) => {

        if (page.buttonSettings) {
            page.buttonSettings.cancel = false;
            page.buttonSettings.next = false;
            page.buttonSettings.submit = false;
            page.buttonSettings.previous = false;
        }

        if (page.key === pageKey) {
            page.hidden = false;
            page.customConditional = "show = true";
        } else {
            page.hidden = false;
            page.customConditional = "show = false";
        }

        page.breadcrumbClickable = false;
    });

    try {
        Formio.createForm(document.getElementById('genFormIO'), formJson, { show: { style: true } })
            .then(async (form) => {
                await form.ready;
                console.log("Form ready");

                const user = usrDetails?.data?.profile || {};

                form.getComponent('name')?.setValue(user.name || '');
                form.getComponent('department')?.setValue(user.department || '');
                form.getComponent('designation')?.setValue(user.designation || '');
                form.getComponent('empNumber')?.setValue(user.employeeNo || '');
                form.getComponent('email')?.setValue(usrDetails?.data?.emails[0].address || '');

                const departmentId = user.departmentId || '';
                if (departmentId) {
                    const collection = {
                        collection: "MmsDepHsptlAll",
                        query: { departmentId: departmentId, isDeleted: false },
                        projection: { allottedMissionHospitals: 1 }
                    };

                    const depMmsData = await fetchCollectionData('fetchCollectionData', collection);
                    console.log("depMmsData", depMmsData);

                    const missionHospitalComp = form.getComponent('missionHospital');
                    if (missionHospitalComp && depMmsData?.data?.length) {

                        const hospitals = depMmsData.data
                            .flatMap(doc => doc.allottedMissionHospitals || [])
                            .filter(h => h.hospitalEligibleForMmp === "yes" && h.missionHospitals)
                            .map(h => ({
                                label: h.missionHospitals.missionHospitalName,
                                value: {
                                    _id: h.missionHospitals._id,
                                    missionHospitalName: h.missionHospitals.missionHospitalName
                                },
                            }));

                        console.log("Populating Mission Hospitals:", hospitals);

                        missionHospitalComp.component.data.values = hospitals;
                        missionHospitalComp.component.dataSrc = "values";
                        missionHospitalComp.redraw();
                        missionHospitalComp.setValue(null);

                    }
                    else {
                        console.warn("No hospital data found or dropdown missing.");
                    }
                }
                let query = {};

                if (pageKey !== "application") {
                    query = { saveDraft: false };
                } else {
                    query = {
                        status: "draft"
                    };
                }
                if (id) {
                    query._id = id;
                }

                const filter = {
                    empNumber: user.employeeNo,
                    isDeleted: false,
                    ...query
                };

                console.log("Filter", filter);

                const collection = {
                    collection: "MmsApplication",
                    query: filter,
                };

                const reqData = await fetchCollectionData("fetchCollectionData", collection);
                console.log("reqData", reqData);

                const reqId = reqData?.data?.length ? reqData.data[0]._id : null;
                console.log("reqId", reqId);

                form.submission = reqData?.data?.length ? { data: reqData.data[0] } : null;

                form.on('saveDraft', async () => {
                    const fnlData = form.data; // allows incomplete data
                    await handleMmsFormSave(fnlData, reqId, { saveDraft: true });
                });

                // SUBMIT APPLICATION BUTTON
                form.on('submitApplication', async () => {

                    const isValid = await form.checkValidity(form.data, true);

                    if (!isValid) {
                        console.log("Form validation failed");

                        // Show all validation errors on screen
                        form.showErrors();
                        return;
                    }

                    console.log("Form validated successfully");
                    const fnlData = form.data;
                    await handleMmsFormSave(fnlData, reqId, { submitApplication: true });
                });

                // SAVE BUTTON
                form.on('save', async (submission) => {

                    console.log("Save button clicked");

                    // Trigger full form validation
                    const isValid = await form.checkValidity(form.data, true);

                    if (!isValid) {
                        console.log("Form validation failed");

                        // Show all validation errors on screen
                        form.showErrors();
                        return;
                    }

                    console.log("Form validated successfully");

                    // Now perform save logic (insert/update)
                    const fnlData = form.data;
                    await handleMmsFormSave(fnlData, reqId, { SaveSubmit: true });
                });
            });
    } catch (error) {
        console.error('Error loading the MMS Application form:', error);
    }

}

async function handleMmsFormSave(fnlData, reqId, actionType = {}) {
    try {
        const userInfo = usrDetails?.data;
        const userName = userInfo?.profile?.name || '';
        const userId = userInfo?._id || '';
        const now = new Date();

        if (actionType.saveDraft) {
            fnlData.saveDraft = true;
            fnlData.status = 'draft';
            fnlData.submit = false;
            fnlData.added = fnlData.added || { userId, userName, addedDate: now };
            console.log("Saving draft data:", fnlData);
        }
        else if (actionType.submitApplication) {
            fnlData.saveDraft = false;
            fnlData.submit = false;
            fnlData.status = 'submitted';
            console.log("Submitting application:", fnlData);
        }
        else if (actionType.SaveSubmit) {
            fnlData.saveDraft = false;
            fnlData.submit = false;
            console.log("Save submission:", fnlData);
        }

        fnlData.departmentId = fnlData.departmentId || usrDetails?.data?.profile?.departmentId || '';

        if (reqId) {
            fnlData.modified = { userId, userName, modifiedDate: now };
            await fetchCollectionData('updateCollectionData', {
                collection: "MmsApplication",
                query: { selector: { _id: reqId }, data: { $set: fnlData } }
            });
        } else {
            fnlData.added = { userId, userName, addedDate: now };
            await fetchCollectionData('insertCollectionData', {
                collection: "MmsApplication",
                query: fnlData
            });
        }
        if (actionType.saveDraft) {
            alert("Your draft has been saved successfully.");
        } else if (actionType.submitApplication) {
            alert("Your request is being processed, you will receive an email after confirmation. Thank you!");
        } else {
            alert("Your application has been saved successfully.");
        }
        navigateTo('mmService', ' ', ['loadMmServicePage']);

        closeModal();


    } catch (error) {
        console.error('Error saving MMS Application:', error);
    }
}

async function loadPreMmsVisits() {

    console.log("loadPreMmsVisits");

    $.fn.dataTable.ext.errMode = 'none';

    $(document).ready(function () {

        $('#preMmsVisitTable').DataTable({
            ajax: async function (data, callback, settings) {

                const user = usrDetails?.data?.profile || {};
                const query = {
                    isDeleted: false,
                    department: user.department || " ",
                    visitStatus: "completed"
                };

                const response = await fetchCollectionData('fetchCollectionData', {
                    collection: "MmsApplication",
                    query,
                    options: { sort: { "added.addedDate": -1 } }
                });

                let rows = response.data || [];

                // Format date for each row
                rows = rows.map(item => {
                    const firstImage = item.uploadPicture?.[0];
                    const imageUrl = firstImage?.data?.url || 'https://s3.amazonaws.com/img.studenthub.in/CMCVConnect_Portal/Pictures/_43782473c4ed75b1e167091821a4d700_Pictures.png';

                    return {
                        ...item,
                        fromDateFormatted: item.fromDate2
                            ? moment(item.fromDate2).format('DD MMM YYYY')
                            : '-',
                        toDateFormatted: item.toDate2
                            ? moment(item.toDate2).format('DD MMM YYYY')
                            : '-',
                        imageUrl: imageUrl
                    };
                });

                console.log("rows", rows);

                callback({ data: rows });
            },

            dom: "<'row'<'col-sm-12 col-md-4'l><'col-sm-12 col-md-4'><'col-sm-12 col-md-4'f>>" +
                "<'row'<'col-sm-12'tr>>" +
                "<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>",

            columns: [
                { data: "name", title: "Name" },
                { data: "designation", title: "Designation" },
                { data: "missionHospital.missionHospitalName", title: "Hospital Name" },

                {
                    data: "fromDateFormatted",
                    title: "From Date"
                },
                {
                    data: "toDateFormatted",
                    title: "To Date"
                },

                {
                    data: null,
                    title: "Details",
                    render: function (data, type, row) {
                        return `
                            <button class="btn btn-warning"
                                onclick='openModal("preMmsVisits", "", ${JSON.stringify(row).replace(/'/g, "&apos;")})'>
                                Details
                            </button>`;
                    }
                }
            ]
        });
    });
}

async function loadMmsOtherVisitApp() {

    formData = { collection: "FormIO", query: { formKey: "mmsOtherVisits" } };
    const reqForm = await fetchCollectionData('fetchCollectionData', formData);
    Formio.createForm(document.getElementById('genFormIO'), reqForm.data[0], { hide: { style: true, missionsOfficeUse: true } })
        .then(function (form) {
            form.ready.then(async () => {
                console.log("form ready");
                const user = usrDetails?.data?.profile || {};
                form.getComponent('name')?.setValue(user.name || '');
                form.getComponent('employeeNo')?.setValue(user.employeeNo || '');
                form.getComponent('department')?.setValue(user.department || '');
                form.getComponent('designation')?.setValue(user.designation || '');
                form.getComponent('email')?.setValue(usrDetails?.data?.emails[0]?.address || '');

                form.on('submit', async (submitForm) => {
                    const userInfo = usrDetails?.data;
                    const username = userInfo?.profile?.name || '';
                    const userId = userInfo?._id || '';
                    var fnlData = submitForm.data;
                    fnlData.status = 'submitted';
                    fnlData.isDeleted = false;
                    fnlData.added = {
                        userName: username,
                        userId: userId,
                        addedDate: new Date()
                    };

                    const insertQuery = { collection: "MmsOtherVisit", query: fnlData };
                    //console.log("fetchQuery", insertQuery);
                    await fetchCollectionData('insertCollectionData', insertQuery);

                    alert("Your visit details have been saved successfully.");

                    closeModal();

                });
            })
        })

}

async function loadNetConsltRegForm() {
    console.log("LoadNetConsltRegFrom");

    formData = { collection: "FormIO", query: { formKey: "registryOfNetworkConsultants" } };
    const reqForm = await fetchCollectionData('fetchCollectionData', formData);
    console.log("reqForm", reqForm);
    if (!reqForm?.data?.length) {
        console.error("Form data not found");
        return;
    }

    const formJson = reqForm.data[0];
    console.log("Form JSON: ", formJson);

    formJson.components.forEach((page) => {
        if (page.buttonSettings) {
            page.buttonSettings.cancel = false;
            page.buttonSettings.next = false;
            page.buttonSettings.submit = false;
            page.buttonSettings.previous = false;
        }
        page.breadcrumbClickable = false;
    });
    Formio.createForm(document.getElementById('genFormIO'), reqForm.data[0], { hide: { style: true, missionsOfficeUse: true } })
        .then(function (form) {
            form.ready.then(async () => {
                console.log("form ready");
                const user = usrDetails?.data?.profile || {};
                form.getComponent('name')?.setValue(user.name || '');
                form.getComponent('designation')?.setValue(user.designation || '');

                form.on('change', async (event) => {
                    if (event.changed?.component?.key !== 'areYouWorkingInCmc') {
                        return;
                    }
                    if (event.changed?.component?.key === 'areYouWorkingInCmc' && event.data.areYouWorkingInCmc === 'Yes') {
                        console.log("user", user);
                        form.getComponent('employeeNumber')?.setValue(user.employeeNo || '');

                        if (user.departmentId) {
                            form.getComponent('cmcDepartments')?.setValue({
                                _id: user.departmentId,
                                name: user.department || ''
                            });
                        }
                        if (user.unit) {
                            form.getComponent('cmcUnit')?.setValue({
                                id: user.unitId,
                                name: user.unit || ''
                            });
                        }
                    }
                });

                form.on('submit', async (submitForm) => {
                    const userInfo = usrDetails?.data;
                    const username = userInfo?.profile?.name || '';
                    const userId = userInfo?._id || '';
                    var fnlData = submitForm.data;
                    fnlData.userId = userId;
                    fnlData.isDeleted = false;
                    fnlData.status = "Submitted";
                    fnlData.added = {
                        userName: username,
                        userId: userId,
                        addedDate: new Date()
                    };

                    const insertQuery = { collection: "NetConsltRegApp", query: fnlData };
                    console.log("fetchQuery", insertQuery);
                    await fetchCollectionData('insertCollectionData', insertQuery);

                    alert("Your request is being processed, you will receive an email after confirmation. Thank you!");

                    closeModal();

                });
            })
        })
}

let patientDataTable;

async function ncPatientReqtable() {
    $.fn.dataTable.ext.errMode = 'none';
    if ($.fn.DataTable.isDataTable('#ncPatientReqtable')) {
        $('#ncPatientReqtable').DataTable().destroy();
    }

    patientDataTable = $('#ncPatientReqtable').DataTable({
        ajax: function (data, callback, settings) {
            fetchCollectionData('fetchCollectionData', {
                collection: "NetConsltPatient",
                query: { isDeleted: false, 'added.userId': usrDetails?.data?._id },
                options: { sort: { 'added.addedDate': -1 } }
            })
                .then(response => {
                    callback({ data: response.data || [] });
                })
                .catch(err => {
                    console.error("Table fetch error:", err);
                    callback({ data: [] });
                });
        },
        order: [],
        dom: "<'row'<'col-sm-12 col-md-4'B><'col-sm-12 col-md-5'f><'col-sm-12 col-md-3'l>>" +
            "<'row'<'col-sm-12'tr>>" +
            "<'row mt-2'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>",
        buttons: [{
            className: 'secondary-bg-color text-white border-0 rounded',
            text: 'Enter new patient',
            action: function () {
                openModal('formIO', null, 'Add Patient Request', null);
                ncPatientReqForm('add', null);
            }
        }],
        columns: [
            { data: "patientId", title: "Patient ID" },
            { data: "patientName", title: "Patient Name" },
            { data: "gender", title: "Gender" },
            { data: "added.addedDate", title: "Date", render: (data, type) => (data && type !== 'sort') ? moment(data).format("DD-MM-YYYY") : data },
            { data: "modified.modifiedDate", title: "Last Seen Date", render: (data, type) => (data && type !== 'sort') ? moment(data).format("DD-MM-YYYY") : data },
            {
                data: null,
                title: "Actions",
                className: "text-center",
                orderable: false,
                render: function (data, type, row, meta) {
                    const rowData = patientDataTable.row(meta.row).data();
                    return `<button class="btn btn-sm btn-primary" onclick="event.stopPropagation(); openModal('formIO', null, 'Add ${rowData.patientName} Request', null); ncPatientReqForm( 'nextVisit', ${JSON.stringify(rowData).replace(/'/g, "\\'").replace(/"/g, '&quot;')});"><i class="fas fa-plus"></i></button>
                        <button class="btn btn-sm btn-warning" onclick="event.stopPropagation(); openModal('formIO', null, 'Edit ${rowData.patientName} Request', null); ncPatientReqForm('edit', ${JSON.stringify(rowData).replace(/'/g, "\\'").replace(/"/g, '&quot;')}, '${rowData._id}');"><i class="fas fa-edit"></i></button>
                        <button class="btn btn-sm btn-info" onclick="openPatientWorkspace('${rowData.patientId}')"><i class="fas fa-list"></i></button>
                        <button class="btn btn-sm btn-danger delete-btn" data-id="${rowData._id}"><i class="fas fa-trash"></i></button>`;
                }
            }
        ]
    });

    $('#ncPatientReqtable').on('click', '.delete-btn', async function (e) {
        const rowData = patientDataTable.row($(this).closest('tr')).data();
        if (confirm("Are you sure you want to delete this patient request?")) {
            await fetchCollectionData('updateCollectionData', {
                collection: "NetConsltPatient",
                query: { selector: { _id: rowData._id }, $set: { isDeleted: true, modified: { modifiedDate: new Date(), userId: usrDetails?.data?._id, userName: usrDetails?.data?.name } } }
            });
            patientDataTable.ajax.reload();
        }
    });

    $('#ncPatientReqtable tbody').on('click', 'tr', function () {
        const rowData = patientDataTable.row(this).data();
        if (rowData) {
            particularPatientReq(rowData);
        }
    });
}

function particularPatientReq(data) {
    const fields = {
        'ncPatientName': data.patientName,
        'ncPatientAge': data.age,
        'ncPatientPlace': data.instHsptlName,
        'ncPatientHistory': data.history,
        'ncPatientInvestigations': data.investigations,
        'ncPatientPlan': data.plan,
        'ncPatientStartDate': data.added?.addedDate ? moment(data.added.addedDate).format("DD-MM-YYYY") : null,
        'ncPatientLastSeenDate': data.lastSeenDate ? moment(data.lastSeenDate).format("DD-MM-YYYY") : null
    };

    for (const [id, value] of Object.entries(fields)) {
        const el = document.getElementById(id);
        if (el) el.innerText = value || 'Details Awaited';
    }
}


let cachedCaseForm = null;

async function ncPatientReqForm(type, existingData = null, reqId = null) {
    console.log("ncPatientReqForm", type, existingData, reqId);
    if (!cachedCaseForm) {
        const response = await fetchCollectionData('fetchCollectionData', {
            collection: "FormIO",
            query: { formKey: "clinicalCaseDiscussion" }
        });
        cachedCaseForm = response.data[0];
    }

    Formio.createForm(document.getElementById('genFormIO'), cachedCaseForm)
        .then(async function (form) {
            if (existingData) {
                form.submission = { data: { patientName: existingData.patientName, gender: existingData.gender, age: existingData.age } };

                const readonlyFields = ['patientId', 'patientName', 'gender'];
                readonlyFields.forEach(key => {
                    const component = form.getComponent(key);
                    if (component) {
                        component.disabled = true;
                        if (typeof component.redraw === 'function') {
                            component.redraw();
                        }
                    }
                });
            }

            if (reqId && type == 'edit') {
                const response = await fetchCollectionData('fetchCollectionData', {
                    collection: "NetConsltPatient",
                    query: { _id: reqId }
                });
                form.submission = { data: response.data[0] };
            }

            form.on('submit', async (submitForm) => {
                const userInfo = usrDetails?.data;

                let submissionData = { ...submitForm.data };
                delete submissionData._id;

                submissionData.isDeleted = false;

                if (!existingData && type == 'add') {

                    const lastPatientResponse = await fetchCollectionData('fetchCollectionData', {
                        collection: 'NetConsltPatient',
                        query: { reqStatus: "Allotted", isDeleted: false },
                        options: { limit: 1, sort: { 'added.addedDate': -1 } }
                    });
                    const currentYear = new Date().getFullYear().toString().slice(2);

                    if (lastPatientResponse?.data?.length > 0) {
                        const lastIdStr = lastPatientResponse.data[0].patientId || "00NC0000";
                        const lastPatientIdNum = Number(lastIdStr.split("NC")[1]) || 0;

                        // Update data block to write back the new patientId string
                        submissionData.patientId = currentYear + "NC" + String(lastPatientIdNum + 1).padStart(4, '0');
                    } else {
                        submissionData.patientId = currentYear + "NC" + "0001";
                    }

                    submissionData.added = {
                        userName: userInfo?.profile?.name || '',
                        userId: userInfo?._id || '',
                        addedDate: new Date()
                    };
                } else if (existingData && type == 'nextVisit') {
                    submissionData.patientId = existingData.patientId;
                    submissionData.added = {
                        userName: userInfo?.profile?.name || '',
                        userId: userInfo?._id || '',
                        addedDate: new Date()
                    };
                } else if (existingData && type == 'edit') {
                    submissionData.modified = {
                        userName: userInfo?.profile?.name || '',
                        userId: userInfo?._id || '',
                        modifiedDate: new Date()
                    };
                }
                console.log("submissionData", submissionData);

                const method = existingData && type == 'edit' ? 'updateCollectionData' : 'insertCollectionData';

                const res = await fetchCollectionData(method, {
                    collection: "NetConsltPatient",
                    query: existingData && type == 'edit' ? { selector: { _id: existingData._id }, data: { $set: submissionData } } : submissionData,
                });
                console.log(res)

                alert(`Patient request ${existingData && type == 'edit' ? 'updated' : 'submitted'} successfully.`);
                closeModal();
                const table = $('#ncPatientReqtable').DataTable();
                table.ajax.reload(null, false);
            });
        });
}

async function ncMyDeptConsltTable() {

    console.log("ncMyDeptConsltTable");
    $.fn.dataTable.ext.errMode = 'none';
    $.fn.dataTable.ext.type.order['iso-date-pre'] = function (date) {
        return date ? new Date(date).getTime() : 0;
    };

    const userRole = usrDetails?.data?.roles || [];
    const deptName = usrDetails?.data?.profile?.department;
    document.getElementById('ncDepartmentName').innerText = deptName + ' Consults';

    $(document).ready(function () {
        $('#ncMyDeptConsltTable').DataTable({
            ajax: function (data, callback, settings) {
                (async () => {
                    let query = { isDeleted: false };
                    if (userRole.includes("NC Consultant")) {
                        console.log("NC Consultant", usrDetails?.data?.profile?.departmentId)
                        query = { isDeleted: false, 'cmcDepartments._id': usrDetails?.data?.profile?.departmentId };
                    }
                    const dataN = await fetchCollectionData('fetchCollectionData', { collection: "NetConsltRegApp", query: query });
                    console.log(dataN)
                    callback({ data: dataN.data || [] });
                })();
            },
            order: [[0, 'desc']],
            dom: "<'row'<'col-sm-12 col-md-4'l><'col-sm-12 col-md-4'><'col-sm-12 col-md-4'f>>" +
                "<'row'<'col-sm-12'tr>>" +
                "<'row mt-2'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>",
            columns: [
                { data: "name", title: "Name" },
                { data: "designation", title: "Designation" },
                { data: "cmcUnit.name", title: "Units", defaultContent: '-' },
                {
                    data: null,
                    title: "Details",
                    render: function (data, type, row, meta) {
                        return `<button class="btn btn-warning" onclick='openModal("grandRounds", "", ${JSON.stringify(data).replace(/'/g, "&apos;")})'>Details</button>`;
                    }
                }
            ]
        });
    });
}

async function ncNodalsListTable() {

    console.log("ncNodalsListTable");
    $.fn.dataTable.ext.errMode = 'none';

    $(document).ready(function () {
        $('#ncNodalsListTable').DataTable({
            ajax: function (data, callback, settings) {
                (async () => {
                    const query = { isDeleted: false, "roles._id": "NC Nodal" };
                    const dataN = await fetchCollectionData('fetchCollectionData', { collection: "NetConsltRegApp", query: query });
                    callback({ data: dataN.data || [] });
                })();
            },
            order: [[0, 'desc']],
            dom: "<'row'<'col-sm-12 col-md-4'><'col-sm-12 col-md-4'><'col-sm-12 col-md-4'f>>" +
                "<'row'<'col-sm-12'tr>>" +
                "<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>",
            columns: [
                { data: "name", title: "Name" },
                { data: "designation", title: "Designation" },
                {
                    data: null,
                    title: "Institution/Hospital Name",
                    render: function (data) {
                        return data.missionHospital?.missionHospitalName
                            || data.hospitalName
                            || 'CMC';
                    }
                },
                { data: "cmcUnits", title: "Units", defaultContent: '-' },
                {
                    data: null,
                    title: "Details",
                    render: function (data, type, row, meta) {
                        return `<button class="btn btn-warning" onclick='openModal("grandRounds", "", ${JSON.stringify(data).replace(/'/g, "&apos;")})'>Details</button>`;
                    }
                }
            ]
        });
    });
}

function initLayoutToggle(data) {


    let mode = "tiles";

    $('#tableView').hide();
    $('#tileSearchWrapper').show();

    $('#layoutToggle').text("Switch to Table");

    $('#layoutToggle').on('click', function () {

        if (mode === "tiles") {
            $('#tableView').show();
            $('#tileView').hide();
            $('#mapView').hide();
            $('#tileSearchWrapper').hide();
            mode = "table";
            $(this).text("Switch to Tiles");
        } else {
            $('#tableView').hide();
            $('#tileView').show();
            $('#mapView').hide();
            $('#tileSearchWrapper').show();
            mode = "tiles";
            $(this).text("Switch to Table");
        }
    });

    $('#mapToggle').on('click', function () {
        $('#tableView, #tileView, #tileSearchWrapper').hide();
        $('#mapView').show();
        loadMap('msnVisitMap', data.map(r => r.missionHospitalId));
    });
}

let msnCacheData = null;

async function msnVisitManPowerTable() {

    const user = usrDetails?.data?.profile || {};
    const userDept = user.departmentId;

    $('.userName').text('Dr. ' + user.name);

    if (!msnCacheData) {

        const collection = [
            {
                collection: "MissionRequests",
                query: { missionStatus: { $in: ['Open'] }, isDeleted: 'false' },
                projection: {
                    _id: 1,
                    missionHospitalId: 1,
                    specializationId: 1,
                    selectedLinkedDepartments: 1,
                    fromMsnHospDate: 1,
                    toMsnHospDate: 1
                }
            },
            {
                collection: "MissionSpecializations",
                query: { 'linkedDepartments._id': userDept, isDeleted: 'false' },
                projection: { _id: 1, name: 1 }
            },
            {
                collection: "MissionHospital",
                query: { isDeleted: 'false' },
                projection: { _id: 1, missionHospitalName: 1, hospitalImages: 1 }
            },
            {
                collection: "ManPowerInterest",
                query: { 'user._id': usrDetails?.data?._id, isDeleted: false }
            }
        ];

        msnCacheData = await fetchedDataAPI("fetchCollectionData", collection);
    }

    const response = msnCacheData;

    const missionRequests = response['MissionRequests']?.data || [];
    const specializations = response['MissionSpecializations']?.data || [];
    const msnHosps = response['MissionHospital']?.data || [];
    const userMPInterest = response['ManPowerInterest']?.data || [];

    // Maps
    const hospMap = Object.fromEntries(msnHosps.map(h => [h._id, h]));
    const specMap = Object.fromEntries(specializations.map(s => [s._id, s.name]));

    const userDeptSet = new Set([userDept]);

    const filteredRequests = missionRequests.filter(req =>
        (req.selectedLinkedDepartments || []).some(d => userDeptSet.has(d._id))
    );

    const interestRequestIds = new Set(
        userMPInterest.map(i => i.missionRequestId)
    );

    renderTable(filteredRequests, interestRequestIds, hospMap, specMap, filteredRequests);
    renderMissionTiles(filteredRequests, interestRequestIds, hospMap, specMap);
    initTileSearch(interestRequestIds, hospMap, specMap);
    initLayoutToggle(filteredRequests);

}

function renderTable(data, interestRequestIds, hospMap, specMap, filteredRequests) {

    if (filteredRequests.length === 0) {
        document.getElementById('msnVisitManPowerTableContainer')
            .innerHTML = '<div class="card text-primary p-2 text-center fw-medium my-3">There are no requests for manpower for your department at the moment.</div>';
        return;
    }

    if ($.fn.DataTable.isDataTable('#msnVisitManPowerTable')) {
        $('#msnVisitManPowerTable').DataTable().destroy().clear();
    }

    $('#msnVisitManPowerTable').DataTable({
        data,
        dom: "<'row'<'col-sm-12 col-md-4'><'col-sm-12 col-md-4'><'col-sm-12 col-md-4'f>>" +
            "<'row'<'col-sm-12'tr>>" +
            "<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>",
        order: [[2, 'desc']],
        columns: [
            {
                data: "missionHospitalId",
                title: "Mission Hospital",
                render: d => hospMap[d]?.missionHospitalName || ""
            },
            {
                data: "specializationId",
                title: "Specialization",
                render: d => specMap[d] || ""
            },
            {
                data: "fromMsnHospDate",
                title: "From Date",
                render: d => d ? moment(d).format("DD-MM-YYYY") : ""
            },
            {
                data: "toMsnHospDate",
                title: "To Date",
                render: d => d ? moment(d).format("DD-MM-YYYY") : ""
            },
            {
                data: null,
                title: "Would you like to go?",
                render: (row) => {
                    const isInterested = interestRequestIds.has(row._id);
                    return `<button class="btn ${isInterested ? 'secondary-bg-color disabled text-white opacity-100' : 'btn-primary'} interestedHsptl">
                        ${isInterested ? '✓ Interest Registered' : 'Interested? Click here'}
                    </button>`;
                }
            }
        ]
    })

    $('#msnVisitManPowerTable tbody').off('click', '.interestedHsptl').on('click', '.interestedHsptl', async function () {
        const table = $('#msnVisitManPowerTable').DataTable();
        const data = table.row($(this).parents('tr')).data();
        saveMPInterest(data, hospMap, specMap, this);

    });
    $('#tileView').off('click', '.interestedTileBtn')
        .on('click', '.interestedTileBtn', async function () {

            const requestId = $(this).data('id');
            const reqData = filteredRequests.find(r => r._id === requestId);
            if (!reqData) return;
            await saveMPInterest(reqData, hospMap, specMap, this);

        });
}

async function saveMPInterest(data, hospMap, specMap, btnElement) {

    openModal('confirmModal', null, {
        message: 'Please confirm your interest in visiting this hospital.',
        btnText: 'Confirm'
    });

    $('#finalConfirmBtn')
        .off('click')
        .one('click', async function () {

            closeModal();

            openModal('msgModal', null, {
                message: 'Thank you for your interest! Our Missions Office will contact you shortly.',
                btnText: 'OK'
            });

            const $btn = $(btnElement);

            if ($btn.hasClass('disabled')) return;

            $btn.addClass('disabled').text('Submitting...');

            try {

                const userProfile = usrDetails?.data?.profile || {};
                const userId = usrDetails?.data?._id || '';

                const payload = {
                    user: {
                        _id: userId,
                        name: userProfile.name || '',
                        emailId: userProfile.email || ''
                    },
                    missionRequestId: data._id,
                    missionHospital: {
                        _id: data.missionHospitalId,
                        missionHospitalName: hospMap[data.missionHospitalId]?.missionHospitalName || ''
                    },
                    specialization: {
                        _id: data.specializationId,
                        name: specMap[data.specializationId] || ''
                    },
                    fromMsnHospDate: data.fromMsnHospDate,
                    toMsnHospDate: data.toMsnHospDate,
                    status: "Submitted",
                    isDeleted: false,
                    added: {
                        userName: userProfile.name || '',
                        userId: userId,
                        addedDate: new Date()
                    }
                };

                const insertQuery = {
                    collection: "ManPowerInterest",
                    query: payload
                };

                await fetchCollectionData('insertCollectionData', insertQuery);

                $btn.removeClass('btn-primary interestedHsptl')
                    .addClass('secondary-bg-color text-white opacity-100')
                    .text('✓ Interest Registered');
                if (window.interestRequestIds) {
                    window.interestRequestIds.add(data._id);
                }

                $(document).trigger('mpInterestSaved', [data._id]);

            } catch (err) {

                console.error("Error inserting ManPowerInterest", err);

                $btn
                    .removeClass('disabled')
                    .addClass('btn-primary')
                    .text('Interested');

                alert("Failed to submit your interest. Please try again.");
            }
        });
}


let cachedMsnFormSchema = null;

async function loadMsnVisitForm() {
    try {
        let formSchema = cachedMsnFormSchema;

        if (!formSchema) {
            const formData = { collection: "FormIO", query: { formKey: "missionVisits" } };
            const response = await fetchCollectionData('fetchCollectionData', formData);

            if (response?.data?.[0]) {
                formSchema = response.data[0];
                cachedMsnFormSchema = formSchema;
            } else {
                throw new Error("Form schema not found.");
            }
        } else {
            console.log("Loading schema from cache.");
        }

        const form = await Formio.createForm(
            document.getElementById('genFormIO'),
            formSchema,
            { hide: { style: true, missionsOfficeUse: true } }
        );

        await form.ready;

        const user = usrDetails?.data?.profile || {};
        form.setSubmission({
            data: {
                name: user.name || '',
                employeeNo: user.employeeNo || '',
                designation: user.designation || '',
                cmcDepartments: user.department || ''
            }
        });

        form.on('submit', async (submission) => {
            try {
                const fnlData = {
                    ...submission.data,
                    cmcDepartments: { _id: user.departmentId, name: user.department },
                    isDeleted: false,
                    status: "Submitted",
                    added: {
                        userName: user.name || '',
                        userId: usrDetails?.data?._id || '',
                        addedDate: new Date()
                    }
                };
                //console.log(fnlData);
                await fetchCollectionData('insertCollectionData', {
                    collection: "MsnVisitApp",
                    query: fnlData
                });

                alert("Your record have been submitted successfully. Thankyou!");
                closeModal();
            } catch (err) {
                console.error("Submission failed", err);
            }
        });

    } catch (error) {
        console.error("Form error:", error);
    }
}


async function ncPatientsAllotList(tableId) {

    $.fn.dataTable.ext.errMode = 'none';

    $(document).ready(function () {
        $(`#${tableId}`).DataTable({
            ajax: function (data, callback, settings) {
                (async () => {
                    const collection = {
                        collection: "NCAllotDocLog",
                        query: {},
                        queryType: "standard"
                        // options: { sort: { "added.addedDate": -1 } }
                    };
                    const response = await fetchCollectionData('fetchCollectionDataFromDB', collection);
                    console.log(response);
                    const rawData = response.data || [];
                    console.log("Raw API data:", rawData);

                    let tableRows = [];
                    if (rawData.length > 0 && Array.isArray(rawData[0].allottedTo)) {
                        tableRows = rawData[0].allottedTo;
                    }
                    console.log("Extracted Rows for DataTables:", tableRows);
                    callback({ data: tableRows });
                })();
            },
            dom: "<'row'<'col-sm-12 col-md-4'><'col-sm-12 col-md-4'><'col-sm-12 col-md-4'f>>" +
                "<'row'<'col-sm-12'tr>>" +
                "<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>",
            columns: [
                { data: "patientId", title: "Patient ID" },
                { data: "patientName", title: "Patient Name" },
                { data: "gender", title: "Gender" },
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
                    data: null, title: "Allotted To",
                    render: function (data) {
                        return Array.isArray(data.allottedTo) ?
                            data.allottedTo.map(item => item.name).join(', ') : '-';
                    }
                },
                {
                    data: null,
                    title: "View Details",
                    orderable: false,
                    className: "text-center",
                    render: function (data, type, row, meta) {
                        const rowData = patientDataTable.row(meta.row).data();
                        return `<button class="btn btn-sm btn-info" onclick="openPatientWorkspace('${rowData.patientId}')"><i class="fas fa-list"></i></button>`;
                    }
                }
            ]
        });
    });
}

async function loadNCAllotLog(patientId) {

    let table = $('#ncAllotLogTable').DataTable({
        ajax: function (data, callback, settings) {
            (async () => {
                const query = { patientId: patientId };
                const response = await fetchCollectionData('fetchCollectionDataFromDB', {
                    collection: "NCAllotDocLog", query, queryType: 'standard'
                });

                const rawData = response.data || [];
                console.log("Raw API data:", rawData);

                let tableRows = [];
                if (rawData.length > 0 && Array.isArray(rawData[0].allottedTo)) {
                    tableRows = rawData[0].allottedTo;
                }
                console.log("Extracted Rows for DataTables:", tableRows);
                callback({ data: tableRows });
            })();
        },
        dom: "<'row'<'col-sm-12 col-md-4'><'col-sm-12 col-md-4'B><'col-sm-12 col-md-4'f>>" +
            "<'row'<'col-sm-12'tr>>" +
            "<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>",
        buttons: [{
            className: 'btn btn-sm btn-primary',
            text: 'Allot Doctor',
            action: function (e, dt, node, config) {
                openNCAllotDocModal(patientId);
            }
        }],
        columns: [
            { data: "docName", title: "Doctor Name" },
            {
                data: "updatedDate",
                title: "Updated Date",
                render: function (data) {
                    return data ? new Date(data).toLocaleString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                    }) : '';
                }
            },
            { data: "status", title: "Status" },
            {
                data: null, title: "Action", render: function (data, type, row, meta) {
                    return `<button class="btn btn-sm btn-danger removeNCAllotDoc" data-id="${row.docId}"><i class="fas fa-trash"></i></button>`;
                }
            }
        ]
    });

    table.on('click', '.removeNCAllotDoc', async function () {
        const rowData = table.row($(this).parents('tr')).data();
        console.log("rowData", rowData);
        if (confirm("Are you sure you want to remove this doctor?")) {
            await fetchCollectionData('updateCollectionDataInDB', {
                collection: "NCAllotDocLog",
                query: {
                    selector: { patientId: patientId },
                    data: {
                        $pull: {
                            allottedTo: { docId: rowData.docId }
                        }
                    }
                }
            });
            table.ajax.reload();
        }
    });

}

async function openNCAllotDocModal(patientId) {

    const query = { 'roles._id': { $in: ["NC Consultant"] }, isDeleted: false };
    const response = await fetchCollectionData('fetchCollectionData', { collection: "NetConsltRegApp", query });
    const ncConsultantList = response.data || [];
    console.log("ncConsultantList", ncConsultantList)

    openModal('selectListModal', null, {
        title: 'Select Doctor',
        list: ncConsultantList,
        displayField: 'name',
        displayField2: 'cmcDepartments.name',
        valueField: 'userId',
    });

    $('#modalDropdown').on('change', function () {
        const selected = $(this).val();
        console.log(selected);
        if (selected) {
            $('#selectListModal .addBtn').removeClass('d-none');
        } else {
            $('#selectListModal .addBtn').addClass('d-none');
        }
    });

    $('#selectListModal .addBtn').on('click', async function () {
        const selected = $('#selectListModal select').val();
        console.log(selected);

        insertQuery = {
            selector: { patientId: patientId },
            data: {
                $push: {
                    allottedTo: {
                        docId: selected,
                        docName: ncConsultantList.find(x => x.userId == selected).name,
                        status: "Pending",
                        updatedDate: new Date()
                    }
                }
            }
        }
        console.log("insertQuery", insertQuery)
        await fetchCollectionData('updateCollectionDataInDB', {
            collection: "NCAllotDocLog",
            query: insertQuery
        }).then(async (response) => {
            console.log("response", response)
            await loadNCAllotLog(patientId);
        })
        closeModal()
    });

}


async function loadFOVGrantForm(reqId = null) {
    const formData = { collection: "FormIO", query: { formKey: "fovProjectPo" } };
    const fovGrantForm = await fetchCollectionData('fetchCollectionData', formData);
    console.log("fovGrantForm", fovGrantForm);

    // Track the current record id in closure state so repeated saves on this
    // form instance update the same row instead of inserting new ones.
    let currentReqId = reqId;

    // If editing/resuming a draft, fetch the existing record so the form can
    // be pre-populated instead of always loading blank.
    let existingSubmissionData = null;
    if (currentReqId) {
        try {
            const existingRecord = await fetchCollectionData('fetchCollectionData', {
                collection: 'FovApplication',
                query: { _id: currentReqId, isDeleted: false },
                options: { limit: 1 }
            });
            existingSubmissionData = existingRecord?.data?.[0] || null;
        } catch (err) {
            console.error("Error loading existing FOV application:", err);
        }
    }

    const formElement = document.getElementById('genFormIO');

    Formio.createForm(formElement, fovGrantForm.data[0], {
        hide: { style: true, approval: true }
    }).then(function (form) {
        form.ready.then(async () => {
            const username = usrDetails?.data?.profile?.name || '';

            if (existingSubmissionData) {
                // Resuming a draft: load the saved data into the form.
                form.submission = { data: existingSubmissionData };
            } else {
                form.getComponent('applicantName')?.setValue(username);
            }

            console.log("Form ready");

            form.on('saveDraft', async () => {
                const fnlData = form.data; // allows incomplete data
                const result = await handleFovFormSave(fnlData, currentReqId, { saveDraft: true }, fovGrantForm);
                if (result) {
                    currentReqId = result.reqId;
                    form.getComponent('fovGrantId')?.setValue(result.fovGrantId);
                }
            });

            form.on('submit', async (submission) => {
                const fnlData = submission.data;
                const result = await handleFovFormSave(fnlData, currentReqId, { finalSubmit: true }, fovGrantForm);
                if (result) {
                    currentReqId = result.reqId;
                    form.getComponent('fovGrantId')?.setValue(result.fovGrantId);
                }
            });
        });
    });
}

async function generateFovGrantId() {
    const currentYear = new Date().getFullYear().toString().slice(-2);
    let nextNumber = 1;

    try {
        const response = await fetchCollectionData('fetchCollectionData', {
            collection: 'FovApplication',
            // Scope to this year's IDs only, so numbering resets on Jan 1
            // instead of continuing from a previous year's last record.
            query: { isDeleted: false, fovGrantId: { $regex: `^${currentYear}FOV` } },
            projection: { fovGrantId: 1, _id: 1 },
            options: { limit: 1, sort: { 'added.addedDate': -1 } }
        });

        // fetchCollectionData already returns parsed data — no .json() needed.
        const lastId = response?.data?.[0]?.fovGrantId || "";

        if (lastId.includes("FOV")) {
            const parsed = parseInt(lastId.split("FOV")[1], 10);
            if (!isNaN(parsed)) {
                nextNumber = parsed + 1;
            }
        }
    } catch (err) {
        console.error("Error generating FOV Grant ID, defaulting to 1:", err);
        nextNumber = 1;
    }

    return `${currentYear}FOV${String(nextNumber).padStart(5, "0")}`;
}

async function handleFovFormSave(fnlData, reqId, actionType = {}, fovGrantForm) {

    console.log("========== FOV FORM SAVE ==========");
    console.log("fnlData:", fnlData);
    console.log("reqId:", reqId);
    console.log("actionType:", actionType);

    try {
        const userId = usrDetails?.data?._id || "";
        const userName = usrDetails?.data?.profile?.name || "";
        const now = new Date();

        // Generate the grant ID only once per application
        let fovGrantId = fnlData.fovGrantId;
        if (!fovGrantId) {
            fovGrantId = await generateFovGrantId();
            fnlData.fovGrantId = fovGrantId;
        }
        console.log("fovGrantId:", fovGrantId);

        // 1. UPLOAD ALL FORM FILES TO S3 (Runs for both Draft Save & Final Submit)
        console.log("STEP 1: Uploading all FOV documents...");
        const uploadedData = await uploadAllFOVDocuments(fnlData, fovGrantId);
        Object.assign(fnlData, uploadedData);
        console.log("STEP 1 COMPLETE: Documents uploaded", fnlData);

        // SAVE DRAFT SPECIFIC LOGIC
        if (actionType.saveDraft) {
            console.log("Processing FOV Draft...");
            fnlData.msnStatus = "Draft";
        }

        // FINAL SUBMISSION SPECIFIC LOGIC
        else if (actionType.finalSubmit) {
            console.log("Processing FOV Final Submission...");

            fnlData.msnStatus = "Submitted";
            fnlData.isDeleted = false;

            // 2. GENERATE FINAL PDF (Only on final submit)
            console.log("STEP 2: Generating final PDF...");
            const fileName = `FOV_Grant_Application_${fovGrantId}_${Date.now()}.pdf`;
            const fileObj = await buildAndUploadFormPDF(fovGrantForm, fnlData, fileName, fovGrantId);
            console.log("STEP 2 COMPLETE: Final PDF uploaded", fileObj);

            // 3. ADD FINAL PDF REFERENCE
            fnlData.finalPDFDocs = [fileObj];
        }

        // DATABASE SAVE
        console.log("STEP 3: Saving FOV application to database...");

        let savedReqId = reqId;

        if (reqId) {
            console.log("Updating existing FOV application:", reqId);
            fnlData.modified = { userId, userName, modifiedDate: now };

            // const updateResponse = await fetchCollectionData("updateCollectionData", {
            //     collection: "FovApplication",
            //     query: {
            //         selector: { _id: reqId },
            //         data: { $set: fnlData }
            //     }
            // });
            console.log("FOV application updated successfully:", updateResponse);
        } else {
            console.log("No reqId found. Inserting new FOV application...", fnlData);
            fnlData.added = { userId, userName, addedDate: now };

            // const insertResponse = await fetchCollectionData("insertCollectionData", {
            //     collection: "FovApplication",
            //     query: fnlData
            // });

            savedReqId = insertResponse?.data?._id || insertResponse?.data?.insertedId || null;
            console.log("FOV application inserted successfully:", insertResponse);
        }

        console.log("STEP 3 COMPLETE: Database operation completed");

        // SUCCESS MESSAGE
        if (actionType.saveDraft) {
            closeModal();
            openModal("msgModal", null, {
                message: "Thank you for your application. Your form draft has been saved successfully.",
                btnText: "OK"
            });
        } else if (actionType.finalSubmit) {
            closeModal();
            openModal("msgModal", null, {
                message: "Thank you for your application. Your form has been submitted successfully.",
                btnText: "OK"
            });
        }

        return { reqId: savedReqId, fovGrantId };
    }
    catch (error) {
        console.error("Error saving FOV Application:", error);
        console.error("Error message:", error?.message);
        console.error("Error stack:", error?.stack);

        openModal("msgModal", null, {
            message: "Something went wrong while saving your application. Please try again.",
            btnText: "OK"
        });

        return null;
    }
}

async function uploadAllFOVDocuments(fnlData, fovGrantId) {

    console.log("Starting FOV document upload...");

    // Run the 4 independent upload categories concurrently instead of
    // sequentially — same number of network calls, much less wall-clock time.
    const [supportingDoc, uploadBudget, IFbuildPlanAndCostEstimPrepared, uploadSignature] = await Promise.all([
        Array.isArray(fnlData.supportingDoc)
            ? uploadSupportingDocuments(fnlData.supportingDoc, fovGrantId)
            : Promise.resolve(fnlData.supportingDoc),
        Array.isArray(fnlData.uploadBudget)
            ? uploadBudgetFiles(fnlData.uploadBudget, fovGrantId)
            : Promise.resolve(fnlData.uploadBudget),
        Array.isArray(fnlData.IFbuildPlanAndCostEstimPrepared)
            ? uploadCostEstimFiles(fnlData.IFbuildPlanAndCostEstimPrepared, fovGrantId)
            : Promise.resolve(fnlData.IFbuildPlanAndCostEstimPrepared),
        Array.isArray(fnlData.uploadSignature)
            ? uploadSignatureFiles(fnlData.uploadSignature, fovGrantId)
            : Promise.resolve(fnlData.uploadSignature)
    ]);

    const updatedData = {
        ...fnlData,
        supportingDoc,
        uploadBudget,
        IFbuildPlanAndCostEstimPrepared,
        uploadSignature
    };

    console.log("All FOV documents uploaded:", updatedData);
    return updatedData;
}

function extractBase64(dataUrl) {
    if (!dataUrl) return null;
    if (dataUrl.startsWith("data:")) {
        const commaIndex = dataUrl.indexOf(",");
        if (commaIndex === -1) return null;
        return dataUrl.substring(commaIndex + 1);
    }
    return dataUrl;
}

async function uploadFormFileToS3(file, fovGrantId, folder) {
    if (!file) return file;

    // Already uploaded to S3 — skip re-upload.
    if (file.storage === "url" && file.url && !file.url.startsWith("data:")) {
        return file;
    }

    if (!file.url) {
        console.warn("File has no URL:", file);
        return file;
    }

    const base64 = extractBase64(file.url);
    if (!base64) {
        console.warn("Could not extract Base64:", file);
        return file;
    }

    const fileName = file.name || file.originalName || `file_${Date.now()}`;
    const s3Key = `CMCVConnect_Portal/FOVGrant/${fovGrantId}/Applications/${folder}/${fileName}`;

    console.log("Uploading file:", { fileName, s3Key, type: file.type });

    const pdfUrl = await uploadToS3(base64, s3Key, false, file.type);
    if (!pdfUrl) {
        throw new Error(`Failed to upload ${fileName}`);
    }

    return {
        ...file,
        storage: "url",
        url: pdfUrl,
        name: fileName,
        originalName: file.originalName || fileName || file.docName,
        size: file.size,
        type: file.type
    };
}

async function uploadSupportingDocuments(supportingDoc, fovGrantId) {
    if (!Array.isArray(supportingDoc)) return supportingDoc;

    return await Promise.all(
        supportingDoc.map(async (document) => {
            if (!Array.isArray(document.uploadDoc)) return document;
            const uploadedFiles = await Promise.all(
                document.uploadDoc.map((file) => uploadFormFileToS3(file, fovGrantId, "SupportingDocuments"))
            );
            return { ...document, uploadDoc: uploadedFiles };
        })
    );
}

async function uploadBudgetFiles(uploadBudget, fovGrantId) {
    if (!Array.isArray(uploadBudget)) return uploadBudget;
    return await Promise.all(
        uploadBudget.map((file) => uploadFormFileToS3(file, fovGrantId, "Budget"))
    );
}

async function uploadCostEstimFiles(IFbuildPlanAndCostEstimPrepared, fovGrantId) {
    if (!Array.isArray(IFbuildPlanAndCostEstimPrepared)) return IFbuildPlanAndCostEstimPrepared;
    return await Promise.all(
        IFbuildPlanAndCostEstimPrepared.map((file) => uploadFormFileToS3(file, fovGrantId, "BuildPlanAndCostEstimPrepared"))
    );
}

async function uploadSignatureFiles(uploadSignature, fovGrantId) {
    if (!Array.isArray(uploadSignature)) return uploadSignature;
    return await Promise.all(
        uploadSignature.map((file) => uploadFormFileToS3(file, fovGrantId, "Signature"))
    );
}

async function buildAndUploadFormPDF(fovGrantForm, formData, fileName, fovGrantId) {

    const content = [];
    const logoBase64 = await imageToBase64(
        "https://s3.amazonaws.com/img.studenthub.in/CMCVConnect_Portal/Pictures/_5da5bd1a1b92c36b4728149b0ae98980_Pictures.png"
    );
    const signatureBase64 = await imageToBase64(
        "https://s3.amazonaws.com/img.studenthub.in/CMCVConnect_Portal/Pictures/_59cabaa93cf88e48933aa889dfe976e4_Pictures.png"
    );

    renderComponents(fovGrantForm.data[0].components, formData, content);
    content.push({

        margin: [0, 50, 20, 30],
        stack: [
            {
                columns: [
                    {
                        stack: [
                            {
                                text: "Applied Date",
                                bold: true
                            },
                            {
                                text: formatSimpleDate(formData.appliedDate),
                                color: "#555555"
                            }
                        ],
                        width: "*"
                    },
                    {
                        stack: [
                            {
                                text: "Applicant Signature",
                                bold: true,
                                alignment: "right",
                                fontSize: 12
                            },
                            {
                                image: signatureBase64,
                                fit: [120, 50],
                                alignment: "right"
                            }
                        ],
                        width: 150
                    }
                ]
            }
        ]
    });

    const docDefinition = {
        pageSize: "A4",
        pageMargins: [40, 90, 40, 60],
        header: function (currentPage) {

            if (currentPage !== 1) return "";

            return {
                margin: [40, 25, 40, 10],
                columns: [
                    {
                        image: logoBase64,
                        width: 45
                    },
                    {
                        stack: [
                            {
                                text: "CHRISTIAN MEDICAL COLLEGE VELLORE",
                                bold: true,
                                fontSize: 16,
                                alignment: "center"
                            },
                            {
                                text: "FOV Grant Proposal",
                                fontSize: 18,
                                bold: true,
                                color: "#0B5394",
                                alignment: "center",
                                margin: [0, 6, 0, 0]
                            }
                        ],
                        width: "*"
                    }
                ]
            };
        },
        footer: function (currentPage, pageCount) {

            if (currentPage !== pageCount) {

                return {
                    text: "Page " + currentPage + " of " + pageCount,
                    alignment: "right",
                    margin: [20, 0, 25, -15],
                    fontSize: 9,
                    color: "#666"
                };
            }
        },
        background: function (currentPage, pageSize) {
            return {
                canvas: [
                    {
                        type: "rect",
                        x: 20,
                        y: 20,
                        w: pageSize.width - 40,
                        h: pageSize.height - 40,
                        r: 0,
                        lineWidth: 1.2,
                        lineColor: "#000000"
                    }
                ]
            };
        },
        content,
        styles: {
            sectionTitle: {
                fontSize: 14,
                bold: true,
                color: "#0B5394"
            },
            fieldLabel: {
                bold: true,
                fontSize: 12
            },
            fieldValue: {
                fontSize: 12,
                color: "#555555"
            }
        }
    };

    return new Promise((resolve, reject) => {

        const pdfDocGenerator = pdfMake.createPdf(docDefinition);
        pdfDocGenerator.getBase64(async (base64) => {

            try {

                const s3Key = `CMCVConnect_Portal/FOVGrant/${fovGrantId}/Applications/${fileName}`;
                const pdfUrl = await uploadToS3(base64, s3Key);

                if (!pdfUrl) {
                    return reject(new Error("Failed to upload PDF to S3."));
                }

                const fileObject = {
                    storage: "url",
                    name: fileName,
                    url: pdfUrl,
                    size: base64.length,
                    type: "application/pdf"
                };

                resolve(fileObject);

            } catch (err) {
                reject(err);
            }

        });

    });
}

function formatSimpleDate(dateStr) {
    if (!dateStr) return "________";
    const d = new Date(dateStr);
    if (isNaN(d)) return "________";

    return d.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    });
}

async function imageToBase64(url) {

    const response = await fetch(url);
    const blob = await response.blob();

    return new Promise((resolve, reject) => {

        const reader = new FileReader();

        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;

        reader.readAsDataURL(blob);

    });

}


function renderComponents(components, data, content) {

    components.forEach(component => {
        // console.log("Component: ", component, "Data: ", data, "Content: ", content);
        if (component.hidden) return;
        if (component.type === "file") return;
        if (!shouldRenderComponent(component, data)) {
            return;
        }
        // Skip empty input fields
        if (component.input && isEmptyField(component, data)) {
            return;
        }

        switch (component.type) {

            case "panel":
                renderPanel(component, data, content);
                // console.log("panel", component);
                break;

            case "columns":
                renderColumns(component, data, content);
                // console.log("columns", component);
                break;

            case "textfield":
            case "email":
            case "number":
            case "phoneNumber":
                renderInput(component, data, content);
                // console.log("textfield", component);
                break;

            case "textarea":
                renderTextarea(component, data, content);
                // console.log("textarea", component);
                break;
            case "selectboxes":
                renderSelectboxes(component, data, content);
                // console.log("selectboxes", component);
                break;

            case "checkbox":
                renderCheckbox(component, data, content);
                // console.log("checkbox", component);
                break;

            case "radio":
                renderRadio(component, data, content);
                // console.log("radio", component);
                break;

            case "select":
                renderSelect(component, data, content);
                // console.log("select", component);
                break;

            case "datetime":
                renderDate(component, data, content);
                // console.log("datetime", component);
                break;

            case "editgrid":
                renderEditGrid(component, data, content);
                // console.log("editgrid", component);
                break;

            case "content":
                renderContent(component, content);
                // console.log("content", component);
                break;

        }

    });

}

function shouldRenderComponent(component, data) {

    const grantFor = data.grantFor || {};

    if (component.title === "Approval") return false;
    if (component.title === "Supporting Documents") return false;
    if (component.title === "Equipment Request" && !grantFor.Equipment) {
        return false;
    }
    if (component.title === "Building Request" && !grantFor.Building) {
        return false;
    }
    if (component.title === "Other Request" && !grantFor.Other) {
        return false;
    }

    return true;
}

function renderInput(component, data, content) {

    renderField(
        component.label,
        getDisplayValue(component, data),
        content,
        component.key
    );

}

function renderTextarea(component, data, content) {

    content.push({
        text: component.label,
        bold: true,
        margin: [0, 10, 0, 4]
    });

    content.push({
        text: getDisplayValue(component, data),
        color: "#555555",
        margin: [10, 0, 0, 12]
    });

}

function renderSelectboxes(component, data, content) {

    const selected = data[component.key] || {};

    const values = component.values
        .filter(v => selected[v.value])
        .map(v => v.label)
        .join(", ");

    renderField(
        component.label,
        values,
        content
    );

}

function renderCheckbox(component, data, content) {

    renderField(
        component.label,
        data[component.key] ? "Yes" : "No",
        content
    );

}

function renderEditGrid(component, data, content) {

    const rows = data[component.key];

    if (!rows || !rows.length) return;

    // Flatten nested columns/panels into actual input fields
    const fields = flattenComponents(component.components);

    if (!fields.length) return;

    // Header row
    const headers = fields.map(field => ({
        text: field.label || "",
        bold: true,
        color: "#FFFFFF",
        fillColor: "#0B5394",
        alignment: "center",
        margin: [4, 6, 4, 6]
    }));

    const body = [headers];

    // Data rows
    rows.forEach(row => {

        body.push(

            fields.map(field => {

                let value = row[field.key];

                if (value === undefined || value === null) {
                    value = "";
                }

                // Object values (Select components)
                if (typeof value === "object" && !Array.isArray(value)) {

                    value =
                        value.label ||
                        value.name ||
                        value.title ||
                        value.missionHospitalName ||
                        "";

                }

                // Arrays
                if (Array.isArray(value)) {

                    value = value.map(v => {

                        if (typeof v === "object") {

                            return (
                                v.label ||
                                v.name ||
                                v.title ||
                                v.missionHospitalName ||
                                ""
                            );

                        }

                        return v;

                    }).join(", ");

                }

                return {
                    text: String(value),
                    color: "#555555",
                    margin: [4, 5, 4, 5]
                };

            })

        );

    });
    const widths = fields.map(field => {

        switch (field.key) {
            case "name":
                return 110;
            case "designation":
                return 110;
            case "email":
                return "*";
            case "phoneNo":
                return 90;
            case "thisEquipNecessary":
                return 130;
            default:
                return "*";
        }

    });

    content.push({

        unbreakable: true,

        stack: [

            {
                text: component.label,
                style: "fieldLabel",
                margin: [0, 12, 0, 8]
            },

            {
                table: {
                    headerRows: 1,
                    widths: widths,
                    body: body
                },
                layout: {
                    hLineWidth: () => 0.5,
                    vLineWidth: () => 0.5,
                    hLineColor: () => "#D9E2F3",
                    vLineColor: () => "#D9E2F3"
                }
            }

        ]

    });
}

function flattenComponents(components, result = []) {

    if (!components) return result;

    components.forEach(component => {

        if (!component) return;

        switch (component.type) {

            case "columns":

                component.columns.forEach(column => {

                    flattenComponents(column.components || [], result);

                });

                break;

            case "panel":

            case "container":

            case "fieldset":

                flattenComponents(component.components || [], result);

                break;

            default:

                if (component.input && component.key) {
                    result.push(component);
                }
        }
    });

    return result;

}
function decodeHtml(text) {

    const txt = document.createElement("textarea");
    txt.innerHTML = text;
    return txt.value;

}

function renderPanel(component, data, content) {

    content.push({
        text: component.title || component.label,
        style: "sectionTitle",
        alignment: "center",
        margin: [0, 20, 0, 15]
    });

    renderComponents(component.components, data, content);
}

function renderColumns(component, data, content) {

    component.columns.forEach(column => {
        renderComponents(column.components, data, content);
    });

}

function renderContent(component, content) {

    if (!component.html) return;

    const div = document.createElement("div");
    div.innerHTML = component.html;

    const text = div.textContent.trim();

    if (!text) return;

    content.push({
        text,
        style: "fieldLabel",
        alignment: "left",
        bold: true,
        color: "#000000",
        margin: [0, 10, 0, 12]
    });

}

function renderRadio(component, data, content) {

    renderField(
        component.label,
        getDisplayValue(component, data),
        content
    );

}

function renderSelect(component, data, content) {

    content.push({
        table: {
            widths: [220, "*"],
            body: [
                [
                    {
                        text: component.label,
                        bold: true,
                        border: [false, false, false, true],
                        margin: [0, 5, 8, 5]
                    },
                    {
                        text: getDisplayValue(component, data),
                        color: "#555555",
                        border: [false, false, false, true],
                        margin: [0, 5, 0, 5]
                    }
                ]
            ]
        },
        layout: "noBorders",
    });

}

function renderDate(component, data, content) {

    content.push({
        table: {
            widths: [220, "*"],
            body: [
                [
                    {
                        text: component.label,
                        bold: true,
                        border: [false, false, false, true],
                        margin: [0, 5, 8, 5]

                    },
                    {
                        text: formatSimpleDate(data[component.key]),
                        color: "#555555",
                        border: [false, false, false, true],
                        margin: [0, 5, 0, 5]

                    }
                ]
            ]
        },
        layout: "noBorders",
    });

}

function getDisplayValue(component, data) {

    const value = data[component.key];

    if (value === null || value === undefined || value === "") {
        return "";
    }

    // Date
    if (component.type === "datetime") {
        return formatSimpleDate(value);
    }

    // Select (object)
    if (typeof value === "object" && !Array.isArray(value)) {

        if (value.label) return value.label;

        if (value.name) return value.name;

        if (value.missionHospitalName) return value.missionHospitalName;

        // Checkbox group / boolean object
        return Object.keys(value)
            .filter(k => value[k] === true)
            .join(", ");
    }

    // Multi select
    if (Array.isArray(value)) {

        return value.map(v => {

            if (typeof v === "object") {
                return (
                    v.label ||
                    v.name ||
                    v.missionHospitalName ||
                    v.title ||
                    JSON.stringify(v)
                );
            }

            return v;

        }).join(", ");
    }

    return String(value);
}
function renderField(label, value, content, key = "") {

    // console.log(label, value, content)
    const highlightFields = ["grantAmtReq"];

    const isHighlight = highlightFields.includes(key);

    content.push({
        table: {
            widths: [220, "*"],
            body: [[
                {
                    text: label,
                    bold: true,
                    color: isHighlight ? "#ffffff" : "#000000",
                    fillColor: isHighlight ? "#0B5394" : null,
                    border: isHighlight
                        ? [true, true, false, true]
                        : [false, false, false, true],
                    margin: [0, 5, 8, 5]
                },
                {
                    text: value || "",
                    bold: isHighlight,
                    color: isHighlight ? "#ffffff" : "#555555",
                    alignment: "left",
                    fillColor: isHighlight ? "#0B5394" : null,
                    border: isHighlight
                        ? [false, true, true, true]
                        : [false, false, false, true],
                    margin: [0, 5, 0, 5]
                }
            ]]
        },
        layout: "noBorders",
    });

}

function isEmptyField(component, data) {

    const value = data?.[component.key];

    // Layout components should always be rendered
    if (["panel", "columns", "content", "editgrid"].includes(component.type)) {
        return false;
    }

    if (value === null || value === undefined) return true;

    if (typeof value === "string" && value.trim() === "") return true;

    if (Array.isArray(value) && value.length === 0) return true;

    if (typeof value === "object" && !Array.isArray(value)) {
        return Object.keys(value).length === 0;
    }

    return false;
}


async function loadFovApplication(actTab = 'Draft') {
    console.log("Active Tab Filter:", actTab);
    $.fn.dataTable.ext.errMode = 'none';

    if ($.fn.DataTable.isDataTable('#fovApplicationTable')) {
        $('#fovApplicationTable').DataTable().destroy();
        $('#fovApplicationTable').empty();
    }

    fovApplicationTable = $('#fovApplicationTable').DataTable({
        ajax: function (data, callback, settings) {
            (async () => {
                try {
                    let query = { isDeleted: false };
                    if (actTab && actTab !== 'Approved' && actTab !== 'Rejected') {
                        query.msnStatus = actTab;
                    } else if (actTab === 'Approved') {
                        query.msnStatus = 'Approved'; query.fovStatus = 'Approved';
                    } else if (actTab === 'Rejected') {
                        query.msnStatus = 'Rejected'; query.fovStatus = 'Rejected';
                    } else if (actTab === 'Reproposal') {
                        query.msnStatus = 'Submitted'; query.fovStatus = 'Reproposal';
                    }


                    // const dataN = await fetchCollectionData('fetchCollectionData', {
                    //     collection: "FovApplication",
                    //     query: query,
                    //     options: { sort: { "added.addedDate": -1 } }
                    // });

                    const dataN = [{
                        "IFareLiftsRequired": "",
                        "acknowledged": false,
                        "added": {
                            "userName": "testconnect",
                            "userId": "at8HiiygEpHuC65GF",
                            "addedDate": "Mon Aug 17 2026 15:02:21 GMT+0530 (India Standard Time)"
                        },
                        "amtHsptlCanContribute": "",
                        "amtRaiseLocalOtherSrc": "",
                        "applicantName": "testconnect",
                        "appliedDate": "",
                        "availDepartments": [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
                        "balAmtToBeRaised": "",
                        "briefOverviewOfHsptl": "A grant is a sum of money given by a government, foundation, or organization to an individual or group for a specific purpose. Unlike a loan, a grant does not need to be paid back, as long as you follow the rules and use the funds for the approved project",
                        "budgetBreakdown": "",
                        "buildPlanAndCostEstimPrepared": "",
                        "buildSpaceAvailForEquip": "",
                        "buildingBeConstructed": "",
                        "catchPopServed": "",
                        "confirmThatHsptlHasFcraRegAndBankAcc": false,
                        "descriPurposeOfUse": "",
                        "describeOtherReqInDetail": "",
                        "designation": "Professor",
                        "disMngPlanIncEvacBeenPrepared": "",
                        "email": "xaviermax07@gmail.com",
                        "equipNeedSigniElectric": "",
                        "equipmentList": [],
                        "estimCostPerProceTest": "",
                        "estimRunCostSalaryPowerAmc": "",
                        "evidenceShowsThisIsAPriority": "A grant is a sum of money given by a government, foundation, or organization to an individual or group for a specific purpose. Unlike a loan, a grant does not need to be paid back, as long as you follow the rules and use the funds for the approved project",
                        "expectPatiLoadDemand": "",
                        "expectedStartDate": "",
                        "expectedcompltDate": "",
                        "fcraCategory": "",
                        "fcraRegNo": "",
                        "fcraSector": "",
                        "finalPDFDocs": [
                            {
                                "storage": "url",
                                "name": "FOV_Grant_Application_wSGZeePZuWyQZEymL_1785561364201.pdf",
                                "url": "https://s3.amazonaws.com/img.studenthub.in/CMCVConnect_Portal/FOVGrant/Applications/wSGZeePZuWyQZEymL/FXJgfo6RrSp3YwDce.pdf",
                                "size": "27554",
                                "type": "application/pdf",
                                "createdAt": {
                                    "$date": "2026-08-03T06:02:15.473Z"
                                }
                            },
                            {
                                "storage": "url",
                                "name": "FOV_Grant_Application_wSGZeePZuWyQZEymL_1785561434567.pdf",
                                "url": "https://s3.amazonaws.com/img.studenthub.in/CMCVConnect_Portal/FOVGrant/Applications/wSGZeePZuWyQZEymL/QN6AKgYsZMfPMnWG4.pdf",
                                "size": "27554",
                                "type": "application/pdf",
                                "createdAt": {
                                    "$date": "2026-08-03T06:02:44.340Z"
                                }
                            },
                            {
                                "storage": "url",
                                "name": "FOV_Grant_Application_wSGZeePZuWyQZEymL_1785736935473.pdf",
                                "url": "https://s3.amazonaws.com/img.studenthub.in/CMCVConnect_Portal/FOVGrant/Applications/wSGZeePZuWyQZEymL/DEj6TQeqAZTt7fhA7.pdf",
                                "size": "27554",
                                "type": "application/pdf"
                            },
                            {
                                "storage": "url",
                                "name": "FOV_Grant_Application_wSGZeePZuWyQZEymL_1786420453428.pdf",
                                "url": "https://s3.amazonaws.com/img.studenthub.in/CMCVConnect_Portal/FOVGrant/Applications/wSGZeePZuWyQZEymL/HLzDcoxDZ3zcoetih.pdf",
                                "size": "28344",
                                "type": "application/pdf",
                                "createdAt": {
                                    "$date": "2026-08-11T03:54:15.759Z"
                                }
                            }
                        ],
                        "financialContext": "",
                        "financialYear": {
                            "id": 2028,
                            "label": "2028-2029"
                        },
                        "fovGrantId": "26FOV00001",
                        "functionalBeds": 553,
                        "grantAmtReq": "",
                        "grantFor": {
                            "Building": true,
                            "Equipment": true,
                            "Other": true
                        },
                        "havePatiStaffWasteEquFlowsBeenPlan": "",
                        "hsptlSustainRunCostFromOwnIncome": "",
                        "isDeleted": false,
                        "landBeLegallyUsedForPropoPurpose": "",
                        "landStatus": "",
                        "missionHospital": {
                            "_id": "YPup9m97o8hKHEvWF",
                            "missionHospitalName": "Baer Christian Hospital"
                        },
                        "modified": {
                            "userId": "at8HiiygEpHuC65GF",
                            "userName": "testconnect",
                            "modifiedDate": "Mon Aug 17 2026 15:02:21 GMT+0530 (India Standard Time)"
                        },
                        "msnStatus": "Submitted",
                        "planMeetBuildCodeForHsptl": "",
                        "projectCoordinators": [{}],
                        "projectSummary": "A grant is a sum of money given by a government, foundation, or organization to an individual or group for a specific purpose. Unlike a loan, a grant does not need to be paid back, as long as you follow the rules and use the funds for the approved project",
                        "projectTitle": "A grant is a sum of money given by a government, foundation, or organization to an individual or group for a specific purpose. Unlike a loan, a grant does not need to be paid back, as long as you follow the rules and use the funds for the approved project",
                        "regInRevRecordsInTheNameOf": "",
                        "risksAndMitigation": "",
                        "saveDraft": false,
                        "saveDraft1": false,
                        "saveDraft2": false,
                        "saveDraft3": false,
                        "saveDraft4": false,
                        "saveDraft6": false,
                        "saveDraft7": false,
                        "solarInstallPlanBuild": "",
                        "fovFeedback": [
                            {
                                "date": "2026-08-18T00:00:00+05:30",
                                "comment": "Testing comments"
                            },
                            {
                                "date": "1787047906024",
                                "comment": "A grant is a sum of money given by a government, foundation, or organization to an individual or group for a specific purpose. Unlike a loan, a grant does not need to be paid back, as long as you follow the rules and use the funds for the approved project."
                            },
                            {
                                "date": "2026-08-18T00:00:00+05:30",
                                "comment": "Testing comments"
                            },
                            {
                                "date": "1787047906024",
                                "comment": "A grant is a sum of money given by a government, foundation, or organization to an individual or group for a specific purpose. Unlike a loan, a grant does not need to be paid back, as long as you follow the rules and use the funds for the approved project."
                            }
                        ],
                        "supportingDoc": [
                            {
                                "docName": "Doc 1",
                                "uploadDoc": [
                                    {
                                        "hash": "",
                                        "name": "_53841622cdbeb07dc31398aa3346b1f6_Pictures-d3acdba3-3b1c-4226-bda2-e55e1215aff9.png",
                                        "originalName": "_53841622cdbeb07dc31398aa3346b1f6_Pictures.png",
                                        "size": 301745,
                                        "storage": "url",
                                        "type": "image/png",
                                        "url": "https://s3.amazonaws.com/img.studenthub.in/CMCVConnect_Portal/FOVGrant/at8HiiygEpHuC65GF/Applications/SupportingDocuments/Doc1/_53841622cdbeb07dc31398aa3346b1f6_Pictures-d3acdba3-3b1c-4226-bda2-e55e1215aff9.png"
                                    }
                                ]
                            },
                            {
                                "docName": "Doc 2",
                                "uploadDoc": [
                                    {
                                        "storage": "url",
                                        "name": "Calender 2026-b9823cd5-4e4d-4e5b-8d6d-c378c96c632f.pdf",
                                        "url": "https://s3.amazonaws.com/img.studenthub.in/CMCVConnect_Portal/FOVGrant/26FOV00002/Applications/SupportingDocuments/Pre-order%20list-67f7703b-e628-41d6-afe2-91ccd39d4dde.xlsx",
                                        "size": 105392,
                                        "type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                                    }
                                ]
                            }
                        ],
                        "sustainability": "",
                        "totalBeds": 536,
                        "totalEquipCost": 0,
                        "totalEstimCost": "",
                        "trainedStaffToOperateEquip": "",
                        "uploadBudget": [
                            {
                                "hash": "",
                                "name": "EMAILS OF MISSION HOSPITALS-Sheet1- -1--078f9a1b-ed1e-4166-a374-3888e219c6ac.csv",
                                "originalName": "EMAILS OF MISSION HOSPITALS(Sheet1) (1).csv",
                                "size": 22518,
                                "storage": "url",
                                "type": "text/csv",
                                "url": "https://s3.amazonaws.com/img.studenthub.in/CMCVConnect_Portal/FOVGrant/at8HiiygEpHuC65GF/Applications/Budget/EMAILS%20OF%20MISSION%20HOSPITALS-Sheet1-%20-1--078f9a1b-ed1e-4166-a374-3888e219c6ac.csv"
                            }
                        ],
                        "uploadSignature": [],
                        "urgencyOfNeed": "",
                        "validityExpiryDate": "",
                        "waterGasPipePlanMadePerGuide": "",
                        "whatIsTheProblem": "A grant is a sum of money given by a government, foundation, or organization to an individual or group for a specific purpose. Unlike a loan, a grant does not need to be paid back, as long as you follow the rules and use the funds for the approved project",
                        "whatYouWillDoPurchase": "A grant is a sum of money given by a government, foundation, or organization to an individual or group for a specific purpose. Unlike a loan, a grant does not need to be paid back, as long as you follow the rules and use the funds for the approved project",
                        "whoIsAffected": "A grant is a sum of money given by a government, foundation, or organization to an individual or group for a specific purpose. Unlike a loan, a grant does not need to be paid back, as long as you follow the rules and use the funds for the approved project",
                        "whyThisIsTheRightApproach": "A grant is a sum of money given by a government, foundation, or organization to an individual or group for a specific purpose. Unlike a loan, a grant does not need to be paid back, as long as you follow the rules and use the funds for the approved project",
                        "willChangeAsAResult": "A grant is a sum of money given by a government, foundation, or organization to an individual or group for a specific purpose. Unlike a loan, a grant does not need to be paid back, as long as you follow the rules and use the funds for the approved project",
                        "willProgressBeMonitored": "A grant is a sum of money given by a government, foundation, or organization to an individual or group for a specific purpose. Unlike a loan, a grant does not need to be paid back, as long as you follow the rules and use the funds for the approved project"
                    }]

                    callback({ data: dataN || [] });
                } catch (err) {
                    console.error("Fetch error:", err);
                    callback({ data: [] });
                }
            })();
        },
        initComplete: function () {
            if (actTab === 'Approved' || actTab === 'Rejected') {
                this.api().column(5).visible(true);
            }
        },
        order: [],
        dom: "<'row'<'col-sm-12 col-md-4'l><'col-sm-12 col-md-4'B><'col-sm-12 col-md-4'f>>" +
            "<'row'<'col-sm-12'tr>>" +
            "<'row mb-1'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>",
        columns: [
            { data: "fovGrantId", title: "FOV Grant ID" },
            { data: 'applicantName', title: 'Applicant Name' },
            { data: 'missionHospital.missionHospitalName', title: 'Mission Hospital' },
            { data: 'projectTitle', title: 'Project Title', className: "col-md-3" },
            {
                data: null,
                title: 'Grant For',
                render: function (data, type, row) {
                    if (!row || !row.grantFor) return "";
                    return Object.keys(row.grantFor)
                        .filter(key => row.grantFor[key] === true || row.grantFor[key] === 'true')
                        .join(', ');
                }
            },
            {
                data: null, title: 'Missions Comments', visible: false, defaultContent: "",
                render: function (data, type, row) {
                    const feedback = row?.msnOfficeFeedback;
                    if (!Array.isArray(feedback) || feedback.length === 0) return "";
                    const lastItem = feedback[feedback.length - 1];
                    const comment = lastItem?.comment || "";
                    let dateStr = "";

                    if (lastItem?.date) {
                        dateStr = typeof lastItem.date.formatDate === 'function'
                            ? lastItem.date.formatDate()
                            : new Date(lastItem.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
                    }
                    return dateStr ? `${dateStr}<br>${comment}` : comment;
                }
            },
            { "data": null, "title": "View", "orderable": false, render: () => '<button class="viewFovApp btn btn-warning btn-sm" type="button"><i class="fas fa-eye"></i></button>' },
            { "data": null, "title": "Comments", "orderable": false, render: () => '<button class="commentsFovApp btn btn-primary btn-sm" type="button"><i class="fas fa-comment"></i></button>' },
        ],
        buttons: [
            {
                extend: 'excelHtml5',
                className: "btn btn-success",
                text: '<div><i class="far fa-file-excel"></i>&nbsp;Excel</div>',
                title: 'Fov_Applications_' + actTab + '_' + new Date().toISOString().split('T')[0],
                exportOptions: { columns: ':visible:not(:last-child):not(:nth-last-child(2))' }
            },
            {
                extend: 'pdf',
                className: 'btn btn-danger',
                text: '<div><i class="far fa-file-pdf"></i>&nbsp;PDF</div>',
                title: 'Fov_Applications_' + actTab + '_' + new Date().toISOString().split('T')[0],
                exportOptions: { columns: ':visible:not(:last-child):not(:nth-last-child(2))' }
            }
        ]
    });

    const tableEl = $('#fovApplicationTable');
    tableEl.off('click');

    $(document).off('click', '.doc-item').on('click', '.doc-item', function () {
        const $this = $(this);
        const rawUrl = $this.data('url');
        const fileType = $this.data('file-type');
        const fileTitle = $this.data('filename');
        const $currentPane = $this.closest('.tab-pane');

        $currentPane.find('.doc-item').removeClass('active');
        $this.addClass('active');

        const $viewerContainer = $currentPane.find('.doc-viewer-container');
        $viewerContainer.html(renderFunctions.buildViewerHTML(rawUrl, fileType));

        const $downloadBtn = $currentPane.find('.doc-download-btn');
        $downloadBtn.data('url', rawUrl);
        $downloadBtn.data('filename', fileTitle || 'document');
    });

    $(document).off('click', '.doc-download-btn').on('click', '.doc-download-btn', function () {
        const url = $(this).data('url');
        const filename = $(this).data('filename');
        renderFunctions.forceDownload(url, filename);
    });

    // This stays as-is — only rebuilds the modal HTML on open
    tableEl.on('click', '.viewFovApp', function () {
        const rowData = fovApplicationTable.row($(this).closest('tr')).data();
        openModal('fovAppDocs', '', '');

        const targetEl = document.getElementById('fovAppDocs');
        if (targetEl) {
            targetEl.innerHTML = renderFunctions.fovAppPDF(rowData);
        }
    });

    tableEl.on('click', '.commentsFovApp', function () {

        const rowData = fovApplicationTable.row($(this).closest('tr')).data();
        currentFovCommentApplication = rowData;
        rowData.Editor = false;
        openModal('fovAppDocs', '', '')
        const targetEl = document.getElementById('fovAppComment');

        if (!targetEl) {
            return;
        }
        targetEl.innerHTML = renderFunctions.fovAppComments(rowData);
    });
}

let fovAppStatusTable;
function loadFovAppStatusTable(actTab = 'Pending') {
    console.log("Active Tab Filter:", actTab);
    $.fn.dataTable.ext.errMode = 'none';

    if ($.fn.DataTable.isDataTable('#fovAppStatusTable')) {
        $('#fovAppStatusTable').DataTable().destroy();
        $('#fovAppStatusTable').empty();
    }

    const statusTitleMap = {
        All: "Request Status",
        Pending: "Approved by Msn",
        Approved: "Approved by Msn & FOV",
        Rejected: "Rejected by FOV",
        Reproposal: "Re-proposal"
    };
    const statusTitle = statusTitleMap[actTab] || "Status";

    fovAppStatusTable = $('#fovAppStatusTable').DataTable({
        ajax: function (data, callback, settings) {
            (async () => {
                try {
                    let query = { isDeleted: false };
                    if (actTab && actTab !== 'All') {
                        query.fovStatus = actTab;
                    }

                    const dataN = await fetchCollectionData('fetchCollectionData', {
                        collection: "FovApplication",
                        query: query,
                        options: { sort: { "added.addedDate": -1 } }
                    });

                    // const dataN = [{
                    //     "IFareLiftsRequired": "",
                    //     "acknowledged": false,
                    //     "added": {
                    //         "userName": "testconnect",
                    //         "userId": "at8HiiygEpHuC65GF",
                    //         "addedDate": "Mon Aug 17 2026 15:02:21 GMT+0530 (India Standard Time)"
                    //     },
                    //     "amtHsptlCanContribute": "",
                    //     "amtRaiseLocalOtherSrc": "",
                    //     "applicantName": "testconnect",
                    //     "appliedDate": "",
                    //     "availDepartments": [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
                    //     "balAmtToBeRaised": "",
                    //     "briefOverviewOfHsptl": "A grant is a sum of money given by a government, foundation, or organization to an individual or group for a specific purpose. Unlike a loan, a grant does not need to be paid back, as long as you follow the rules and use the funds for the approved project",
                    //     "budgetBreakdown": "",
                    //     "buildPlanAndCostEstimPrepared": "",
                    //     "buildSpaceAvailForEquip": "",
                    //     "buildingBeConstructed": "",
                    //     "catchPopServed": "",
                    //     "confirmThatHsptlHasFcraRegAndBankAcc": false,
                    //     "descriPurposeOfUse": "",
                    //     "describeOtherReqInDetail": "",
                    //     "designation": "Professor",
                    //     "disMngPlanIncEvacBeenPrepared": "",
                    //     "email": "xaviermax07@gmail.com",
                    //     "equipNeedSigniElectric": "",
                    //     "equipmentList": [],
                    //     "estimCostPerProceTest": "",
                    //     "estimRunCostSalaryPowerAmc": "",
                    //     "evidenceShowsThisIsAPriority": "A grant is a sum of money given by a government, foundation, or organization to an individual or group for a specific purpose. Unlike a loan, a grant does not need to be paid back, as long as you follow the rules and use the funds for the approved project",
                    //     "expectPatiLoadDemand": "",
                    //     "expectedStartDate": "",
                    //     "expectedcompltDate": "",
                    //     "fcraCategory": "",
                    //     "fcraRegNo": "",
                    //     "fcraSector": "",
                    //     "finalPDFDocs": [
                    //         {
                    //             "storage": "url",
                    //             "name": "FOV_Grant_Application_wSGZeePZuWyQZEymL_1785561364201.pdf",
                    //             "url": "https://s3.amazonaws.com/img.studenthub.in/CMCVConnect_Portal/FOVGrant/Applications/wSGZeePZuWyQZEymL/FXJgfo6RrSp3YwDce.pdf",
                    //             "size": "27554",
                    //             "type": "application/pdf",
                    //         },
                    //         {
                    //             "storage": "url",
                    //             "name": "FOV_Grant_Application_wSGZeePZuWyQZEymL_1785561434567.pdf",
                    //             "url": "https://s3.amazonaws.com/img.studenthub.in/CMCVConnect_Portal/FOVGrant/Applications/wSGZeePZuWyQZEymL/QN6AKgYsZMfPMnWG4.pdf",
                    //             "size": "27554",
                    //             "type": "application/pdf",
                    //         },
                    //         {
                    //             "storage": "url",
                    //             "name": "FOV_Grant_Application_wSGZeePZuWyQZEymL_1785736935473.pdf",
                    //             "url": "https://s3.amazonaws.com/img.studenthub.in/CMCVConnect_Portal/FOVGrant/Applications/wSGZeePZuWyQZEymL/DEj6TQeqAZTt7fhA7.pdf",
                    //             "size": "27554",
                    //             "type": "application/pdf"
                    //         },
                    //         {
                    //             "storage": "url",
                    //             "name": "FOV_Grant_Application_wSGZeePZuWyQZEymL_1786420453428.pdf",
                    //             "url": "https://s3.amazonaws.com/img.studenthub.in/CMCVConnect_Portal/FOVGrant/Applications/wSGZeePZuWyQZEymL/HLzDcoxDZ3zcoetih.pdf",
                    //             "size": "28344",
                    //             "type": "application/pdf",
                    //         }
                    //     ],
                    //     "financialContext": "",
                    //     "financialYear": {
                    //         "id": 2028,
                    //         "label": "2028-2029"
                    //     },
                    //     "fovGrantId": "26FOV00001",
                    //     "functionalBeds": 553,
                    //     "grantAmtReq": "",
                    //     "grantFor": {
                    //         "Building": true,
                    //         "Equipment": true,
                    //         "Other": true
                    //     },
                    //     "havePatiStaffWasteEquFlowsBeenPlan": "",
                    //     "hsptlSustainRunCostFromOwnIncome": "",
                    //     "isDeleted": false,
                    //     "landBeLegallyUsedForPropoPurpose": "",
                    //     "landStatus": "",
                    //     "missionHospital": {
                    //         "_id": "YPup9m97o8hKHEvWF",
                    //         "missionHospitalName": "Baer Christian Hospital"
                    //     },
                    //     "modified": {
                    //         "userId": "at8HiiygEpHuC65GF",
                    //         "userName": "testconnect",
                    //         "modifiedDate": "Mon Aug 17 2026 15:02:21 GMT+0530 (India Standard Time)"
                    //     },
                    //     "msnStatus": "Submitted",
                    //     "planMeetBuildCodeForHsptl": "",
                    //     "projectCoordinators": [{}],
                    //     "projectSummary": "A grant is a sum of money given by a government, foundation, or organization to an individual or group for a specific purpose. Unlike a loan, a grant does not need to be paid back, as long as you follow the rules and use the funds for the approved project",
                    //     "projectTitle": "A grant is a sum of money given by a government, foundation, or organization to an individual or group for a specific purpose. Unlike a loan, a grant does not need to be paid back, as long as you follow the rules and use the funds for the approved project",
                    //     "regInRevRecordsInTheNameOf": "",
                    //     "risksAndMitigation": "",
                    //     "saveDraft": false,
                    //     "saveDraft1": false,
                    //     "saveDraft2": false,
                    //     "saveDraft3": false,
                    //     "saveDraft4": false,
                    //     "saveDraft6": false,
                    //     "saveDraft7": false,
                    //     "solarInstallPlanBuild": "",
                    //     "fovFeedback": [
                    //         {
                    //             "date": "2026-08-18T00:00:00+05:30",
                    //             "comment": "Testing comments"
                    //         },
                    //         {
                    //             "date": "1787047906024",
                    //             "comment": "A grant is a sum of money given by a government, foundation, or organization to an individual or group for a specific purpose. Unlike a loan, a grant does not need to be paid back, as long as you follow the rules and use the funds for the approved project."
                    //         }
                    //     ],
                    //     "supportingDoc": [
                    //         {
                    //             "docName": "Doc 1",
                    //             "uploadDoc": [
                    //                 {
                    //                     "hash": "",
                    //                     "name": "_53841622cdbeb07dc31398aa3346b1f6_Pictures-d3acdba3-3b1c-4226-bda2-e55e1215aff9.png",
                    //                     "originalName": "_53841622cdbeb07dc31398aa3346b1f6_Pictures.png",
                    //                     "size": 301745,
                    //                     "storage": "url",
                    //                     "type": "image/png",
                    //                     "url": "https://s3.amazonaws.com/img.studenthub.in/CMCVConnect_Portal/FOVGrant/at8HiiygEpHuC65GF/Applications/SupportingDocuments/Doc1/_53841622cdbeb07dc31398aa3346b1f6_Pictures-d3acdba3-3b1c-4226-bda2-e55e1215aff9.png"
                    //                 }
                    //             ]
                    //         },
                    //         {
                    //             "docName": "Doc 2",
                    //             "uploadDoc": [
                    //                 {
                    //                     "storage": "url",
                    //                     "name": "Calender 2026-b9823cd5-4e4d-4e5b-8d6d-c378c96c632f.pdf",
                    //                     "url": "https://s3.amazonaws.com/img.studenthub.in/CMCVConnect_Portal/FOVGrant/at8HiiygEpHuC65GF/Applications/SupportingDocuments/Doc2/Calender%202026-b9823cd5-4e4d-4e5b-8d6d-c378c96c632f.pdf",
                    //                     "size": 105392,
                    //                     "type": "application/pdf"
                    //                 }
                    //             ]
                    //         }
                    //     ],
                    //     "sustainability": "",
                    //     "totalBeds": 536,
                    //     "totalEquipCost": 0,
                    //     "totalEstimCost": "",
                    //     "trainedStaffToOperateEquip": "",
                    //     "uploadBudget": [
                    //         {
                    //             "hash": "",
                    //             "name": "EMAILS OF MISSION HOSPITALS-Sheet1- -1--078f9a1b-ed1e-4166-a374-3888e219c6ac.csv",
                    //             "originalName": "EMAILS OF MISSION HOSPITALS(Sheet1) (1).csv",
                    //             "size": 22518,
                    //             "storage": "url",
                    //             "type": "text/csv",
                    //             "url": "https://s3.amazonaws.com/img.studenthub.in/CMCVConnect_Portal/FOVGrant/at8HiiygEpHuC65GF/Applications/Budget/EMAILS%20OF%20MISSION%20HOSPITALS-Sheet1-%20-1--078f9a1b-ed1e-4166-a374-3888e219c6ac.csv"
                    //         }
                    //     ],
                    //     "uploadSignature": [],
                    //     "urgencyOfNeed": "",
                    //     "validityExpiryDate": "",
                    //     "waterGasPipePlanMadePerGuide": "",
                    //     "whatIsTheProblem": "A grant is a sum of money given by a government, foundation, or organization to an individual or group for a specific purpose. Unlike a loan, a grant does not need to be paid back, as long as you follow the rules and use the funds for the approved project",
                    //     "whatYouWillDoPurchase": "A grant is a sum of money given by a government, foundation, or organization to an individual or group for a specific purpose. Unlike a loan, a grant does not need to be paid back, as long as you follow the rules and use the funds for the approved project",
                    //     "whoIsAffected": "A grant is a sum of money given by a government, foundation, or organization to an individual or group for a specific purpose. Unlike a loan, a grant does not need to be paid back, as long as you follow the rules and use the funds for the approved project",
                    //     "whyThisIsTheRightApproach": "A grant is a sum of money given by a government, foundation, or organization to an individual or group for a specific purpose. Unlike a loan, a grant does not need to be paid back, as long as you follow the rules and use the funds for the approved project",
                    //     "willChangeAsAResult": "A grant is a sum of money given by a government, foundation, or organization to an individual or group for a specific purpose. Unlike a loan, a grant does not need to be paid back, as long as you follow the rules and use the funds for the approved project",
                    //     "willProgressBeMonitored": "A grant is a sum of money given by a government, foundation, or organization to an individual or group for a specific purpose. Unlike a loan, a grant does not need to be paid back, as long as you follow the rules and use the funds for the approved project"
                    // }]

                    callback({ data: dataN || [] });
                } catch (err) {
                    console.error("Fetch error:", err);
                    callback({ data: [] });
                }
            })();
        },
        initComplete: function () {
            if (actTab === 'Pending') {
                this.api().column(4).visible(true);
            } else if (actTab === 'Rejected') {
                this.api().column(4).visible(true);
                this.api().column(5).visible(true);
            }
        },
        order: [],
        dom: "<'row'<'col-sm-12 col-md-4'l><'col-sm-12 col-md-4'B><'col-sm-12 col-md-4'f>>" +
            "<'row'<'col-sm-12'tr>>" +
            "<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>",
        columns: [
            { data: 'applicantName', title: 'Applicant Name' },
            { data: 'missionHospital.missionHospitalName', title: 'Mission Hospital' },
            { data: 'projectTitle', title: 'Project Title' },
            {
                data: null,
                title: 'Grant For',
                render: function (data, type, row) {
                    if (!row || !row.grantFor) return "";
                    return Object.keys(row.grantFor)
                        .filter(key => row.grantFor[key] === true || row.grantFor[key] === 'true')
                        .join(', ');
                }
            },
            {
                data: null, title: 'Missions Comments', visible: false, defaultContent: "",
                render: function (data, type, row) {
                    const feedback = row?.msnOfficeFeedback;
                    if (!Array.isArray(feedback) || feedback.length === 0) return "";
                    const lastItem = feedback[feedback.length - 1];
                    const comment = lastItem?.comment || "";
                    let dateStr = "";

                    if (lastItem?.date) {
                        dateStr = typeof lastItem.date.formatDate === 'function'
                            ? lastItem.date.formatDate()
                            : new Date(lastItem.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
                    }
                    return dateStr ? `${dateStr}<br>${comment}` : comment;
                }
            },
            {
                data: null, title: 'FOV Comments', visible: false, defaultContent: "",
                render: function (data, type, row) {
                    const feedback = row?.fovFeedback;
                    if (!Array.isArray(feedback) || feedback.length === 0) return "";
                    const lastItem = feedback[feedback.length - 1];
                    const comment = lastItem?.comment || "";
                    let dateStr = "";

                    if (lastItem?.date) {
                        dateStr = typeof lastItem.date.formatDate === 'function'
                            ? lastItem.date.formatDate()
                            : new Date(lastItem.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
                    }
                    return dateStr ? `${dateStr}<br>${comment}` : comment;
                }
            },
            {
                data: 'fovStatus',
                title: statusTitle,
                render: function (data, type, row) {
                    if (actTab !== 'All') {
                        if (actTab === 'Rejected') {
                            return '<button class="reopenManager btn btn-warning btn-sm">Reopen</button>';
                        } else if (actTab === 'Pending') {
                            return `<button class="msnApprovedManager btn btn-success btn-sm">Approve</button>
                                    <button class="resubmitManager btn btn-warning btn-sm my-1">Reproposal</button>
                                    <button class="rejectManager btn btn-danger btn-sm">Reject</button>`;
                        } else if (actTab === 'Approved') {
                            return `<button class="rejectManager btn btn-danger btn-sm">Reject</button>`;
                        }
                    }
                    return data || '';
                }
            },
            { "data": null, "title": "View", "orderable": false, render: () => '<button class="viewFovApp btn btn-warning btn-sm" type="button"><i class="fas fa-eye"></i></button>' },
            { "data": null, "title": "Comments", "orderable": false, render: () => '<button class="commentsFovApp btn btn-primary btn-sm" type="button"><i class="fas fa-comment"></i></button>' },
        ],
        buttons: [
            {
                extend: 'excelHtml5',
                className: "btn btn-success",
                text: '<div><i class="far fa-file-excel"></i>&nbsp;Excel</div>',
                title: 'Fov_Applications_' + actTab + '_' + new Date().toISOString().split('T')[0],
                exportOptions: { columns: ':visible:not(:last-child):not(:nth-last-child(2))' }
            },
            {
                extend: 'pdf',
                className: 'btn btn-danger',
                text: '<div><i class="far fa-file-pdf"></i>&nbsp;PDF</div>',
                title: 'Fov_Applications_' + actTab + '_' + new Date().toISOString().split('T')[0],
                exportOptions: { columns: ':visible:not(:last-child):not(:nth-last-child(2))' }
            }
        ]
    });

    const tableEl = $('#fovAppStatusTable');
    tableEl.off('click');

    $(document).off('click', '.doc-item').on('click', '.doc-item', function () {
        const $this = $(this);
        const rawUrl = $this.data('url');
        const fileType = $this.data('file-type');
        const fileTitle = $this.data('filename');
        const $currentPane = $this.closest('.tab-pane');

        $currentPane.find('.doc-item').removeClass('active');
        $this.addClass('active');

        const $viewerContainer = $currentPane.find('.doc-viewer-container');
        $viewerContainer.html(renderFunctions.buildViewerHTML(rawUrl, fileType));

        const $downloadBtn = $currentPane.find('.doc-download-btn');
        $downloadBtn.data('url', rawUrl);
        $downloadBtn.data('filename', fileTitle || 'document');
    });

    $(document).off('click', '.doc-download-btn').on('click', '.doc-download-btn', function () {
        const url = $(this).data('url');
        const filename = $(this).data('filename');
        renderFunctions.forceDownload(url, filename);
    });

    // This stays as-is — only rebuilds the modal HTML on open
    tableEl.on('click', '.viewFovApp', function () {
        const rowData = fovAppStatusTable.row($(this).closest('tr')).data();
        openModal('fovAppDocs', '', '');

        const targetEl = document.getElementById('fovAppDocs');
        if (targetEl) {
            targetEl.innerHTML = renderFunctions.fovAppPDF(rowData);
        }
    });

    tableEl.on('click', '.commentsFovApp', function () {

        const rowData = fovAppStatusTable.row($(this).closest('tr')).data();
        currentFovCommentApplication = rowData;
        rowData.Editor = true;
        openModal('fovAppDocs', '', '')
        const targetEl = document.getElementById('fovAppComment');

        if (!targetEl) {
            return;
        }
        targetEl.innerHTML = renderFunctions.fovAppComments(rowData);

        // Initialize Quill
        initFovCommentEditor();
    }
    );

    $(document).on('click', '#saveFovComment', async function () {

        const button = $(this);
        const fovId = button.attr('data-fov-id');
        const errorEl = document.getElementById('fovCommentError');

        // Validate FOV ID
        if (!fovId) {
            errorEl.textContent = 'Application ID is missing.';
            return;
        }

        // Validate editor
        if (!fovCommentEditor) {
            errorEl.textContent = 'Comment editor is not initialized.';
            return;
        }

        const commentText = fovCommentEditor.getText().trim();
        if (!commentText) {
            errorEl.textContent = 'Please enter a comment.';
            return;
        }

        const commentHtml = fovCommentEditor.root.innerHTML.trim();
        errorEl.textContent = '';


        // Current user
        const userId = usrDetails?.data?._id || '';
        const userName = usrDetails?.data?.profile?.name || 'Admin';
        const feedback = {
            date: new Date().toISOString(),
            comment: commentHtml,
            userId: userId,
            userName: userName
        };

        // Loading
        button.prop('disabled', true).html(`
                <span class="spinner-border spinner-border-sm me-1"></span>
                Saving...
            `);

        try {
            console.log('Adding FOV feedback:', feedback);

            // PUSH COMMENT
            const result = await fetchCollectionData('updateCollectionData',
                {
                    collection: 'FovApplication',
                    query: {
                        selector: { _id: fovId },
                        data: {
                            $push: {
                                fovFeedback: feedback
                            }
                        }
                    }
                }
            );
            console.log('Add comment response:', result);

            // Check API error
            if (result?.data?.error || result?.data?.reason) {

                throw new Error(result?.data?.reason || 'Unable to save comment.');
            }

            // Update local row
            if (currentFovCommentApplication) {

                if (!Array.isArray(currentFovCommentApplication.fovFeedback)) {
                    currentFovCommentApplication.fovFeedback = [];
                }
                currentFovCommentApplication.fovFeedback.push(feedback);
            }

            // Re-render
            refreshFovCommentsUI();

            console.log('FOV comment added successfully.');

        } catch (error) {
            console.error('Error adding FOV comment:', error);
            errorEl.textContent = error.message || 'Unable to save comment.';
        } finally {

            button.prop('disabled', false).html(`
                    <i class="fa fa-paper-plane me-1"></i>
                    Add Comment
                `);
        }
    });

    $(document).on('click', '#saveFovComment', async function () {

        // If editing, use update logic
        if (editingFovCommentIndex !== null) {
            await updateFovComment(editingFovCommentIndex);
            return;
        }

        // Otherwise the existing add logic runs
        await addFovComment($(this));
    });

    $(document).on('click', '.edit-fov-comment', function () {

        const index = Number($(this).attr('data-index'));

        if (!currentFovCommentApplication) {
            return;
        }

        const comments = currentFovCommentApplication.fovFeedback || [];
        const comment = comments[index];

        if (!comment) {
            return;
        }
        editingFovCommentIndex = index;

        // Load comment into editor
        if (fovCommentEditor) {
            fovCommentEditor.root.innerHTML = comment.comment || '';
        }

        // Change UI to Edit mode
        $('#saveFovComment').html(`<i class="fa fa-save me-1"></i>Update Comment`);


        // Add cancel button
        // if it doesn't already exist
        if (!document.getElementById('cancelFovCommentEdit')) {

            $('#saveFovComment').before(`
                    <button type="button" class="btn btn-secondary me-2" id="cancelFovCommentEdit">
                        Cancel
                    </button>
                `);
        }

        // Scroll to editor
        document.getElementById('fovCommentEditorSection')?.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest'
        });

    }
    );

    $(document).on('click', '.delete-fov-comment', async function () {
        const index = Number($(this).attr('data-index'));
        await deleteFovComment(index);
    });

    tableEl.on('click', '.reopenManager', function () {
        const rowData = fovAppStatusTable.row($(this).closest('tr')).data();
        if (rowData) RequestChangeBtn(rowData._id, 'Pending');
    });

    tableEl.on('click', '.rejectManager', function () {
        const rowData = fovAppStatusTable.row($(this).closest('tr')).data();
        if (rowData) RequestChangeBtn(rowData._id, 'Rejected');
    });

    tableEl.on('click', '.msnApprovedManager', function () {
        const rowData = fovAppStatusTable.row($(this).closest('tr')).data();
        if (rowData) RequestChangeBtn(rowData._id, 'Approved');
    });

    tableEl.on('click', '.resubmitManager', function () {
        const rowData = fovAppStatusTable.row($(this).closest('tr')).data();
        if (rowData) RequestChangeBtn(rowData._id, 'Reproposal');
    });
}

function RequestChangeBtn(reqId, reqType) {
    const query = { _id: reqId };
    const modified = {
        userId: (Meteor.userId()) ? Meteor.userId() : '',
        userName: (Meteor.user()) ? Meteor.user().profile.name : '',
        modifiedDate: new Date()
    };
    let update = {
        $set: {
            fovStatus: reqType,
            modified: modified
        }
    };

    if (reqType === 'Reproposal' || reqType === 'Rejected') {
        update.$set.msnStatus = 'Submitted';
    }

    fetchCollectionData('updateCollectionData', {
        collection: "FovApplication",
        query: { selector: query, data: update }
    }).then(function (resp) {
        Bert.alert('FOV Application updated successfully', 'success', 'fixed-top');
        $('#fovAppStatusTable').DataTable().ajax.reload();
    }).catch(err => {
        console.error("Update failed:", err);})
    
    }
// Injects the spinner's keyframes once (safe to call every time
// samProjectApplication() runs, e.g. each time the modal reopens).
function ensureSamLoaderStyles() {
    if (document.getElementById('samLoaderStyles')) return;
    const style = document.createElement('style');
    style.id = 'samLoaderStyles';
    style.textContent = `
        @keyframes samSpin { to { transform: rotate(360deg); } }
        #samFormLoader {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 3.5rem 1rem;
        }
        #samFormLoader .sam-spinner {
            width: 48px;
            height: 48px;
            border: 4px solid rgba(174, 154, 100, 0.25); /* gold, low opacity */
            border-top-color: #ae9a64; /* SAM gold */
            border-radius: 50%;
            animation: samSpin 0.8s linear infinite;
        }
        #samFormLoader p {
            margin-top: 1rem;
            color: #ae9a64;
            font-weight: 600;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        }
    `;
    document.head.appendChild(style);
}

function showSamFormLoader(container) {
    ensureSamLoaderStyles();
    container.innerHTML = `
        <div id="samFormLoader">
            <div class="sam-spinner"></div>
            <p>Loading application form&hellip;</p>
        </div>
    `;
}

function hideSamFormLoader() {
    document.getElementById('samFormLoader')?.remove();
}

async function samProjectApplication() {
    const container = document.getElementById('genFormIO');

    // Fetching the schema (and Form.io building the form after) can take a
    // few seconds — show a gold loading spinner in the meantime.
    showSamFormLoader(container);

    const formData = { collection: "FormIO", query: { formKey: "samProjectApplicationForm" } };
    const samProjectForm = await fetchCollectionData('fetchCollectionData', formData);

    Formio.createForm(container, samProjectForm.data[0], {
        hide: { style: true, missionOfficeUse: true }
    }).then(function (form) {
        form.ready.then(async () => {
            // Formio.createForm() already replaces the container's markup
            // (clearing the loader) once it builds the form, but this is a
            // safety net in case it ever renders alongside instead of over it.
            hideSamFormLoader();

            const username = usrDetails?.data?.profile?.name || '';
            form.getComponent('applicantName')?.setValue(username);

            console.log("Form ready");

            form.on('submit', async (submitForm) => {
                const userInfo = usrDetails?.data;
                const userId = userInfo?._id || '';
                const fnlData = submitForm.data;
                fnlData.isDeleted = false;
                fnlData.added = {
                    userName: username,
                    userId: userId,
                    addedDate: new Date()
                };
                console.log("SAMProjectData : ", fnlData);
                const insertQuery = { collection: "samProjectApplicationForm", query: fnlData };
                // console.log("insertQuery", insertQuery);
                await fetchCollectionData('insertCollectionData', insertQuery);

                alert("“Application submitted.”");
                closeModal();
            });

        });

    });
}

//Asset management starts
async function loadAssets() {
//Asset management starts

   function svgImage(svg){
    return "data:image/svg+xml," + encodeURIComponent(svg);
  }
  var ILLUSTRATIONS = {
    placeholder:
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160">' +
        '<rect width="160" height="160" rx="24" fill="#ECE9E1"/>' +
        '<rect x="44" y="52" width="72" height="56" rx="10" fill="#ffffff" stroke="#CBD1DA" stroke-width="3"/>' +
        '<path d="M44 92 L68 68 L86 84 L100 70 L116 92" stroke="#8B93A1" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>' +
        '<circle cx="66" cy="66" r="6" fill="#8B93A1"/>' +
      '</svg>'
  };
  var PLACEHOLDER_IMAGE = svgImage(ILLUSTRATIONS.placeholder);

  /* ---------------- Emoji stand-ins for photos ----------------
     Real items don't have photos yet (that comes with the Mongo/DB
     migration — see the Mongo TODOs around this file), so every item shows
     an emoji on a soft tinted tile instead of a hand-drawn illustration or
     a plain placeholder icon. Nothing downstream needs to know the
     difference: emojiImage() still returns a data:image/svg+xml URI, so it
     drops straight into item.images / itemImages() / photoTag() / the
     gallery / the lightbox exactly like a real photo URL would later. */
  function emojiImage(emoji, bgHex){
    return svgImage(
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160">' +
        '<rect width="160" height="160" rx="24" fill="' + (bgHex || "#ECE9E1") + '"/>' +
        '<text x="80" y="98" font-size="72" text-anchor="middle" dominant-baseline="middle">' + emoji + '</text>' +
      '</svg>'
    );
  }
  // Background tint per category — same four hues the old hand-drawn
  // illustrations used, just keyed to the categories that actually appear
  // in the "What type is this?" filter (see CATEGORY_COLOR below, which
  // keys the *metadata* var(--cat-*) the same way).
  var EMOJI_BG_HEX = {
    "Computer": "#E3EDF9",
    "Furniture": "#E7ECF3",
    "Accessory": "#FBF0DD",
    "Spare": "#E3EDF9",
    "Consumables": "#FBF0DD",
    "Instrument": "#E3EDF9"
  };
  // Keyword match against the item name — good enough for a stand-in photo;
  // falls back to a generic medical-instrument emoji when nothing matches.
  function emojiFor(name){
    var n = (name || "").toLowerCase();
    if(n.indexOf("wheel chair") !== -1 || n.indexOf("wheelchair") !== -1) return "♿";
    if(n.indexOf("chair") !== -1) return "🪑";
    if(n.indexOf("sanitizer") !== -1) return "🧴";
    if(n.indexOf("scissors") !== -1) return "✂️";
    if(n.indexOf("tray") !== -1) return "🧺";
    if(n.indexOf("cup") !== -1) return "🥣";
    if(n.indexOf("suction") !== -1) return "🌀";
    if(n.indexOf("computer") !== -1 || n.indexOf("laptop") !== -1 || n.indexOf("desktop") !== -1) return "💻";
    if(n.indexOf("bed") !== -1) return "🛏️";
    if(["clamp","forceps","retractor","holder","clip","devers"].some(function(k){ return n.indexOf(k) !== -1; })) return "🗜️";
    return "🩺";
  }

  /* ---------------- Mission Hospitals (see Mongo TODO below) ----------------
     TODO (Mongo migration): replace with fetch('/api/missionHospitals') —
     the same live dropdown source used elsewhere in Connect (LegalHelp /
     ManpowerRequest already do this — see mission-asset-support-summary.md
     §6). Requests now record WHICH hospital they're for instead of the old
     hardcoded "Bethesda Mission Hospital" line, since usrDetails carries no
     hospital identity to infer it from. */
  var MISSION_HOSPITALS = [
    "Bethesda Mission Hospital",
    "Duncan Hospital, Raxaul",
    "Makunda Christian Hospital"
  ];
  function populateHospitalSelect(sel){
    if(!sel) return;
    var opts = ['<option value="" disabled selected>Select your hospital</option>'].concat(
      MISSION_HOSPITALS.map(function(h){ return '<option value="' + h + '">' + h + '</option>'; })
    );
    sel.innerHTML = opts.join("");
  }

  /* ---------------- Hero carousel ----------------
     Real photos now (replacing the earlier navy/gold generated-icon
     placeholders — bannerSlide()/HC_ICON_* are gone, this is the "real S3
     URL" the old TODO here was waiting on). title is kept per slide as
     its alt text only — there's no per-slide caption on screen any more,
     see the "No per-slide caption" note in renderCarousel() below; the
     fixed heading/subtitle is the .hero-intro-overlay in equipments.html. */
  var CAROUSEL_SLIDES = [
    { image: "https://s3.amazonaws.com/img.studenthub.in/CMCVConnect_Portal/Pictures/_ccf78344fa7c5a757d6e73f2a3dd1d42_Pictures.jpeg", title: "CMC V Connect — Equipment & Resources" },
    { image: "https://s3.amazonaws.com/img.studenthub.in/CMCVConnect_Portal/Pictures/_2269f308e1a93aea5d3eb315fd52cb07_Pictures.jpg", title: "CMC V Connect — Equipment & Resources" },
    { image: "https://s3.amazonaws.com/img.studenthub.in/CMCVConnect_Portal/Pictures/_45e4bd81e470c59c0e8c6ff8325213fb_Pictures.jpg", title: "CMC V Connect — Equipment & Resources" },
    { image: "https://s3.amazonaws.com/img.studenthub.in/CMCVConnect_Portal/Pictures/_b925445e5e3904f4edb0cf9b687f6280_Pictures.jpg", title: "CMC V Connect — Equipment & Resources" },
    { image: "https://s3.amazonaws.com/img.studenthub.in/CMCVConnect_Portal/Pictures/_56dd2c06687d44fa93422717f686d21f_Pictures.jpg", title: "CMC V Connect — Equipment & Resources" },
    { image: "https://s3.amazonaws.com/img.studenthub.in/CMCVConnect_Portal/Pictures/_ec3043ca05a909a7b05cf914d71e6bc5_Pictures.jpg", title: "CMC V Connect — Equipment & Resources" }
  ];

  /* ---------------- Asset register (see Mongo TODO below) ----------------
     Was a hardcoded `var EQUIPMENT = [...]` — now a small local store
     (loadEquipment()/saveEquipment(), same shape as loadApps()/saveApps()
     below) seeded with these three items, so the "Add Equipment" form
     further down can push real entered items into it and the register
     shows them immediately instead of only ever showing hardcoded demo
     data. TODO (Mongo migration): replace loadEquipment() with
     fetch('/api/assets') and saveEquipment()'s caller (the asset-form
     submit handler) with insertCollectionData({ collection: "Asset", ... })
     — that's the "load function" this local store stands in for. */
  // Bumped to v2 — this replaces the earlier hand-written demo items with
  // the real Asset Recycling Committee list, and anyone with the old v1
  // data cached in localStorage should see the new list, not their stale
  // demo data merged in with it.
  var ASSET_STORE_KEY = "cmc-equip-assets-v2";
  var ASSET_SEQ_KEY = "cmc-equip-asset-seq-v2";
  var EQUIPMENT_SEED = [
    {
      id: "farc-2-sanitizer-machine",
      code: "FARC-2",
      name: "Sanitizer Machine",
      model: "Anaesthesiology (Rm.No. 8 ABC Block)",
      department: "Anaesthesiology (Rm.No. 8 ABC Block)",
      category: "Instrument",
      catColor: "var(--cat-surgical)",
      images: [emojiImage("🧴", "#E3EDF9")],
      units: 1,
      condition: "Good — Available for reuse",
      conditionClass: "good",
      description: "Released for recycling by Anaesthesiology (Rm.No. 8 ABC Block). FARC Minute No. 681 / 15 Sep 2026. Sl.No. 2.",
      addedISO: "2026-09-15",
      closeDate: "29 Nov",
      closeDateFull: "29 November 2026",
      closeDateISO: "2026-11-29",
      collectDeadlineISO: null,
      collectDeadline: null,
      situationPh: "e.g. Tell us about the situation this would help solve...",
      impactPh: "e.g. Tell us how you'd use it and how you'd collect it...",
      departmentPh: "e.g. Which department would use this"
    },
    {
      id: "farc-3-sanitizer-machine",
      code: "FARC-3",
      name: "Sanitizer Machine",
      model: "Anaesthesiology (Rm.No. 8 ABC Block)",
      department: "Anaesthesiology (Rm.No. 8 ABC Block)",
      category: "Instrument",
      catColor: "var(--cat-surgical)",
      images: [emojiImage("🧴", "#E3EDF9")],
      units: 1,
      condition: "Good — Available for reuse",
      conditionClass: "good",
      description: "Released for recycling by Anaesthesiology (Rm.No. 8 ABC Block). FARC Minute No. 681 / 15 Sep 2026. Sl.No. 3.",
      addedISO: "2026-09-15",
      closeDate: "29 Nov",
      closeDateFull: "29 November 2026",
      closeDateISO: "2026-11-29",
      collectDeadlineISO: null,
      collectDeadline: null,
      situationPh: "e.g. Tell us about the situation this would help solve...",
      impactPh: "e.g. Tell us how you'd use it and how you'd collect it...",
      departmentPh: "e.g. Which department would use this"
    },
    {
      id: "farc-24-metzenbaum-scissors-b-h-cd-7-pilling",
      code: "FARC-24",
      name: "Metzenbaum Scissors B/H Cd. 7\" (Pilling)",
      model: "Nursing CBOR",
      department: "Nursing CBOR",
      category: "Instrument",
      catColor: "var(--cat-surgical)",
      images: [emojiImage("✂️", "#E3EDF9")],
      units: 1,
      condition: "Good — Available for reuse",
      conditionClass: "good",
      description: "Released for recycling by Nursing CBOR. FARC Minute No. 681 / 15 Sep 2026. Sl.No. 24.",
      addedISO: "2026-09-15",
      closeDate: "29 Nov",
      closeDateFull: "29 November 2026",
      closeDateISO: "2026-11-29",
      collectDeadlineISO: null,
      collectDeadline: null,
      situationPh: "e.g. Tell us about the situation this would help solve...",
      impactPh: "e.g. Tell us how you'd use it and how you'd collect it...",
      departmentPh: "e.g. Which department would use this"
    },
    {
      id: "farc-27-self-retaining-retractor",
      code: "FARC-27",
      name: "Self Retaining Retractor",
      model: "Nursing CBOR",
      department: "Nursing CBOR",
      category: "Instrument",
      catColor: "var(--cat-surgical)",
      images: [emojiImage("🗜️", "#E3EDF9")],
      units: 1,
      condition: "Good — Available for reuse",
      conditionClass: "good",
      description: "Released for recycling by Nursing CBOR. FARC Minute No. 681 / 15 Sep 2026. Sl.No. 27.",
      addedISO: "2026-09-15",
      closeDate: "29 Nov",
      closeDateFull: "29 November 2026",
      closeDateISO: "2026-11-29",
      collectDeadlineISO: null,
      collectDeadline: null,
      situationPh: "e.g. Tell us about the situation this would help solve...",
      impactPh: "e.g. Tell us how you'd use it and how you'd collect it...",
      departmentPh: "e.g. Which department would use this"
    },
    {
      id: "farc-58-revolving-chair",
      code: "FARC-58",
      name: "Revolving Chair",
      model: "Ward O5 West",
      department: "Ward O5 West",
      category: "Furniture",
      catColor: "var(--cat-furniture)",
      images: [emojiImage("🪑", "#E7ECF3")],
      units: 1,
      condition: "Good — Available for reuse",
      conditionClass: "good",
      description: "Released for recycling by Ward O5 West. FARC Minute No. 681 / 15 Sep 2026. Sl.No. 58.",
      addedISO: "2026-09-15",
      closeDate: "29 Nov",
      closeDateFull: "29 November 2026",
      closeDateISO: "2026-11-29",
      collectDeadlineISO: null,
      collectDeadline: null,
      situationPh: "e.g. Tell us about the situation this would help solve...",
      impactPh: "e.g. Tell us how you'd use it and how you'd collect it...",
      departmentPh: "e.g. Which department would use this"
    },
    {
      id: "farc-59-wheel-chair-foldable",
      code: "FARC-59",
      name: "Wheel Chair (Foldable)",
      model: "Ward O5 West",
      department: "Ward O5 West",
      category: "Furniture",
      catColor: "var(--cat-furniture)",
      images: [emojiImage("♿", "#E7ECF3")],
      units: 1,
      condition: "Good — Available for reuse",
      conditionClass: "good",
      description: "Released for recycling by Ward O5 West. FARC Minute No. 681 / 15 Sep 2026. Sl.No. 59.",
      addedISO: "2026-09-15",
      closeDate: "29 Nov",
      closeDateFull: "29 November 2026",
      closeDateISO: "2026-11-29",
      collectDeadlineISO: null,
      collectDeadline: null,
      situationPh: "e.g. Tell us about the situation this would help solve...",
      impactPh: "e.g. Tell us how you'd use it and how you'd collect it...",
      departmentPh: "e.g. Which department would use this"
    },
    {
      id: "warc-2690-needle-holder-5",
      code: "WARC-2690",
      name: "Needle Holder 5\"",
      model: "Nursing CBOR",
      department: "Nursing CBOR",
      category: "Instrument",
      catColor: "var(--cat-surgical)",
      images: [emojiImage("🗜️", "#E3EDF9")],
      units: 1,
      condition: "Good — Available for reuse",
      conditionClass: "good",
      description: "Released for recycling by Nursing CBOR. WARC Minute No. 757 / 11 Sep 2026. Reqn. No. 2690.",
      addedISO: "2026-09-11",
      closeDate: "25 Nov",
      closeDateFull: "25 November 2026",
      closeDateISO: "2026-11-25",
      collectDeadlineISO: null,
      collectDeadline: null,
      situationPh: "e.g. Tell us about the situation this would help solve...",
      impactPh: "e.g. Tell us how you'd use it and how you'd collect it...",
      departmentPh: "e.g. Which department would use this"
    },
    {
      id: "warc-2690-needle-holder-6",
      code: "WARC-2690",
      name: "Needle Holder 6\"",
      model: "Nursing CBOR",
      department: "Nursing CBOR",
      category: "Instrument",
      catColor: "var(--cat-surgical)",
      images: [emojiImage("🗜️", "#E3EDF9")],
      units: 1,
      condition: "Good — Available for reuse",
      conditionClass: "good",
      description: "Released for recycling by Nursing CBOR. WARC Minute No. 757 / 11 Sep 2026. Reqn. No. 2690.",
      addedISO: "2026-09-11",
      closeDate: "25 Nov",
      closeDateFull: "25 November 2026",
      closeDateISO: "2026-11-25",
      collectDeadlineISO: null,
      collectDeadline: null,
      situationPh: "e.g. Tell us about the situation this would help solve...",
      impactPh: "e.g. Tell us how you'd use it and how you'd collect it...",
      departmentPh: "e.g. Which department would use this"
    },
    {
      id: "warc-2690-neeedle-holder-7",
      code: "WARC-2690",
      name: "Neeedle Holder 7\"",
      model: "Nursing CBOR",
      department: "Nursing CBOR",
      category: "Instrument",
      catColor: "var(--cat-surgical)",
      images: [emojiImage("🗜️", "#E3EDF9")],
      units: 1,
      condition: "Good — Available for reuse",
      conditionClass: "good",
      description: "Released for recycling by Nursing CBOR. WARC Minute No. 757 / 11 Sep 2026. Reqn. No. 2690.",
      addedISO: "2026-09-11",
      closeDate: "25 Nov",
      closeDateFull: "25 November 2026",
      closeDateISO: "2026-11-25",
      collectDeadlineISO: null,
      collectDeadline: null,
      situationPh: "e.g. Tell us about the situation this would help solve...",
      impactPh: "e.g. Tell us how you'd use it and how you'd collect it...",
      departmentPh: "e.g. Which department would use this"
    },
    {
      id: "warc-2690-needle-holder-8",
      code: "WARC-2690",
      name: "Needle Holder 8\"",
      model: "Nursing CBOR",
      department: "Nursing CBOR",
      category: "Instrument",
      catColor: "var(--cat-surgical)",
      images: [emojiImage("🗜️", "#E3EDF9")],
      units: 1,
      condition: "Good — Available for reuse",
      conditionClass: "good",
      description: "Released for recycling by Nursing CBOR. WARC Minute No. 757 / 11 Sep 2026. Reqn. No. 2690.",
      addedISO: "2026-09-11",
      closeDate: "25 Nov",
      closeDateFull: "25 November 2026",
      closeDateISO: "2026-11-25",
      collectDeadlineISO: null,
      collectDeadline: null,
      situationPh: "e.g. Tell us about the situation this would help solve...",
      impactPh: "e.g. Tell us how you'd use it and how you'd collect it...",
      departmentPh: "e.g. Which department would use this"
    },
    {
      id: "warc-2690-iodine-cup",
      code: "WARC-2690",
      name: "Iodine Cup",
      model: "Nursing CBOR",
      department: "Nursing CBOR",
      category: "Instrument",
      catColor: "var(--cat-surgical)",
      images: [emojiImage("🥣", "#E3EDF9")],
      units: 10,
      condition: "Good — Available for reuse",
      conditionClass: "good",
      description: "Released for recycling by Nursing CBOR. WARC Minute No. 757 / 11 Sep 2026. Reqn. No. 2690.",
      addedISO: "2026-09-11",
      closeDate: "25 Nov",
      closeDateFull: "25 November 2026",
      closeDateISO: "2026-11-25",
      collectDeadlineISO: null,
      collectDeadline: null,
      situationPh: "e.g. Tell us about the situation this would help solve...",
      impactPh: "e.g. Tell us how you'd use it and how you'd collect it...",
      departmentPh: "e.g. Which department would use this"
    },
    {
      id: "warc-2690-sponge-holder-10",
      code: "WARC-2690",
      name: "Sponge Holder 10\"",
      model: "Nursing CBOR",
      department: "Nursing CBOR",
      category: "Instrument",
      catColor: "var(--cat-surgical)",
      images: [emojiImage("🗜️", "#E3EDF9")],
      units: 9,
      condition: "Good — Available for reuse",
      conditionClass: "good",
      description: "Released for recycling by Nursing CBOR. WARC Minute No. 757 / 11 Sep 2026. Reqn. No. 2690.",
      addedISO: "2026-09-11",
      closeDate: "25 Nov",
      closeDateFull: "25 November 2026",
      closeDateISO: "2026-11-25",
      collectDeadlineISO: null,
      collectDeadline: null,
      situationPh: "e.g. Tell us about the situation this would help solve...",
      impactPh: "e.g. Tell us how you'd use it and how you'd collect it...",
      departmentPh: "e.g. Which department would use this"
    },
    {
      id: "warc-2690-artery-clamp-cd-6",
      code: "WARC-2690",
      name: "Artery Clamp Cd. 6\"",
      model: "Nursing CBOR",
      department: "Nursing CBOR",
      category: "Instrument",
      catColor: "var(--cat-surgical)",
      images: [emojiImage("🗜️", "#E3EDF9")],
      units: 1,
      condition: "Good — Available for reuse",
      conditionClass: "good",
      description: "Released for recycling by Nursing CBOR. WARC Minute No. 757 / 11 Sep 2026. Reqn. No. 2690.",
      addedISO: "2026-09-11",
      closeDate: "25 Nov",
      closeDateFull: "25 November 2026",
      closeDateISO: "2026-11-25",
      collectDeadlineISO: null,
      collectDeadline: null,
      situationPh: "e.g. Tell us about the situation this would help solve...",
      impactPh: "e.g. Tell us how you'd use it and how you'd collect it...",
      departmentPh: "e.g. Which department would use this"
    },
    {
      id: "warc-2690-nt-dissecting-forceps-4",
      code: "WARC-2690",
      name: "NT Dissecting Forceps 4\"",
      model: "Nursing CBOR",
      department: "Nursing CBOR",
      category: "Instrument",
      catColor: "var(--cat-surgical)",
      images: [emojiImage("🗜️", "#E3EDF9")],
      units: 1,
      condition: "Good — Available for reuse",
      conditionClass: "good",
      description: "Released for recycling by Nursing CBOR. WARC Minute No. 757 / 11 Sep 2026. Reqn. No. 2690.",
      addedISO: "2026-09-11",
      closeDate: "25 Nov",
      closeDateFull: "25 November 2026",
      closeDateISO: "2026-11-25",
      collectDeadlineISO: null,
      collectDeadline: null,
      situationPh: "e.g. Tell us about the situation this would help solve...",
      impactPh: "e.g. Tell us how you'd use it and how you'd collect it...",
      departmentPh: "e.g. Which department would use this"
    },
    {
      id: "warc-2690-adson-toothed-forceps",
      code: "WARC-2690",
      name: "Adson Toothed Forceps",
      model: "Nursing CBOR",
      department: "Nursing CBOR",
      category: "Instrument",
      catColor: "var(--cat-surgical)",
      images: [emojiImage("🗜️", "#E3EDF9")],
      units: 1,
      condition: "Good — Available for reuse",
      conditionClass: "good",
      description: "Released for recycling by Nursing CBOR. WARC Minute No. 757 / 11 Sep 2026. Reqn. No. 2690.",
      addedISO: "2026-09-11",
      closeDate: "25 Nov",
      closeDateFull: "25 November 2026",
      closeDateISO: "2026-11-25",
      collectDeadlineISO: null,
      collectDeadline: null,
      situationPh: "e.g. Tell us about the situation this would help solve...",
      impactPh: "e.g. Tell us how you'd use it and how you'd collect it...",
      departmentPh: "e.g. Which department would use this"
    },
    {
      id: "warc-2690-allis-clamp-6",
      code: "WARC-2690",
      name: "Allis Clamp 6\"",
      model: "Nursing CBOR",
      department: "Nursing CBOR",
      category: "Instrument",
      catColor: "var(--cat-surgical)",
      images: [emojiImage("🗜️", "#E3EDF9")],
      units: 1,
      condition: "Good — Available for reuse",
      conditionClass: "good",
      description: "Released for recycling by Nursing CBOR. WARC Minute No. 757 / 11 Sep 2026. Reqn. No. 2690.",
      addedISO: "2026-09-11",
      closeDate: "25 Nov",
      closeDateFull: "25 November 2026",
      closeDateISO: "2026-11-25",
      collectDeadlineISO: null,
      collectDeadline: null,
      situationPh: "e.g. Tell us about the situation this would help solve...",
      impactPh: "e.g. Tell us how you'd use it and how you'd collect it...",
      departmentPh: "e.g. Which department would use this"
    },
    {
      id: "warc-2691-haeney-clamp-st-7",
      code: "WARC-2691",
      name: "Haeney Clamp St. 7\"",
      model: "Nursing CBOR",
      department: "Nursing CBOR",
      category: "Instrument",
      catColor: "var(--cat-surgical)",
      images: [emojiImage("🗜️", "#E3EDF9")],
      units: 2,
      condition: "Good — Available for reuse",
      conditionClass: "good",
      description: "Released for recycling by Nursing CBOR. WARC Minute No. 757 / 11 Sep 2026. Reqn. No. 2691.",
      addedISO: "2026-09-11",
      closeDate: "25 Nov",
      closeDateFull: "25 November 2026",
      closeDateISO: "2026-11-25",
      collectDeadlineISO: null,
      collectDeadline: null,
      situationPh: "e.g. Tell us about the situation this would help solve...",
      impactPh: "e.g. Tell us how you'd use it and how you'd collect it...",
      departmentPh: "e.g. Which department would use this"
    },
    {
      id: "warc-2691-st-kocker-10",
      code: "WARC-2691",
      name: "St. Kocker 10\"",
      model: "Nursing CBOR",
      department: "Nursing CBOR",
      category: "Instrument",
      catColor: "var(--cat-surgical)",
      images: [emojiImage("🩺", "#E3EDF9")],
      units: 1,
      condition: "Good — Available for reuse",
      conditionClass: "good",
      description: "Released for recycling by Nursing CBOR. WARC Minute No. 757 / 11 Sep 2026. Reqn. No. 2691.",
      addedISO: "2026-09-11",
      closeDate: "25 Nov",
      closeDateFull: "25 November 2026",
      closeDateISO: "2026-11-25",
      collectDeadlineISO: null,
      collectDeadline: null,
      situationPh: "e.g. Tell us about the situation this would help solve...",
      impactPh: "e.g. Tell us how you'd use it and how you'd collect it...",
      departmentPh: "e.g. Which department would use this"
    },
    {
      id: "warc-2691-kelly-clamp-cd-8",
      code: "WARC-2691",
      name: "Kelly Clamp Cd. 8\"",
      model: "Nursing CBOR",
      department: "Nursing CBOR",
      category: "Instrument",
      catColor: "var(--cat-surgical)",
      images: [emojiImage("🗜️", "#E3EDF9")],
      units: 1,
      condition: "Good — Available for reuse",
      conditionClass: "good",
      description: "Released for recycling by Nursing CBOR. WARC Minute No. 757 / 11 Sep 2026. Reqn. No. 2691.",
      addedISO: "2026-09-11",
      closeDate: "25 Nov",
      closeDateFull: "25 November 2026",
      closeDateISO: "2026-11-25",
      collectDeadlineISO: null,
      collectDeadline: null,
      situationPh: "e.g. Tell us about the situation this would help solve...",
      impactPh: "e.g. Tell us how you'd use it and how you'd collect it...",
      departmentPh: "e.g. Which department would use this"
    },
    {
      id: "warc-2691-adson-nt-forceps",
      code: "WARC-2691",
      name: "Adson NT Forceps",
      model: "Nursing CBOR",
      department: "Nursing CBOR",
      category: "Instrument",
      catColor: "var(--cat-surgical)",
      images: [emojiImage("🗜️", "#E3EDF9")],
      units: 1,
      condition: "Good — Available for reuse",
      conditionClass: "good",
      description: "Released for recycling by Nursing CBOR. WARC Minute No. 757 / 11 Sep 2026. Reqn. No. 2691.",
      addedISO: "2026-09-11",
      closeDate: "25 Nov",
      closeDateFull: "25 November 2026",
      closeDateISO: "2026-11-25",
      collectDeadlineISO: null,
      collectDeadline: null,
      situationPh: "e.g. Tell us about the situation this would help solve...",
      impactPh: "e.g. Tell us how you'd use it and how you'd collect it...",
      departmentPh: "e.g. Which department would use this"
    },
    {
      id: "warc-2691-richardson-retractor-paed",
      code: "WARC-2691",
      name: "Richardson Retractor Paed.",
      model: "Nursing CBOR",
      department: "Nursing CBOR",
      category: "Instrument",
      catColor: "var(--cat-surgical)",
      images: [emojiImage("🗜️", "#E3EDF9")],
      units: 2,
      condition: "Good — Available for reuse",
      conditionClass: "good",
      description: "Released for recycling by Nursing CBOR. WARC Minute No. 757 / 11 Sep 2026. Reqn. No. 2691.",
      addedISO: "2026-09-11",
      closeDate: "25 Nov",
      closeDateFull: "25 November 2026",
      closeDateISO: "2026-11-25",
      collectDeadlineISO: null,
      collectDeadline: null,
      situationPh: "e.g. Tell us about the situation this would help solve...",
      impactPh: "e.g. Tell us how you'd use it and how you'd collect it...",
      departmentPh: "e.g. Which department would use this"
    },
    {
      id: "warc-2691-towel-clip-4",
      code: "WARC-2691",
      name: "Towel Clip 4\"",
      model: "Nursing CBOR",
      department: "Nursing CBOR",
      category: "Instrument",
      catColor: "var(--cat-surgical)",
      images: [emojiImage("🗜️", "#E3EDF9")],
      units: 2,
      condition: "Good — Available for reuse",
      conditionClass: "good",
      description: "Released for recycling by Nursing CBOR. WARC Minute No. 757 / 11 Sep 2026. Reqn. No. 2691.",
      addedISO: "2026-09-11",
      closeDate: "25 Nov",
      closeDateFull: "25 November 2026",
      closeDateISO: "2026-11-25",
      collectDeadlineISO: null,
      collectDeadline: null,
      situationPh: "e.g. Tell us about the situation this would help solve...",
      impactPh: "e.g. Tell us how you'd use it and how you'd collect it...",
      departmentPh: "e.g. Which department would use this"
    },
    {
      id: "warc-2691-retractor",
      code: "WARC-2691",
      name: "Retractor",
      model: "Nursing CBOR",
      department: "Nursing CBOR",
      category: "Instrument",
      catColor: "var(--cat-surgical)",
      images: [emojiImage("🗜️", "#E3EDF9")],
      units: 1,
      condition: "Good — Available for reuse",
      conditionClass: "good",
      description: "Released for recycling by Nursing CBOR. WARC Minute No. 757 / 11 Sep 2026. Reqn. No. 2691.",
      addedISO: "2026-09-11",
      closeDate: "25 Nov",
      closeDateFull: "25 November 2026",
      closeDateISO: "2026-11-25",
      collectDeadlineISO: null,
      collectDeadline: null,
      situationPh: "e.g. Tell us about the situation this would help solve...",
      impactPh: "e.g. Tell us how you'd use it and how you'd collect it...",
      departmentPh: "e.g. Which department would use this"
    },
    {
      id: "warc-2691-eyelid-retractor-small",
      code: "WARC-2691",
      name: "Eyelid Retractor Small",
      model: "Nursing CBOR",
      department: "Nursing CBOR",
      category: "Instrument",
      catColor: "var(--cat-surgical)",
      images: [emojiImage("🗜️", "#E3EDF9")],
      units: 2,
      condition: "Good — Available for reuse",
      conditionClass: "good",
      description: "Released for recycling by Nursing CBOR. WARC Minute No. 757 / 11 Sep 2026. Reqn. No. 2691.",
      addedISO: "2026-09-11",
      closeDate: "25 Nov",
      closeDateFull: "25 November 2026",
      closeDateISO: "2026-11-25",
      collectDeadlineISO: null,
      collectDeadline: null,
      situationPh: "e.g. Tell us about the situation this would help solve...",
      impactPh: "e.g. Tell us how you'd use it and how you'd collect it...",
      departmentPh: "e.g. Which department would use this"
    },
    {
      id: "warc-2691-st-mosquito-artery-5",
      code: "WARC-2691",
      name: "St. Mosquito Artery 5\"",
      model: "Nursing CBOR",
      department: "Nursing CBOR",
      category: "Instrument",
      catColor: "var(--cat-surgical)",
      images: [emojiImage("🩺", "#E3EDF9")],
      units: 1,
      condition: "Good — Available for reuse",
      conditionClass: "good",
      description: "Released for recycling by Nursing CBOR. WARC Minute No. 757 / 11 Sep 2026. Reqn. No. 2691.",
      addedISO: "2026-09-11",
      closeDate: "25 Nov",
      closeDateFull: "25 November 2026",
      closeDateISO: "2026-11-25",
      collectDeadlineISO: null,
      collectDeadline: null,
      situationPh: "e.g. Tell us about the situation this would help solve...",
      impactPh: "e.g. Tell us how you'd use it and how you'd collect it...",
      departmentPh: "e.g. Which department would use this"
    },
    {
      id: "warc-2691-mosquito-artery-clamp-5-cd",
      code: "WARC-2691",
      name: "Mosquito Artery Clamp 5\" Cd.",
      model: "Nursing CBOR",
      department: "Nursing CBOR",
      category: "Instrument",
      catColor: "var(--cat-surgical)",
      images: [emojiImage("🗜️", "#E3EDF9")],
      units: 3,
      condition: "Good — Available for reuse",
      conditionClass: "good",
      description: "Released for recycling by Nursing CBOR. WARC Minute No. 757 / 11 Sep 2026. Reqn. No. 2691.",
      addedISO: "2026-09-11",
      closeDate: "25 Nov",
      closeDateFull: "25 November 2026",
      closeDateISO: "2026-11-25",
      collectDeadlineISO: null,
      collectDeadline: null,
      situationPh: "e.g. Tell us about the situation this would help solve...",
      impactPh: "e.g. Tell us how you'd use it and how you'd collect it...",
      departmentPh: "e.g. Which department would use this"
    },
    {
      id: "warc-2692-frazier-suction-tip",
      code: "WARC-2692",
      name: "Frazier Suction Tip",
      model: "Nursing CBOR",
      department: "Nursing CBOR",
      category: "Instrument",
      catColor: "var(--cat-surgical)",
      images: [emojiImage("🌀", "#E3EDF9")],
      units: 3,
      condition: "Good — Available for reuse",
      conditionClass: "good",
      description: "Released for recycling by Nursing CBOR. WARC Minute No. 757 / 11 Sep 2026. Reqn. No. 2692.",
      addedISO: "2026-09-11",
      closeDate: "25 Nov",
      closeDateFull: "25 November 2026",
      closeDateISO: "2026-11-25",
      collectDeadlineISO: null,
      collectDeadline: null,
      situationPh: "e.g. Tell us about the situation this would help solve...",
      impactPh: "e.g. Tell us how you'd use it and how you'd collect it...",
      departmentPh: "e.g. Which department would use this"
    },
    {
      id: "warc-2692-yaunker-suction-tip-adult",
      code: "WARC-2692",
      name: "Yaunker Suction Tip Adult",
      model: "Nursing CBOR",
      department: "Nursing CBOR",
      category: "Instrument",
      catColor: "var(--cat-surgical)",
      images: [emojiImage("🌀", "#E3EDF9")],
      units: 1,
      condition: "Good — Available for reuse",
      conditionClass: "good",
      description: "Released for recycling by Nursing CBOR. WARC Minute No. 757 / 11 Sep 2026. Reqn. No. 2692.",
      addedISO: "2026-09-11",
      closeDate: "25 Nov",
      closeDateFull: "25 November 2026",
      closeDateISO: "2026-11-25",
      collectDeadlineISO: null,
      collectDeadline: null,
      situationPh: "e.g. Tell us about the situation this would help solve...",
      impactPh: "e.g. Tell us how you'd use it and how you'd collect it...",
      departmentPh: "e.g. Which department would use this"
    },
    {
      id: "warc-2692-baby-devers",
      code: "WARC-2692",
      name: "Baby Devers",
      model: "Nursing CBOR",
      department: "Nursing CBOR",
      category: "Instrument",
      catColor: "var(--cat-surgical)",
      images: [emojiImage("🗜️", "#E3EDF9")],
      units: 1,
      condition: "Good — Available for reuse",
      conditionClass: "good",
      description: "Released for recycling by Nursing CBOR. WARC Minute No. 757 / 11 Sep 2026. Reqn. No. 2692.",
      addedISO: "2026-09-11",
      closeDate: "25 Nov",
      closeDateFull: "25 November 2026",
      closeDateISO: "2026-11-25",
      collectDeadlineISO: null,
      collectDeadline: null,
      situationPh: "e.g. Tell us about the situation this would help solve...",
      impactPh: "e.g. Tell us how you'd use it and how you'd collect it...",
      departmentPh: "e.g. Which department would use this"
    },
    {
      id: "warc-2692-mayo-scissors-7-cd",
      code: "WARC-2692",
      name: "Mayo Scissors 7\" Cd.",
      model: "Nursing CBOR",
      department: "Nursing CBOR",
      category: "Instrument",
      catColor: "var(--cat-surgical)",
      images: [emojiImage("✂️", "#E3EDF9")],
      units: 2,
      condition: "Good — Available for reuse",
      conditionClass: "good",
      description: "Released for recycling by Nursing CBOR. WARC Minute No. 757 / 11 Sep 2026. Reqn. No. 2692.",
      addedISO: "2026-09-11",
      closeDate: "25 Nov",
      closeDateFull: "25 November 2026",
      closeDateISO: "2026-11-25",
      collectDeadlineISO: null,
      collectDeadline: null,
      situationPh: "e.g. Tell us about the situation this would help solve...",
      impactPh: "e.g. Tell us how you'd use it and how you'd collect it...",
      departmentPh: "e.g. Which department would use this"
    },
    {
      id: "warc-2692-st-artery-6",
      code: "WARC-2692",
      name: "St. Artery 6\"",
      model: "Nursing CBOR",
      department: "Nursing CBOR",
      category: "Instrument",
      catColor: "var(--cat-surgical)",
      images: [emojiImage("🩺", "#E3EDF9")],
      units: 1,
      condition: "Good — Available for reuse",
      conditionClass: "good",
      description: "Released for recycling by Nursing CBOR. WARC Minute No. 757 / 11 Sep 2026. Reqn. No. 2692.",
      addedISO: "2026-09-11",
      closeDate: "25 Nov",
      closeDateFull: "25 November 2026",
      closeDateISO: "2026-11-25",
      collectDeadlineISO: null,
      collectDeadline: null,
      situationPh: "e.g. Tell us about the situation this would help solve...",
      impactPh: "e.g. Tell us how you'd use it and how you'd collect it...",
      departmentPh: "e.g. Which department would use this"
    },
    {
      id: "warc-2692-right-angle-clamp-6",
      code: "WARC-2692",
      name: "Right Angle Clamp 6\"",
      model: "Nursing CBOR",
      department: "Nursing CBOR",
      category: "Instrument",
      catColor: "var(--cat-surgical)",
      images: [emojiImage("🗜️", "#E3EDF9")],
      units: 1,
      condition: "Good — Available for reuse",
      conditionClass: "good",
      description: "Released for recycling by Nursing CBOR. WARC Minute No. 757 / 11 Sep 2026. Reqn. No. 2692.",
      addedISO: "2026-09-11",
      closeDate: "25 Nov",
      closeDateFull: "25 November 2026",
      closeDateISO: "2026-11-25",
      collectDeadlineISO: null,
      collectDeadline: null,
      situationPh: "e.g. Tell us about the situation this would help solve...",
      impactPh: "e.g. Tell us how you'd use it and how you'd collect it...",
      departmentPh: "e.g. Which department would use this"
    },
    {
      id: "warc-2692-metzenbaum-scissors-7-cd",
      code: "WARC-2692",
      name: "Metzenbaum Scissors 7\" Cd.",
      model: "Nursing CBOR",
      department: "Nursing CBOR",
      category: "Instrument",
      catColor: "var(--cat-surgical)",
      images: [emojiImage("✂️", "#E3EDF9")],
      units: 1,
      condition: "Good — Available for reuse",
      conditionClass: "good",
      description: "Released for recycling by Nursing CBOR. WARC Minute No. 757 / 11 Sep 2026. Reqn. No. 2692.",
      addedISO: "2026-09-11",
      closeDate: "25 Nov",
      closeDateFull: "25 November 2026",
      closeDateISO: "2026-11-25",
      collectDeadlineISO: null,
      collectDeadline: null,
      situationPh: "e.g. Tell us about the situation this would help solve...",
      impactPh: "e.g. Tell us how you'd use it and how you'd collect it...",
      departmentPh: "e.g. Which department would use this"
    },
    {
      id: "warc-2692-metzenbaum-scissors-7-st",
      code: "WARC-2692",
      name: "Metzenbaum Scissors 7\" St.",
      model: "Nursing CBOR",
      department: "Nursing CBOR",
      category: "Instrument",
      catColor: "var(--cat-surgical)",
      images: [emojiImage("✂️", "#E3EDF9")],
      units: 1,
      condition: "Good — Available for reuse",
      conditionClass: "good",
      description: "Released for recycling by Nursing CBOR. WARC Minute No. 757 / 11 Sep 2026. Reqn. No. 2692.",
      addedISO: "2026-09-11",
      closeDate: "25 Nov",
      closeDateFull: "25 November 2026",
      closeDateISO: "2026-11-25",
      collectDeadlineISO: null,
      collectDeadline: null,
      situationPh: "e.g. Tell us about the situation this would help solve...",
      impactPh: "e.g. Tell us how you'd use it and how you'd collect it...",
      departmentPh: "e.g. Which department would use this"
    },
    {
      id: "warc-2692-pole-retractor-2",
      code: "WARC-2692",
      name: "Pole Retractor 2\"",
      model: "Nursing CBOR",
      department: "Nursing CBOR",
      category: "Instrument",
      catColor: "var(--cat-surgical)",
      images: [emojiImage("🗜️", "#E3EDF9")],
      units: 2,
      condition: "Good — Available for reuse",
      conditionClass: "good",
      description: "Released for recycling by Nursing CBOR. WARC Minute No. 757 / 11 Sep 2026. Reqn. No. 2692.",
      addedISO: "2026-09-11",
      closeDate: "25 Nov",
      closeDateFull: "25 November 2026",
      closeDateISO: "2026-11-25",
      collectDeadlineISO: null,
      collectDeadline: null,
      situationPh: "e.g. Tell us about the situation this would help solve...",
      impactPh: "e.g. Tell us how you'd use it and how you'd collect it...",
      departmentPh: "e.g. Which department would use this"
    },
    {
      id: "warc-2692-pole-retractor-3",
      code: "WARC-2692",
      name: "Pole Retractor 3\"",
      model: "Nursing CBOR",
      department: "Nursing CBOR",
      category: "Instrument",
      catColor: "var(--cat-surgical)",
      images: [emojiImage("🗜️", "#E3EDF9")],
      units: 2,
      condition: "Good — Available for reuse",
      conditionClass: "good",
      description: "Released for recycling by Nursing CBOR. WARC Minute No. 757 / 11 Sep 2026. Reqn. No. 2692.",
      addedISO: "2026-09-11",
      closeDate: "25 Nov",
      closeDateFull: "25 November 2026",
      closeDateISO: "2026-11-25",
      collectDeadlineISO: null,
      collectDeadline: null,
      situationPh: "e.g. Tell us about the situation this would help solve...",
      impactPh: "e.g. Tell us how you'd use it and how you'd collect it...",
      departmentPh: "e.g. Which department would use this"
    },
    {
      id: "warc-2694-pole-retractor-4",
      code: "WARC-2694",
      name: "Pole Retractor 4\"",
      model: "Nursing CBOR",
      department: "Nursing CBOR",
      category: "Instrument",
      catColor: "var(--cat-surgical)",
      images: [emojiImage("🗜️", "#E3EDF9")],
      units: 2,
      condition: "Good — Available for reuse",
      conditionClass: "good",
      description: "Released for recycling by Nursing CBOR. WARC Minute No. 757 / 11 Sep 2026. Reqn. No. 2694.",
      addedISO: "2026-09-11",
      closeDate: "25 Nov",
      closeDateFull: "25 November 2026",
      closeDateISO: "2026-11-25",
      collectDeadlineISO: null,
      collectDeadline: null,
      situationPh: "e.g. Tell us about the situation this would help solve...",
      impactPh: "e.g. Tell us how you'd use it and how you'd collect it...",
      departmentPh: "e.g. Which department would use this"
    },
    {
      id: "warc-2694-pole-retractor-1",
      code: "WARC-2694",
      name: "Pole Retractor 1\"",
      model: "Nursing CBOR",
      department: "Nursing CBOR",
      category: "Instrument",
      catColor: "var(--cat-surgical)",
      images: [emojiImage("🗜️", "#E3EDF9")],
      units: 1,
      condition: "Good — Available for reuse",
      conditionClass: "good",
      description: "Released for recycling by Nursing CBOR. WARC Minute No. 757 / 11 Sep 2026. Reqn. No. 2694.",
      addedISO: "2026-09-11",
      closeDate: "25 Nov",
      closeDateFull: "25 November 2026",
      closeDateISO: "2026-11-25",
      collectDeadlineISO: null,
      collectDeadline: null,
      situationPh: "e.g. Tell us about the situation this would help solve...",
      impactPh: "e.g. Tell us how you'd use it and how you'd collect it...",
      departmentPh: "e.g. Which department would use this"
    },
    {
      id: "warc-2694-kidney-tray",
      code: "WARC-2694",
      name: "Kidney Tray",
      model: "Nursing CBOR",
      department: "Nursing CBOR",
      category: "Instrument",
      catColor: "var(--cat-surgical)",
      images: [emojiImage("🧺", "#E3EDF9")],
      units: 3,
      condition: "Good — Available for reuse",
      conditionClass: "good",
      description: "Released for recycling by Nursing CBOR. WARC Minute No. 757 / 11 Sep 2026. Reqn. No. 2694.",
      addedISO: "2026-09-11",
      closeDate: "25 Nov",
      closeDateFull: "25 November 2026",
      closeDateISO: "2026-11-25",
      collectDeadlineISO: null,
      collectDeadline: null,
      situationPh: "e.g. Tell us about the situation this would help solve...",
      impactPh: "e.g. Tell us how you'd use it and how you'd collect it...",
      departmentPh: "e.g. Which department would use this"
    },
    {
      id: "warc-2694-kelly-clamp-cd-8",
      code: "WARC-2694",
      name: "Kelly Clamp Cd. 8\"",
      model: "Nursing CBOR",
      department: "Nursing CBOR",
      category: "Instrument",
      catColor: "var(--cat-surgical)",
      images: [emojiImage("🗜️", "#E3EDF9")],
      units: 5,
      condition: "Good — Available for reuse",
      conditionClass: "good",
      description: "Released for recycling by Nursing CBOR. WARC Minute No. 757 / 11 Sep 2026. Reqn. No. 2694.",
      addedISO: "2026-09-11",
      closeDate: "25 Nov",
      closeDateFull: "25 November 2026",
      closeDateISO: "2026-11-25",
      collectDeadlineISO: null,
      collectDeadline: null,
      situationPh: "e.g. Tell us about the situation this would help solve...",
      impactPh: "e.g. Tell us how you'd use it and how you'd collect it...",
      departmentPh: "e.g. Which department would use this"
    },
    {
      id: "warc-2694-nt-dissecting-forceps-7",
      code: "WARC-2694",
      name: "NT Dissecting Forceps 7\"",
      model: "Nursing CBOR",
      department: "Nursing CBOR",
      category: "Instrument",
      catColor: "var(--cat-surgical)",
      images: [emojiImage("🗜️", "#E3EDF9")],
      units: 3,
      condition: "Good — Available for reuse",
      conditionClass: "good",
      description: "Released for recycling by Nursing CBOR. WARC Minute No. 757 / 11 Sep 2026. Reqn. No. 2694.",
      addedISO: "2026-09-11",
      closeDate: "25 Nov",
      closeDateFull: "25 November 2026",
      closeDateISO: "2026-11-25",
      collectDeadlineISO: null,
      collectDeadline: null,
      situationPh: "e.g. Tell us about the situation this would help solve...",
      impactPh: "e.g. Tell us how you'd use it and how you'd collect it...",
      departmentPh: "e.g. Which department would use this"
    },
    {
      id: "warc-2694-nt-dissecting-forceps-6",
      code: "WARC-2694",
      name: "NT Dissecting Forceps 6\"",
      model: "Nursing CBOR",
      department: "Nursing CBOR",
      category: "Instrument",
      catColor: "var(--cat-surgical)",
      images: [emojiImage("🗜️", "#E3EDF9")],
      units: 2,
      condition: "Good — Available for reuse",
      conditionClass: "good",
      description: "Released for recycling by Nursing CBOR. WARC Minute No. 757 / 11 Sep 2026. Reqn. No. 2694.",
      addedISO: "2026-09-11",
      closeDate: "25 Nov",
      closeDateFull: "25 November 2026",
      closeDateISO: "2026-11-25",
      collectDeadlineISO: null,
      collectDeadline: null,
      situationPh: "e.g. Tell us about the situation this would help solve...",
      impactPh: "e.g. Tell us how you'd use it and how you'd collect it...",
      departmentPh: "e.g. Which department would use this"
    },
    {
      id: "warc-2694-nt-dissecting-forceps-5",
      code: "WARC-2694",
      name: "NT Dissecting Forceps 5\"",
      model: "Nursing CBOR",
      department: "Nursing CBOR",
      category: "Instrument",
      catColor: "var(--cat-surgical)",
      images: [emojiImage("🗜️", "#E3EDF9")],
      units: 1,
      condition: "Good — Available for reuse",
      conditionClass: "good",
      description: "Released for recycling by Nursing CBOR. WARC Minute No. 757 / 11 Sep 2026. Reqn. No. 2694.",
      addedISO: "2026-09-11",
      closeDate: "25 Nov",
      closeDateFull: "25 November 2026",
      closeDateISO: "2026-11-25",
      collectDeadlineISO: null,
      collectDeadline: null,
      situationPh: "e.g. Tell us about the situation this would help solve...",
      impactPh: "e.g. Tell us how you'd use it and how you'd collect it...",
      departmentPh: "e.g. Which department would use this"
    },
    {
      id: "warc-2694-nt-dissecting-forceps-8",
      code: "WARC-2694",
      name: "NT Dissecting Forceps 8\"",
      model: "Nursing CBOR",
      department: "Nursing CBOR",
      category: "Instrument",
      catColor: "var(--cat-surgical)",
      images: [emojiImage("🗜️", "#E3EDF9")],
      units: 1,
      condition: "Good — Available for reuse",
      conditionClass: "good",
      description: "Released for recycling by Nursing CBOR. WARC Minute No. 757 / 11 Sep 2026. Reqn. No. 2694.",
      addedISO: "2026-09-11",
      closeDate: "25 Nov",
      closeDateFull: "25 November 2026",
      closeDateISO: "2026-11-25",
      collectDeadlineISO: null,
      collectDeadline: null,
      situationPh: "e.g. Tell us about the situation this would help solve...",
      impactPh: "e.g. Tell us how you'd use it and how you'd collect it...",
      departmentPh: "e.g. Which department would use this"
    },
    {
      id: "warc-2694-toothed-dissecting-forceps-6",
      code: "WARC-2694",
      name: "Toothed Dissecting Forceps 6\"",
      model: "Nursing CBOR",
      department: "Nursing CBOR",
      category: "Instrument",
      catColor: "var(--cat-surgical)",
      images: [emojiImage("🗜️", "#E3EDF9")],
      units: 2,
      condition: "Good — Available for reuse",
      conditionClass: "good",
      description: "Released for recycling by Nursing CBOR. WARC Minute No. 757 / 11 Sep 2026. Reqn. No. 2694.",
      addedISO: "2026-09-11",
      closeDate: "25 Nov",
      closeDateFull: "25 November 2026",
      closeDateISO: "2026-11-25",
      collectDeadlineISO: null,
      collectDeadline: null,
      situationPh: "e.g. Tell us about the situation this would help solve...",
      impactPh: "e.g. Tell us how you'd use it and how you'd collect it...",
      departmentPh: "e.g. Which department would use this"
    },
    {
      id: "warc-2694-toothed-dissecting-forceps-7",
      code: "WARC-2694",
      name: "Toothed Dissecting Forceps 7\"",
      model: "Nursing CBOR",
      department: "Nursing CBOR",
      category: "Instrument",
      catColor: "var(--cat-surgical)",
      images: [emojiImage("🗜️", "#E3EDF9")],
      units: 2,
      condition: "Good — Available for reuse",
      conditionClass: "good",
      description: "Released for recycling by Nursing CBOR. WARC Minute No. 757 / 11 Sep 2026. Reqn. No. 2694.",
      addedISO: "2026-09-11",
      closeDate: "25 Nov",
      closeDateFull: "25 November 2026",
      closeDateISO: "2026-11-25",
      collectDeadlineISO: null,
      collectDeadline: null,
      situationPh: "e.g. Tell us about the situation this would help solve...",
      impactPh: "e.g. Tell us how you'd use it and how you'd collect it...",
      departmentPh: "e.g. Which department would use this"
    }
  ];

  function loadEquipment(){
    try{
      var raw = localStorage.getItem(ASSET_STORE_KEY);
      if(raw) return JSON.parse(raw);
      saveEquipment(EQUIPMENT_SEED);
      return EQUIPMENT_SEED;
    }catch(e){
      if(!window.__equipMem) window.__equipMem = EQUIPMENT_SEED.slice();
      return window.__equipMem;
    }
  }
  function saveEquipment(list){
    try{ localStorage.setItem(ASSET_STORE_KEY, JSON.stringify(list)); }
    catch(e){ window.__equipMem = list; }
  }
  function nextAssetCode(){
    var n = 2470;
    try{
      n = parseInt(localStorage.getItem(ASSET_SEQ_KEY) || "2470", 10);
      localStorage.setItem(ASSET_SEQ_KEY, String(n + 1));
    }catch(e){
      window.__assetSeq = (window.__assetSeq || 2470) + 1;
      n = window.__assetSeq;
    }
    return "AST-" + n;
  }
  function slugify(name){
    var base = (name || "item").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-+|-+$)/g, "");
    return (base || "item") + "-" + Date.now().toString(36);
  }
  // Keyed to match the "What type is this?" filter's actual <option> values
  // (see cat-filter in equipments.html) — the old Diagnostic/Surgical/
  // Patient Care/Furniture & Fixtures set never matched that dropdown, so
  // anything added through this form couldn't be filtered back out again.
  var CATEGORY_COLOR = {
    "Computer": "var(--cat-diagnostic)",
    "Furniture": "var(--cat-furniture)",
    "Accessory": "var(--cat-patient)",
    "Spare": "var(--cat-diagnostic)",
    "Consumables": "var(--cat-patient)",
    "Instrument": "var(--cat-surgical)"
  };
  function conditionClassFor(cond){
    return (cond.indexOf("Fair") !== -1 || cond.indexOf("Needs Repair") !== -1) ? "fair" : "good";
  }
  function formatCloseDate(iso){
    if(!iso) return { short: "", full: "" };
    var d = new Date(iso + "T00:00:00");
    return {
      short: d.toLocaleDateString(undefined, { day: "numeric", month: "short" }),
      full: d.toLocaleDateString(undefined, { day: "numeric", month: "long", year: "numeric" })
    };
  }

  /* ---------------- Minimum listing window ----------------
     Nothing is ever hard-deleted from EQUIPMENT here — a closed item just
     drops out of the browsable register (isAvailable()) and keeps showing
     under History instead. What this enforces is the other end: a listing
     can't be given a close date less than 2 months out, so nothing closes
     (and therefore nothing is eligible to eventually be removed) before
     it's been up for at least that long. */
  var MIN_LISTING_DAYS = 60;
  function minListingDateISO(){
    var d = new Date();
    d.setDate(d.getDate() + MIN_LISTING_DAYS);
    return d.toISOString().slice(0, 10);
  }

  var EQUIPMENT = loadEquipment();

  var state = { search: "", cat: "all", selected: null, view: "tiles" };

  /* ---------------- Pagination (shared by all four lists) ----------------
     One small helper reused by renderRegister/renderApps/renderConnectView/
     renderHistory rather than four bespoke paging implementations. Each
     list keeps its own current page in pageState so switching tabs (or
     re-rendering after a chat message) doesn't reset where you were. */
  var PAGE_SIZE = 6;
  var pageState = { register: 1, apps: 1, connect: 1, history: 1 };

  function paginate(list, key){
    var totalPages = Math.max(1, Math.ceil(list.length / PAGE_SIZE));
    if(pageState[key] > totalPages) pageState[key] = totalPages;
    if(pageState[key] < 1) pageState[key] = 1;
    var start = (pageState[key] - 1) * PAGE_SIZE;
    return {
      items: list.slice(start, start + PAGE_SIZE),
      page: pageState[key],
      totalPages: totalPages
    };
  }

  function renderPagination(containerId, key, totalPages, currentPage, onChange){
    var el = document.getElementById(containerId);
    if(!el) return;
    if(totalPages <= 1){ el.innerHTML = ""; return; }
    el.innerHTML =
      '<button type="button" class="page-btn" data-dir="prev"' + (currentPage <= 1 ? " disabled" : "") + '>&lsaquo; Prev</button>' +
      '<span class="page-indicator">Page ' + currentPage + ' of ' + totalPages + '</span>' +
      '<button type="button" class="page-btn" data-dir="next"' + (currentPage >= totalPages ? " disabled" : "") + '>Next &rsaquo;</button>';
    el.querySelectorAll(".page-btn").forEach(function(btn){
      btn.addEventListener("click", function(){
        pageState[key] += (btn.getAttribute("data-dir") === "next" ? 1 : -1);
        onChange();
        el.closest(".view, .drawer-body")?.scrollTo?.({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
      });
    });
  }
  // Bumped to v2 alongside ASSET_STORE_KEY — see the comment there. The old
  // demo requests pointed at asset ids (ultrasound/beds/autoclave) that no
  // longer exist in EQUIPMENT_SEED, so this starts My Requests clean too.
  var STORE_KEY = "cmc-equip-applications-v2";
  var REQ_SEQ_KEY = "cmc-equip-req-seq-v2";

  /* ---------------- Status vocabulary (see ARO/09-2026/V1.0 SOP) ----------------
     The real AssetRequest.status pipeline (Pending -> Under Review -> Approved
     -> Ready for Collection -> Dispatched -> Collected/Completed, or Rejected/
     Cancelled) has two internal steps this page deliberately does NOT expose
     by name — the Associate Director's allotment and the General
     Superintendent's separate sign-off. Hospital staff just need to know
     where things stand in plain language, not which committee is holding it;
     the fuller internal detail belongs on the Missions Department side. */
  var STATUS_META = {
    "Pending":              { label: "Submitted",       cls: "neutral",  message: "We've received this and it's in the queue to be looked at." },
    "Under Review":         { label: "Being Reviewed",  cls: "neutral",  message: "Missions Office is checking this against what's available." },
    "Approved":             { label: "Approved",        cls: "open",     message: "This has been approved for your hospital. We're now arranging to get it to you." },
    "Ready for Collection": { label: "Approved",        cls: "open",     message: "This has been approved and is being made ready to send." },
    "Dispatched":           { label: "On the way",      cls: "open",     message: "This is on its way to you." },
    "Collected":            { label: "Delivered",       cls: "open",     message: "Delivered — this has been received at your hospital." },
    "Completed":            { label: "Delivered",       cls: "open",     message: "Delivered — this has been received at your hospital." },
    "Rejected":             { label: "Not approved",    cls: "rejected", message: "This request wasn't approved this time." },
    "Cancelled":            { label: "Cancelled",       cls: "neutral",  message: "This request was cancelled." }
  };
  function statusMeta(status){
    return STATUS_META[status] || STATUS_META["Pending"];
  }

  /* ---------------- local persistence (stand-in for API calls, see Mongo TODO) ---------------- */

  /* Cleared — this used to seed My Requests with three example cases
     (Pending / Under Review / fully Collected) pointing at the old
     hand-written demo assets (ultrasound/beds/autoclave). Those asset ids
     don't exist any more now that EQUIPMENT_SEED is the real Asset
     Recycling Committee list, so this starts empty rather than seeding
     broken references. My Requests / Connect Office will show their
     "nothing yet" empty state until real requests come in.
     TODO (Mongo migration): loadApps() below becomes
     fetch('/api/requests?facility=...') — real data replaces this either
     way. */
  var DEMO_APPS_SEED = [];

  /* ---------------- Role check ----------------
     usrDetails.data.roles is the real array field (see app.js —
     usrDetails.data.roles.includes('Council Member') etc. uses the exact
     same pattern). hasRole() is a small, safe wrapper around that
     .includes() call.
     Which columns a viewer sees is decided by exactly two roles:
       - role "Missions"       -> connect side -> "Requests" column
         (Missions Office, seeing every hospital's requests)
       - role "Hospital Admin" -> hospital side -> "My Requests" column
         (a mission hospital's own requests)
     Someone with both roles gets both extra columns (3 total, alongside
     Items); someone with neither only sees Items (1 column). */
  function hasRole(name){
    var roles = Array.isArray(usrDetails?.data?.roles)
      ? usrDetails.data.roles
      : (usrDetails?.data?.role ? [usrDetails.data.role] : []);
    return roles.indexOf(name) !== -1;
  }
  var showMyRequestsCol = hasRole("Hospital Admin");
  var showRequestsCol = hasRole("Missions");
  // Kept for the one remaining fallback use (openChatFor, when no
  // forcedRole is passed in) — every real call site today always passes
  // forcedRole explicitly, so this is a safety net, not the primary check.
  function isConnectSide(){
    return showRequestsCol;
  }
  function updateColumnsVisibility(){
    var colMine = document.getElementById("col-myrequests");
    var colConnect = document.getElementById("col-requests");
    var wrap = document.getElementById("eqp-columns");
    if(colMine) colMine.hidden = !showMyRequestsCol;
    if(colConnect) colConnect.hidden = !showRequestsCol;
    if(wrap){
      var cols = 1 + (showMyRequestsCol ? 1 : 0) + (showRequestsCol ? 1 : 0);
      wrap.setAttribute("data-cols", String(cols));
    }
  }

  function loadApps(){
    try{
      var raw = localStorage.getItem(STORE_KEY);
      if(raw) return JSON.parse(raw);
      saveApps(DEMO_APPS_SEED);
      return DEMO_APPS_SEED;
    }catch(e){
      if(!window.__appsMem) window.__appsMem = DEMO_APPS_SEED.slice();
      return window.__appsMem;
    }
  }
  function saveApps(list){
    try{ localStorage.setItem(STORE_KEY, JSON.stringify(list)); }
    catch(e){ window.__appsMem = list; }
  }
  function nextRequestId(){
    var n = 1008;
    try{
      n = parseInt(localStorage.getItem(REQ_SEQ_KEY) || "1008", 10);
      localStorage.setItem(REQ_SEQ_KEY, String(n + 1));
    }catch(e){
      window.__reqSeq = (window.__reqSeq || 1008) + 1;
      n = window.__reqSeq;
    }
    return "REQ-" + n;
  }

  /* ---------------- Request columns (role-based) ----------------
     Replaces the old tab strip: Items always shows, My Requests / Requests
     show next to it as extra columns per showMyRequestsCol/showRequestsCol
     above. Set once here, before the first render, so the columns are in
     their right state (and the grid is the right width) from the start. */
  updateColumnsVisibility();

  /* ---------------- Hero carousel ---------------- */
  var heroCarousel = document.getElementById("hero-carousel");
  if(heroCarousel){
    var hcTrack = document.getElementById("hc-track");
    var hcDots = document.getElementById("hc-dots");
    var hcIndex = 0;
    var hcTimer = null;

    // No per-slide caption here any more — the intro text is now a single
    // fixed overlay (see .hero-intro-overlay in equipments.html) that sits
    // on top of the carousel and doesn't change as slides rotate. Drawing
    // a caption per slide as well would put two competing headlines on
    // screen at once, which is the exact "not came well" problem from an
    // earlier merge attempt.
    function renderCarousel(){
      hcTrack.innerHTML = CAROUSEL_SLIDES.map(function(s){
        return (
          '<div class="hc-slide">' +
            '<img src="' + s.image + '" alt="' + s.title + '">' +
          '</div>'
        );
      }).join("");
      hcDots.innerHTML = CAROUSEL_SLIDES.map(function(_, i){
        return '<button type="button" class="hc-dot" data-index="' + i + '" aria-label="Go to slide ' + (i + 1) + '"></button>';
      }).join("");
    }
    function goToSlide(i){
      hcIndex = (i + CAROUSEL_SLIDES.length) % CAROUSEL_SLIDES.length;
      hcTrack.style.transform = "translateX(-" + (hcIndex * 100) + "%)";
      hcDots.querySelectorAll(".hc-dot").forEach(function(d, idx){
        d.classList.toggle("active", idx === hcIndex);
      });
    }
    function startCarousel(){
      stopCarousel();
      if(CAROUSEL_SLIDES.length < 2) return;
      hcTimer = setInterval(function(){ goToSlide(hcIndex + 1); }, 5000);
    }
    function stopCarousel(){
      if(hcTimer) clearInterval(hcTimer);
      hcTimer = null;
    }

    renderCarousel();
    goToSlide(0);
    startCarousel();

    document.getElementById("hc-prev").addEventListener("click", function(){ goToSlide(hcIndex - 1); startCarousel(); });
    document.getElementById("hc-next").addEventListener("click", function(){ goToSlide(hcIndex + 1); startCarousel(); });
    hcDots.addEventListener("click", function(e){
      var btn = e.target.closest(".hc-dot");
      if(!btn) return;
      goToSlide(parseInt(btn.getAttribute("data-index"), 10));
      startCarousel();
    });
    heroCarousel.addEventListener("mouseenter", stopCarousel);
    heroCarousel.addEventListener("mouseleave", startCarousel);

    // Light touch-swipe support — no library, just a distance threshold.
    var hcTouchX = null;
    heroCarousel.addEventListener("touchstart", function(e){
      hcTouchX = e.touches[0].clientX;
      stopCarousel();
    }, { passive: true });
    heroCarousel.addEventListener("touchend", function(e){
      if(hcTouchX === null) return;
      var dx = e.changedTouches[0].clientX - hcTouchX;
      if(Math.abs(dx) > 40) goToSlide(hcIndex + (dx < 0 ? 1 : -1));
      hcTouchX = null;
      startCarousel();
    });
  }

  /* ---------------- Register rendering ---------------- */

  /* An item's 15-day intranet listing window is real (see the ARO SOP) —
     once it closes, or once its last unit is allotted, it drops out of
     the browsable register the same way a real Asset with
     availableQuantity: 0 / an expired listingClosesOn would. */
  function daysUntilClose(item){
    if(!item.closeDateISO) return null;
    var close = new Date(item.closeDateISO + "T23:59:59");
    var now = new Date();
    return Math.ceil((close - now) / 86400000);
  }
  function isClosingSoon(item){
    var d = daysUntilClose(item);
    return d !== null && d >= 0 && d <= 5;
  }
  function isAvailable(item){
    var d = daysUntilClose(item);
    return item.units > 0 && (d === null || d >= 0);
  }

  function matchesFilters(item){
    if(!isAvailable(item)) return false;
    if(state.cat !== "all" && item.category !== state.cat) return false;
    if(state.search){
      var q = state.search.toLowerCase();
      if(item.name.toLowerCase().indexOf(q) === -1) return false;
    }
    return true;
  }

  function statusChip(item){
    return isClosingSoon(item)
      ? '<span class="status-chip soon"><span class="dot"></span>Closing soon</span>'
      : '<span class="status-chip open"><span class="dot"></span>Available</span>';
  }
  function unitsLabel(item){
    return item.units + ' <span class="of">unit' + (item.units === 1 ? '' : 's') + '</span>';
  }
  function itemImages(item){
    return (item.images && item.images.length) ? item.images : [PLACEHOLDER_IMAGE];
  }
  function photoTag(item, cls){
    return '<img class="asset-photo ' + cls + '" src="' + itemImages(item)[0] + '" alt="" loading="lazy">';
  }

  function rowHTML(item){
    var selected = item.id === state.selected ? " selected" : "";
    return (
      '<div class="reg-row data' + selected + '" data-id="' + item.id + '">' +
        '<div class="asset-cell">' +
          photoTag(item, "asset-photo-row") +
          '<div style="min-width:0;">' +
            '<div class="asset-name">' + item.name + '</div>' +
            '<div class="asset-model">' + item.category + ' · ' + item.condition + '</div>' +
          '</div>' +
        '</div>' +
        '<div><span class="cell-label">Available</span><span class="qty-cell">' + unitsLabel(item) + '</span></div>' +
        '<div><span class="cell-label">Status</span>' + statusChip(item) + '</div>' +
        '<div class="action-cell"><button type="button" class="btn btn-navy btn-block" data-apply="' + item.id + '">View &amp; Apply</button></div>' +
      '</div>'
    );
  }

  function tileHTML(item){
    var selected = item.id === state.selected ? " selected" : "";
    return (
      '<div class="tile-card' + selected + '" data-id="' + item.id + '">' +
        photoTag(item, "asset-photo-tile") +
        '<div class="tile-body">' +
          '<div class="tile-name">' + item.name + '</div>' +
          '<div class="tile-sub">' + item.category + ' · ' + item.condition + '</div>' +
          '<div class="tile-foot">' +
            '<span class="qty-cell">' + unitsLabel(item) + '</span>' +
            statusChip(item) +
          '</div>' +
          '<button type="button" class="btn btn-navy btn-block" data-apply="' + item.id + '">View &amp; Apply</button>' +
        '</div>' +
      '</div>'
    );
  }

  function listHTML(item){
    var selected = item.id === state.selected ? " selected" : "";
    return (
      '<div class="list-row' + selected + '" data-id="' + item.id + '">' +
        photoTag(item, "asset-photo-list") +
        '<div class="list-texts">' +
          '<div class="list-title">' + item.name + '</div>' +
          '<div class="list-sub">' + item.category + ' · ' + unitsLabel(item) + '</div>' +
        '</div>' +
        statusChip(item) +
        '<button type="button" class="btn btn-outline" data-apply="' + item.id + '">View &amp; Apply</button>' +
      '</div>'
    );
  }

  var RENDERERS = { table: rowHTML, tiles: tileHTML, list: listHTML };

  function renderRegister(){
    var panel = document.getElementById("register-panel");
    var body = document.getElementById("register-body");
    var visible = EQUIPMENT.filter(matchesFilters);
    var page = paginate(visible, "register");

    if(panel) panel.className = "register mode-" + state.view;

    if(visible.length === 0){
      body.innerHTML = '<div class="empty-note">Nothing matches — try a different search.</div>';
    }else{
      var renderer = RENDERERS[state.view] || listHTML;
      body.innerHTML = page.items.map(renderer).join("");
      body.querySelectorAll("[data-apply]").forEach(function(btn){
        btn.addEventListener("click", function(){ openDrawer(btn.getAttribute("data-apply")); });
      });
    }
    renderPagination("register-pagination", "register", page.totalPages, page.page, renderRegister);
    // Tab badge counts live in the tabstrip, which may be rendered
    // outside this fragment (e.g. in a shared header). Guard rather
    // than assume it's present in this DOM subtree.
    var countRegisterEl = document.getElementById("count-register");
    if(countRegisterEl) countRegisterEl.textContent = EQUIPMENT.filter(isAvailable).length;
  }

  document.getElementById("search").addEventListener("input", function(e){
    state.search = e.target.value.trim();
    pageState.register = 1;
    renderRegister();
  });
  document.getElementById("cat-filter").addEventListener("change", function(e){
    state.cat = e.target.value;
    pageState.register = 1;
    renderRegister();
  });

  var viewSwitch = document.getElementById("view-switch");
  if(viewSwitch){
    viewSwitch.addEventListener("click", function(e){
      var btn = e.target.closest("button[data-view]");
      if(!btn) return;
      viewSwitch.querySelectorAll("button").forEach(function(b){ b.classList.remove("active"); });
      btn.classList.add("active");
      state.view = btn.getAttribute("data-view");
      renderRegister();
    });
  }

  /* ---------------- Info buttons (small popover, replaces long explanations) ---------------- */
  var infoBtns = document.querySelectorAll(".info-btn");
  function closeAllInfoPops(){
    document.querySelectorAll(".info-pop").forEach(function(p){ p.setAttribute("hidden", ""); });
    infoBtns.forEach(function(b){ b.setAttribute("aria-expanded", "false"); });
  }
  infoBtns.forEach(function(btn){
    btn.addEventListener("click", function(e){
      e.stopPropagation();
      var pop = document.getElementById(btn.getAttribute("data-info"));
      if(!pop) return;
      var wasOpen = !pop.hasAttribute("hidden");
      closeAllInfoPops();
      if(!wasOpen){
        pop.removeAttribute("hidden");
        btn.setAttribute("aria-expanded", "true");
      }
    });
  });
  document.querySelectorAll(".info-pop").forEach(function(pop){
    pop.addEventListener("click", function(e){ e.stopPropagation(); });
  });
  document.addEventListener("click", closeAllInfoPops);
  document.addEventListener("keydown", function(e){
    if(e.key === "Escape") closeAllInfoPops();
  });

  /* ---------------- Drawer ---------------- */
  var drawer = document.getElementById("drawer");
  var overlay = document.getElementById("drawer-overlay");

  /* -------- Photo gallery (inside the drawer) --------
     Every photo shown whole, as an equal-sized tile — no single cropped
     "hero" image. `currentGalleryImages` is just whatever the open item's
     `images` array is; tapping any tile opens the full-screen viewer below
     at that photo's position. */
  var currentGalleryImages = [];
  var galleryGrid = document.getElementById("gallery-grid");

  function renderGallery(item){
    currentGalleryImages = itemImages(item);
    galleryGrid.innerHTML = currentGalleryImages.map(function(src, i){
      return '<button type="button" class="gallery-tile" data-index="' + i + '" aria-label="Photo ' + (i + 1) + ' of ' + currentGalleryImages.length + '"><img src="' + src + '" alt=""></button>';
    }).join("");
  }

  galleryGrid.addEventListener("click", function(e){
    var btn = e.target.closest("button[data-index]");
    if(!btn) return;
    openLightbox(parseInt(btn.getAttribute("data-index"), 10));
  });

  /* View & Apply — applying for a currently-listed item. */
  function openDrawer(id){
    var item = EQUIPMENT.find(function(i){ return i.id === id; });
    if(!item) return;
    state.selected = id;
    renderRegister();

    document.getElementById("drawer-photos").hidden = false;
    renderGallery(item);
    document.getElementById("drawer-title").textContent = item.name;
    document.getElementById("drawer-sub").textContent = item.units + " available · Closes " + item.closeDate +
      (item.collectDeadline ? " · Collect by " + item.collectDeadline : "");
    document.getElementById("drawer-desc").textContent = item.description;
    document.getElementById("drawer-avail-chip").hidden = false;
    document.getElementById("drawer-chat").hidden = true;

    populateHospitalSelect(document.getElementById("apply-hospital"));
    document.getElementById("apply-qty").placeholder = "e.g. 1 (up to " + item.units + " available)";
    var qtyHintEl = document.getElementById("apply-qty-hint");
    var qtyErrorResetEl = document.getElementById("apply-qty-error");
    if(qtyHintEl){
      if(item.maxPerRequest){
        qtyHintEl.textContent = "You can request up to " + item.maxPerRequest + " unit" + (item.maxPerRequest === 1 ? "" : "s") + " of this item per request.";
        qtyHintEl.hidden = false;
      }else{
        qtyHintEl.hidden = true;
      }
    }
    if(qtyErrorResetEl){ qtyErrorResetEl.hidden = true; qtyErrorResetEl.textContent = ""; }
    document.getElementById("apply-situation").placeholder = item.situationPh;
    document.getElementById("apply-collection").placeholder = item.impactPh;
    document.getElementById("apply-form").reset();
    document.getElementById("apply-form").hidden = false;
    document.getElementById("apply-toast").classList.remove("show");

    document.getElementById("drawer-status-block").hidden = true;
    document.getElementById("drawer-foot").hidden = false;

    drawer.classList.add("open");
    overlay.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  /* View request — read-only look at something already submitted, opened
     from a My Requests row (forcedRole "hospital") or a Connect Office row
     (forcedRole "connect"). Reuses the same bottom sheet as View & Apply,
     but swaps the application form out for a plain-language status block.
     forcedRole is which "side" you're posting chat messages as while
     viewing from THIS tab — not a real permission check yet (see
     isConnectSide()'s comment); omit it to fall back to that role check.
     focusChat is true when this was opened via a row's dedicated chat
     icon (rather than the row itself) — it scrolls straight to the
     message thread and focuses the reply box instead of leaving the
     viewer to scroll past the status block first. */
  function openRequestDetail(ref, forcedRole, focusChat){
    var apps = loadApps();
    var app = apps.find(function(a){ return a.ref === ref; });
    if(!app) return;
    var item = app.assetId ? EQUIPMENT.find(function(i){ return i.id === app.assetId; }) : null;

    state.selected = null;
    renderRegister();

    document.getElementById("drawer-title").textContent = app.name;
    document.getElementById("drawer-sub").textContent = (app.hospital ? app.hospital + " · " : "") + "Submitted " + app.when;

    if(item){
      document.getElementById("drawer-photos").hidden = false;
      renderGallery(item);
      document.getElementById("drawer-desc").textContent = item.description;
    }else{
      document.getElementById("drawer-photos").hidden = true;
      currentGalleryImages = [];
    }
    document.getElementById("drawer-avail-chip").hidden = true;

    var meta = statusMeta(app.status);
    document.getElementById("drawer-req-status-chip").className = "status-chip " + meta.cls;
    document.getElementById("drawer-req-status-label").textContent = meta.label;
    document.getElementById("drawer-status-msg").textContent = meta.message;
    document.getElementById("drawer-status-meta").innerHTML = app.rin
      ? "Recycling Inventory Number: <b>" + app.rin + "</b>"
      : "";
    document.getElementById("drawer-status-block").hidden = false;

    // Approve/Reject only makes sense from the Requests (connect/admin)
    // column, and only while the request hasn't already been decided —
    // see setRequestStatus() below, which is what these buttons call.
    var adminActionsEl = document.getElementById("drawer-admin-actions");
    if(adminActionsEl){
      var actionable = ["Pending", "Under Review"].indexOf(app.status) !== -1;
      adminActionsEl.hidden = !(forcedRole === "connect" && showRequestsCol && actionable);
      adminActionsEl.dataset.ref = app.ref;
    }

    document.getElementById("apply-form").hidden = true;
    document.getElementById("drawer-foot").hidden = true;
    document.getElementById("apply-toast").classList.remove("show");

    openChatFor(app, forcedRole);

    drawer.classList.add("open");
    overlay.classList.add("open");
    document.body.style.overflow = "hidden";

    if(focusChat){
      setTimeout(function(){
        var chatEl = document.getElementById("drawer-chat");
        if(chatEl) chatEl.scrollIntoView({ behavior: "smooth", block: "start" });
        var input = document.getElementById("drawer-chat-input");
        if(input) input.focus();
      }, 200);
    }
  }

  /* ---------------- Admin decision (Approve / Reject) ----------------
     The only status-changing action available on this page today — every
     other transition in the STATUS_META pipeline (Under Review, Ready for
     Collection, Dispatched, Collected/Completed) still belongs to the real
     Missions Office workflow this page doesn't own. Approving a request
     also deducts its qty from the asset's remaining units (floored at 0),
     since that's the moment the units actually get committed to a
     hospital; qty is only ever set when the request was made through
     "View & Apply" (see the apply-form handler above) — older/other
     request kinds have no qty and simply don't touch stock. */
  function setRequestStatus(ref, newStatus){
    var apps = loadApps();
    var app = apps.find(function(a){ return a.ref === ref; });
    if(!app) return;
    var now = timeLabel();
    app.status = newStatus;
    if(!Array.isArray(app.statusHistory)) app.statusHistory = [];
    app.statusHistory.push({
      status: newStatus, when: now,
      note: newStatus === "Approved" ? "Approved by Missions Office" : "Not approved"
    });
    if(newStatus === "Approved" && app.assetId && app.qty){
      var asset = EQUIPMENT.find(function(i){ return i.id === app.assetId; });
      if(asset){
        asset.units = Math.max(0, (asset.units || 0) - app.qty);
        saveEquipment(EQUIPMENT);
      }
    }
    saveApps(apps);
    renderApps();
    renderConnectView();
    renderRegister();
    renderDashboard();
    openRequestDetail(ref, "connect");
  }
  var drawerApproveBtn = document.getElementById("drawer-approve-btn");
  var drawerRejectBtn = document.getElementById("drawer-reject-btn");
  if(drawerApproveBtn){
    drawerApproveBtn.addEventListener("click", function(){
      var ref = document.getElementById("drawer-admin-actions").dataset.ref;
      if(!ref) return;
      if(confirm("Approve this request? This will reduce the item's remaining units by the quantity requested.")){
        setRequestStatus(ref, "Approved");
      }
    });
  }
  if(drawerRejectBtn){
    drawerRejectBtn.addEventListener("click", function(){
      var ref = document.getElementById("drawer-admin-actions").dataset.ref;
      if(!ref) return;
      if(confirm("Reject this request?")){
        setRequestStatus(ref, "Rejected");
      }
    });
  }

  /* ---------------- Two-way chat on a request ----------------
     Same request record, viewed from either side — the hospital user who
     submitted it, or Missions Office / connect side reviewing it. Which
     one you are is decided by isConnectSide(), not by anything passed in
     here, so the same drawer works for both. Persisted onto the app
     record itself (app.chatThread), the same local store apps already
     live in — see the Mongo TODO on loadApps() above for what this
     becomes once requests are real API records. */
  var currentChatApp = null;
  var currentChatViewerRole = "hospital";
  // Which UI the chat is currently rendering into — "drawer" (embedded in
  // the full request-detail bottom sheet) or "popup" (the small standalone
  // modal opened from a row's chat icon). Both share all the logic below;
  // only the target element ids differ.
  var currentChatSurface = "drawer";
  var CHAT_SURFACE_IDS = {
    drawer: { thread: "drawer-chat-thread", input: "drawer-chat-input", error: "drawer-chat-error" },
    popup:  { thread: "chat-popup-thread",  input: "chat-popup-input",  error: "chat-popup-error" }
  };

  function escapeChatHtml(str){
    var div = document.createElement("div");
    div.textContent = str == null ? "" : String(str);
    return div.innerHTML;
  }
  function formatChatTime(iso){
    if(!iso) return "";
    var d = new Date(iso);
    if(isNaN(d.getTime())) return "";
    return d.toLocaleDateString(undefined, { day: "numeric", month: "short" }) + " · " +
           d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
  }
  function chatRoleLabel(role){
    return role === "connect" ? "Missions Office" : "Hospital";
  }

  function renderChatThread(app, viewerRole, surface){
    var thread = Array.isArray(app.chatThread) ? app.chatThread : [];
    var ids = CHAT_SURFACE_IDS[surface || "drawer"];
    var threadEl = document.getElementById(ids.thread);
    if(!threadEl) return;
    if(thread.length === 0){
      threadEl.innerHTML = '<p class="chat-empty-note">No messages yet — write one below.</p>';
      return;
    }
    threadEl.innerHTML = thread.map(function(msg){
      var mine = msg.authorRole === viewerRole;
      return (
        '<div class="chat-bubble-row ' + (mine ? "mine" : "theirs") + '">' +
          '<div class="chat-bubble">' +
            '<div class="chat-bubble-meta">' + escapeChatHtml(msg.authorName || chatRoleLabel(msg.authorRole)) + ' · ' + formatChatTime(msg.postedAt) + '</div>' +
            '<div class="chat-bubble-text">' + escapeChatHtml(msg.message) + '</div>' +
          '</div>' +
        '</div>'
      );
    }).join("");
    threadEl.scrollTop = threadEl.scrollHeight;
  }

  function unreadChatCount(app, viewerRole){
    var thread = Array.isArray(app.chatThread) ? app.chatThread : [];
    var lastRead = (app.lastRead && app.lastRead[viewerRole]) || null;
    return thread.filter(function(msg){
      return msg.authorRole !== viewerRole && (!lastRead || msg.postedAt > lastRead);
    }).length;
  }

  function markChatRead(app, viewerRole){
    if(!app.lastRead) app.lastRead = { hospital: null, connect: null };
    app.lastRead[viewerRole] = new Date().toISOString();
    var apps = loadApps();
    var idx = apps.findIndex(function(a){ return a.ref === app.ref; });
    if(idx !== -1){ apps[idx] = app; saveApps(apps); }
  }

  function openChatFor(app, forcedRole){
    currentChatApp = app;
    currentChatViewerRole = forcedRole || (isConnectSide() ? "connect" : "hospital");
    currentChatSurface = "drawer";
    if(!Array.isArray(app.chatThread)) app.chatThread = [];

    var chatTitleEl = document.querySelector("#drawer-chat .drawer-chat-title");
    if(chatTitleEl){
      chatTitleEl.textContent = "Messages about this request" +
        (currentChatViewerRole === "connect" ? " · viewing as Missions Office" : "");
    }
    renderChatThread(app, currentChatViewerRole, "drawer");
    document.getElementById("drawer-chat-input").value = "";
    document.getElementById("drawer-chat-error").hidden = true;
    document.getElementById("drawer-chat-error").textContent = "";
    document.getElementById("drawer-chat").hidden = false;

    markChatRead(app, currentChatViewerRole);
    renderApps(); // unread badges may have just cleared for this row
    renderConnectView();
  }

  /* ---------------- Chat popup (small modal, opened from a row's chat icon) ----------------
     Same app record + same render/send logic as the drawer's embedded
     chat above — just a smaller, dedicated surface so opening a
     conversation doesn't require pulling up the whole request detail. */
  var chatPopupEl = document.getElementById("chat-popup");
  var chatPopupOverlayEl = document.getElementById("chat-popup-overlay");

  function openChatPopup(ref, forcedRole){
    var apps = loadApps();
    var app = apps.find(function(a){ return a.ref === ref; });
    if(!app) return;
    if(!Array.isArray(app.chatThread)) app.chatThread = [];

    currentChatApp = app;
    currentChatViewerRole = forcedRole || (isConnectSide() ? "connect" : "hospital");
    currentChatSurface = "popup";

    document.getElementById("chat-popup-title").textContent = app.name;
    document.getElementById("chat-popup-sub").textContent =
      (app.hospital ? app.hospital + " · " : "") + "Ref " + app.ref +
      (currentChatViewerRole === "connect" ? " · viewing as Missions Office" : "");

    renderChatThread(app, currentChatViewerRole, "popup");
    document.getElementById("chat-popup-input").value = "";
    document.getElementById("chat-popup-error").hidden = true;
    document.getElementById("chat-popup-error").textContent = "";

    if(chatPopupEl) chatPopupEl.classList.add("open");
    if(chatPopupOverlayEl) chatPopupOverlayEl.classList.add("open");
    document.body.style.overflow = "hidden";

    markChatRead(app, currentChatViewerRole);
    renderApps(); // unread badges may have just cleared for this row
    renderConnectView();

    setTimeout(function(){
      var input = document.getElementById("chat-popup-input");
      if(input) input.focus();
    }, 50);
  }

  function closeChatPopup(){
    if(chatPopupEl) chatPopupEl.classList.remove("open");
    if(chatPopupOverlayEl) chatPopupOverlayEl.classList.remove("open");
    document.body.style.overflow = "";
  }

  if(document.getElementById("chat-popup-close")){
    document.getElementById("chat-popup-close").addEventListener("click", closeChatPopup);
  }
  if(chatPopupOverlayEl){
    chatPopupOverlayEl.addEventListener("click", closeChatPopup);
  }

  /* Shared send handler for both chat surfaces — reads/writes whichever
     input+error elements currentChatSurface points at, so the drawer's
     embedded chat and the popup don't need two copies of this logic. */
  function sendChatMessage(){
    if(!currentChatApp) return;
    var ids = CHAT_SURFACE_IDS[currentChatSurface];
    var input = document.getElementById(ids.input);
    var errorEl = document.getElementById(ids.error);
    var text = input.value.trim();
    if(!text){
      errorEl.textContent = "Please enter a message.";
      errorEl.hidden = false;
      return;
    }
    errorEl.hidden = true;
    errorEl.textContent = "";

    var userName = usrDetails?.data?.profile?.name ||
      (currentChatViewerRole === "connect" ? "Missions Office" : "Hospital");
    var msg = {
      message: text,
      authorRole: currentChatViewerRole,
      authorId: usrDetails?.data?._id || "",
      authorName: userName,
      postedAt: new Date().toISOString()
    };

    var apps = loadApps();
    var idx = apps.findIndex(function(a){ return a.ref === currentChatApp.ref; });
    if(idx === -1) return;
    if(!Array.isArray(apps[idx].chatThread)) apps[idx].chatThread = [];
    apps[idx].chatThread.push(msg);
    markChatRead(apps[idx], currentChatViewerRole); // my own message doesn't count as unread to me
    saveApps(apps);

    currentChatApp = apps[idx];
    renderChatThread(currentChatApp, currentChatViewerRole, currentChatSurface);
    input.value = "";
    renderApps();
    renderConnectView();
  }

  document.getElementById("drawer-chat-send").addEventListener("click", sendChatMessage);
  if(document.getElementById("chat-popup-send")){
    document.getElementById("chat-popup-send").addEventListener("click", sendChatMessage);
  }

  function closeDrawer(){
    drawer.classList.remove("open");
    overlay.classList.remove("open");
    document.body.style.overflow = "";
    state.selected = null;
    renderRegister();
  }

  document.getElementById("drawer-close").addEventListener("click", closeDrawer);
  overlay.addEventListener("click", closeDrawer);
  document.addEventListener("keydown", function(e){
    if(e.key !== "Escape") return;
    // Chat popup sits on top of everything else it could be opened over —
    // close it first rather than also closing the drawer/lightbox behind
    // it in the same keypress.
    if(chatPopupEl && chatPopupEl.classList.contains("open")){ closeChatPopup(); return; }
    // Photo viewer sits on top of the drawer — let it claim Escape first,
    // so closing the viewer doesn't also close the drawer behind it.
    if(drawer.classList.contains("open") && !lightbox.classList.contains("open")) closeDrawer();
  });

  /* -------- Photo viewer (full-screen, opened from the gallery) -------- */
  var lightbox = document.getElementById("lightbox");
  var lightboxImg = document.getElementById("lightbox-img");
  var lightboxCount = document.getElementById("lightbox-count");
  var lightboxPrev = document.getElementById("lightbox-prev");
  var lightboxNext = document.getElementById("lightbox-next");
  var galleryIndex = 0;

  function showGalleryImage(){
    lightboxImg.src = currentGalleryImages[galleryIndex];
    lightboxCount.textContent = (galleryIndex + 1) + " / " + currentGalleryImages.length;
  }
  function openLightbox(index){
    if(!currentGalleryImages.length) return;
    galleryIndex = index;
    var multi = currentGalleryImages.length > 1;
    lightboxPrev.hidden = !multi;
    lightboxNext.hidden = !multi;
    showGalleryImage();
    lightbox.classList.add("open");
  }
  function closeLightbox(){
    lightbox.classList.remove("open");
  }
  function stepGallery(delta){
    galleryIndex = (galleryIndex + delta + currentGalleryImages.length) % currentGalleryImages.length;
    showGalleryImage();
  }

  document.getElementById("lightbox-close").addEventListener("click", closeLightbox);
  lightboxPrev.addEventListener("click", function(){ stepGallery(-1); });
  lightboxNext.addEventListener("click", function(){ stepGallery(1); });
  lightbox.addEventListener("click", function(e){
    if(e.target === lightbox) closeLightbox(); // backdrop only — not the image or the buttons
  });
  document.addEventListener("keydown", function(e){
    if(!lightbox.classList.contains("open")) return;
    if(e.key === "Escape") closeLightbox();
    else if(e.key === "ArrowLeft") stepGallery(-1);
    else if(e.key === "ArrowRight") stepGallery(1);
  });

  /* Asset script starts*/
  var assetFormDrawer = document.getElementById("asset-form-drawer");
  if(assetFormDrawer){
    var assetFormOverlay = document.getElementById("asset-form-overlay");
    var addAssetBtn = document.getElementById("add-asset-btn");

    var assetDeadlineToggle = document.getElementById("asset-has-deadline");
    var assetDeadlineField = document.getElementById("asset-deadline-field");
    var assetDeadlineInput = document.getElementById("asset-collect-deadline");

    function openAssetForm(){
      document.getElementById("asset-form").reset();
      var closeDateInput = document.getElementById("asset-close-date");
      // Listings need to stay open at least MIN_LISTING_DAYS — see the
      // minListingDateISO() comment above for why.
      closeDateInput.min = minListingDateISO();
      document.getElementById("asset-close-date-error").hidden = true;
      document.getElementById("asset-close-date-error").textContent = "";

      if(assetDeadlineField){
        assetDeadlineField.hidden = true;
        assetDeadlineInput.required = false;
        assetDeadlineInput.value = "";
      }
      var deadlineErrorEl = document.getElementById("asset-collect-deadline-error");
      if(deadlineErrorEl){ deadlineErrorEl.hidden = true; deadlineErrorEl.textContent = ""; }

      document.getElementById("asset-form-toast").classList.remove("show");
      assetFormDrawer.classList.add("open");
      assetFormOverlay.classList.add("open");
      document.body.style.overflow = "hidden";
    }

    // "Deadline to collect" only shows once someone asks for it — the
    // checkbox is off (and the field hidden) by default, per the request
    // that this stay optional and out of the way otherwise.
    if(assetDeadlineToggle && assetDeadlineField){
      assetDeadlineToggle.addEventListener("change", function(){
        assetDeadlineField.hidden = !assetDeadlineToggle.checked;
        assetDeadlineInput.required = assetDeadlineToggle.checked;
        if(!assetDeadlineToggle.checked){
          assetDeadlineInput.value = "";
          var errEl = document.getElementById("asset-collect-deadline-error");
          if(errEl){ errEl.hidden = true; errEl.textContent = ""; }
        }
      });
    }
    function closeAssetForm(){
      assetFormDrawer.classList.remove("open");
      assetFormOverlay.classList.remove("open");
      document.body.style.overflow = "";
    }
    if(addAssetBtn) addAssetBtn.addEventListener("click", openAssetForm);
    document.getElementById("asset-form-close").addEventListener("click", closeAssetForm);
    document.getElementById("asset-form-cancel").addEventListener("click", closeAssetForm);
    assetFormOverlay.addEventListener("click", closeAssetForm);
    document.addEventListener("keydown", function(e){
      if(e.key === "Escape" && assetFormDrawer.classList.contains("open")) closeAssetForm();
    });

    document.getElementById("asset-form").addEventListener("submit", function(e){
      e.preventDefault();
      var name = document.getElementById("asset-name").value.trim();
      var category = document.getElementById("asset-category").value;
      var condition = document.getElementById("asset-condition").value;
      var model = document.getElementById("asset-model").value.trim();
      var units = parseInt(document.getElementById("asset-units").value, 10) || 0;
      var maxPerRequestRaw = parseInt(document.getElementById("asset-max-per-request").value, 10);
      var maxPerRequest = (maxPerRequestRaw && maxPerRequestRaw > 0) ? maxPerRequestRaw : null;
      var description = document.getElementById("asset-description").value.trim();
      var closeIso = document.getElementById("asset-close-date").value;
      var photoUrl = document.getElementById("asset-photo-url").value.trim();

      // Enforce the 2-month minimum listing window even if the date input's
      // native min attribute was bypassed (devtools, autofill, etc).
      var closeDateErrorEl = document.getElementById("asset-close-date-error");
      var minIso = minListingDateISO();
      if(closeIso < minIso){
        closeDateErrorEl.textContent = "Listings must stay open for at least 2 months — the earliest close date is " + formatCloseDate(minIso).full + ".";
        closeDateErrorEl.hidden = false;
        return;
      }
      closeDateErrorEl.hidden = true;
      closeDateErrorEl.textContent = "";

      var hasDeadline = assetDeadlineToggle && assetDeadlineToggle.checked;
      var deadlineIso = hasDeadline ? assetDeadlineInput.value : "";
      var deadlineErrorEl = document.getElementById("asset-collect-deadline-error");
      if(hasDeadline){
        if(!deadlineIso){
          deadlineErrorEl.textContent = "Add a date, or leave the box above unchecked.";
          deadlineErrorEl.hidden = false;
          return;
        }
        if(deadlineIso < closeIso){
          deadlineErrorEl.textContent = "The collection deadline should be on or after the listing's close date.";
          deadlineErrorEl.hidden = false;
          return;
        }
      }
      if(deadlineErrorEl){ deadlineErrorEl.hidden = true; deadlineErrorEl.textContent = ""; }

      var closeLabels = formatCloseDate(closeIso);
      var deadlineLabels = deadlineIso ? formatCloseDate(deadlineIso) : null;

      var item = {
        id: slugify(name),
        code: nextAssetCode(),
        name: name,
        model: model,
        category: category,
        catColor: CATEGORY_COLOR[category] || "var(--cat-diagnostic)",
        // No photo yet (that's the Mongo/DB migration) — show an emoji on
        // a tinted tile, same as every seeded item, instead of the plain
        // "no photo" placeholder icon.
        images: photoUrl ? [photoUrl] : [emojiImage(emojiFor(name), EMOJI_BG_HEX[category] || "#ECE9E1")],
        units: units,
        maxPerRequest: maxPerRequest,
        condition: condition,
        conditionClass: conditionClassFor(condition),
        description: description,
        addedISO: new Date().toISOString().slice(0, 10),
        closeDate: closeLabels.short,
        closeDateFull: closeLabels.full,
        closeDateISO: closeIso,
        // Optional — only present when "Set a deadline to collect it by?"
        // was checked. Everything that reads an item's deadline should
        // treat a missing collectDeadlineISO as "no deadline set".
        collectDeadlineISO: deadlineIso || null,
        collectDeadline: deadlineLabels ? deadlineLabels.full : null,
        situationPh: "e.g. Tell us about the situation this would help solve...",
        impactPh: "e.g. Tell us how you'd use it and how you'd collect it...",
        departmentPh: "e.g. Which department would use this"
      };

      EQUIPMENT.push(item);
      saveEquipment(EQUIPMENT);
      renderRegister();
      renderHistory();
      renderDashboard();
      showToast("asset-form-toast", "asset-form-toast-text", "Added — it's now showing in Available Equipment.");
      setTimeout(closeAssetForm, 1100);
    });
  }

  /* ---------------- History of equipment ----------------
     Everything ever added to EQUIPMENT, regardless of whether it's still
     browsable in Available Equipment — nothing here is filtered by
     matchesFilters()/isAvailable(), which is the whole point: a closed or
     fully-allotted item keeps showing here even after it drops out of the
     live register above. */
  var historyDrawer = document.getElementById("history-drawer");
  var historyOverlay = document.getElementById("history-overlay");
  var historyBtn = document.getElementById("history-btn");

  function historyStatus(item){
    if(item.units <= 0) return { label: "Fully allotted", cls: "neutral" };
    var d = daysUntilClose(item);
    if(d !== null && d < 0) return { label: "Closed", cls: "rejected" };
    if(d !== null && d <= 5) return { label: "Closing soon", cls: "open" };
    return { label: "Available", cls: "open" };
  }

  function renderHistory(){
    var list = document.getElementById("history-list");
    var wrap = document.getElementById("history-table-wrap");
    var empty = document.getElementById("history-empty");
    if(!list) return;

    if(EQUIPMENT.length === 0){
      wrap.style.display = "none";
      empty.hidden = false;
      return;
    }
    wrap.style.display = "block";
    empty.hidden = true;

    // Newest-added first; items with no addedISO (older demo data) sort
    // to the end rather than crashing the comparator.
    var sorted = EQUIPMENT.slice().sort(function(a, b){
      return (b.addedISO || "").localeCompare(a.addedISO || "");
    });
    var page = paginate(sorted, "history");

    list.innerHTML = page.items.map(function(item){
      var st = historyStatus(item);
      var canView = isAvailable(item);
      return (
        '<div class="log-row" data-id="' + item.id + '">' +
          '<div><span class="cell-label">Item</span><div class="log-name-wrap"><span class="log-name">' + item.name + '</span></div></div>' +
          '<div><span class="cell-label">Added / Closes</span>' +
            (item.addedISO ? "Added " + formatCloseDate(item.addedISO).short : "Added —") +
            ' · Closes ' + item.closeDate +
            (item.collectDeadline ? ' · Collect by ' + item.collectDeadline : '') +
          '</div>' +
          '<div><span class="cell-label">Status</span><span class="status-chip ' + st.cls + '"><span class="dot"></span>' + st.label + '</span></div>' +
          '<div class="action-cell">' + (canView ? '<button type="button" class="btn btn-outline" data-view-history="' + item.id + '">View</button>' : '') + '</div>' +
        '</div>'
      );
    }).join("");

    list.querySelectorAll("[data-view-history]").forEach(function(btn){
      btn.addEventListener("click", function(){
        closeHistoryDrawer();
        openDrawer(btn.getAttribute("data-view-history"));
      });
    });

    renderPagination("history-pagination", "history", page.totalPages, page.page, renderHistory);
  }

  function openHistoryDrawer(){
    renderHistory();
    historyDrawer.classList.add("open");
    historyOverlay.classList.add("open");
    document.body.style.overflow = "hidden";
  }
  function closeHistoryDrawer(){
    historyDrawer.classList.remove("open");
    historyOverlay.classList.remove("open");
    document.body.style.overflow = "";
  }
  if(historyBtn) historyBtn.addEventListener("click", openHistoryDrawer);
  if(document.getElementById("history-close")) document.getElementById("history-close").addEventListener("click", closeHistoryDrawer);
  if(historyOverlay) historyOverlay.addEventListener("click", closeHistoryDrawer);
  document.addEventListener("keydown", function(e){
    if(e.key === "Escape" && historyDrawer && historyDrawer.classList.contains("open")) closeHistoryDrawer();
  });

  /* ---------------- Admin Dashboard ----------------
     Missions-role-only consolidated view: KPI counts across every request
     in the local requests store, a per-hospital activity breakdown, and
     an editable Asset Manager table (units left + the maxPerRequest cap
     enforced by the apply-form handler above). Everything here reads the
     same EQUIPMENT/loadApps() stores as the rest of the page — see the
     Mongo TODO on loadApps()/loadEquipment() for what this becomes once
     requests carry a real, reliable hospital field. */
  var APPROVED_LIKE_STATUSES = ["Approved", "Ready for Collection", "Dispatched", "Collected", "Completed"];

  function renderDashboard(){
    var kpisEl = document.getElementById("eqp-dash-kpis");
    if(!kpisEl) return; // dashboard markup not on this page render — nothing to do

    var apps = loadApps();
    var totalUnits = EQUIPMENT.reduce(function(sum, i){ return sum + (i.units || 0); }, 0);
    var pendingCount = apps.filter(function(a){ return APPROVED_LIKE_STATUSES.indexOf(a.status) === -1 && a.status !== "Rejected" && a.status !== "Cancelled"; }).length;
    var approvedCount = apps.filter(function(a){ return APPROVED_LIKE_STATUSES.indexOf(a.status) !== -1; }).length;
    var rejectedCount = apps.filter(function(a){ return a.status === "Rejected"; }).length;

    var kpis = [
      { label: "Assets Listed", value: EQUIPMENT.length, accent: "" },
      { label: "Units In Stock", value: totalUnits, accent: "accent-gold" },
      { label: "Total Requests", value: apps.length, accent: "" },
      { label: "Pending Review", value: pendingCount, accent: "accent-amber" },
      { label: "Approved", value: approvedCount, accent: "accent-green" },
      { label: "Rejected", value: rejectedCount, accent: "accent-red" }
    ];
    kpisEl.innerHTML = kpis.map(function(k){
      return (
        '<div class="eqp-kpi ' + k.accent + '">' +
          '<div class="eqp-kpi-label">' + k.label + '</div>' +
          '<div class="eqp-kpi-value">' + k.value + '</div>' +
        '</div>'
      );
    }).join("");

    /* -------- Activity by hospital --------
       app.hospital is "" for every request today (the hospital picker on
       this page is currently a disabled placeholder — see
       populateHospitalSelect()'s call sites), so this will mostly show one
       "Not specified" row until that's wired up. The grouping logic itself
       is real and ready for when it is. */
    var hospitalsEl = document.getElementById("eqp-dash-hospitals");
    var hospitalsNoteEl = document.getElementById("eqp-dash-hospitals-note");
    var byHospital = {};
    apps.forEach(function(a){
      var h = a.hospital || "Not specified";
      if(!byHospital[h]) byHospital[h] = { total: 0, approved: 0, pending: 0, rejected: 0, last: null };
      var row = byHospital[h];
      row.total++;
      if(APPROVED_LIKE_STATUSES.indexOf(a.status) !== -1) row.approved++;
      else if(a.status === "Rejected") row.rejected++;
      else row.pending++;
      if(!row.last || a.when > row.last) row.last = a.when;
    });
    var hospitalNames = Object.keys(byHospital).sort();
    if(hospitalsEl){
      hospitalsEl.innerHTML = hospitalNames.length === 0
        ? '<tr><td colspan="6"><div class="empty-note">No requests have come in yet.</div></td></tr>'
        : hospitalNames.map(function(h){
            var r = byHospital[h];
            return (
              '<tr><td>' + h + '</td><td>' + r.total + '</td><td>' + r.approved + '</td>' +
              '<td>' + r.pending + '</td><td>' + r.rejected + '</td><td>' + (r.last || "—") + '</td></tr>'
            );
          }).join("");
    }
    if(hospitalsNoteEl){
      hospitalsNoteEl.hidden = !(hospitalNames.length > 0 && hospitalNames.every(function(h){ return h === "Not specified"; }));
    }

    /* -------- Asset manager -------- */
    var assetsEl = document.getElementById("eqp-dash-assets");
    if(assetsEl){
      if(EQUIPMENT.length === 0){
        assetsEl.innerHTML = '<tr><td colspan="6"><div class="empty-note">Nothing added to the register yet.</div></td></tr>';
      }else{
        assetsEl.innerHTML = EQUIPMENT.map(function(item){
          var reqCount = apps.filter(function(a){ return a.assetId === item.id; }).length;
          var st = historyStatus(item);
          return (
            '<tr>' +
              '<td>' + item.name + '</td>' +
              '<td>' + item.category + '</td>' +
              '<td>' + item.units + '</td>' +
              '<td><input type="number" min="1" class="eqp-unit-input" data-max-per-request="' + item.id + '" value="' + (item.maxPerRequest || "") + '" placeholder="No limit"></td>' +
              '<td><span class="status-chip ' + st.cls + '"><span class="dot"></span>' + st.label + '</span></td>' +
              '<td>' + reqCount + '</td>' +
            '</tr>'
          );
        }).join("");
        assetsEl.querySelectorAll("[data-max-per-request]").forEach(function(input){
          input.addEventListener("change", function(){
            var id = input.getAttribute("data-max-per-request");
            var asset = EQUIPMENT.find(function(i){ return i.id === id; });
            if(!asset) return;
            var val = parseInt(input.value, 10);
            asset.maxPerRequest = (val && val > 0) ? val : null;
            saveEquipment(EQUIPMENT);
            input.value = asset.maxPerRequest || "";
          });
        });
      }
    }
  }

  function switchEqpView(name){
    // Visibility here is driven by the .active class (see
    // .eqp-page .view / .view.active in styles.scss, the same mechanism
    // view-register already used) — hidden is also kept in sync since
    // [hidden] carries !important and would otherwise fight it.
    var regView = document.getElementById("view-register");
    var dashView = document.getElementById("view-dashboard");
    if(regView){
      regView.classList.toggle("active", name === "register");
      regView.hidden = (name !== "register");
    }
    if(dashView){
      dashView.classList.toggle("active", name === "dashboard");
      dashView.hidden = (name !== "dashboard");
    }
    if(name === "dashboard") renderDashboard();
  }
  var dashboardBtn = document.getElementById("dashboard-btn");
  if(dashboardBtn){
    dashboardBtn.hidden = !showRequestsCol;
    dashboardBtn.addEventListener("click", function(){ switchEqpView("dashboard"); });
  }
  var dashboardBackBtn = document.getElementById("dashboard-back-btn");
  if(dashboardBackBtn) dashboardBackBtn.addEventListener("click", function(){ switchEqpView("register"); });

  /* ---------------- My Requests log ---------------- */
  function timeLabel(){
    var d = new Date();
    return d.toLocaleDateString(undefined, { day:"numeric", month:"short", year:"numeric" }) + " · " +
           d.toLocaleTimeString(undefined, { hour:"2-digit", minute:"2-digit" });
  }

  /* Chat as its own action icon per row, separate from tapping the row
     (row still opens full detail; the icon jumps straight to the thread —
     see openRequestDetail's focusChat). Badge is that row's unread count
     for whichever side is viewing this list (hospital in My Requests,
     connect in Connect Office). */
  var CHAT_ICON_SVG = '<svg class="icon" viewBox="0 0 24 24"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>';
  function chatIconHTML(ref, unread){
    return (
      '<button type="button" class="chat-icon-btn' + (unread > 0 ? " has-unread" : "") + '" data-chat-ref="' + ref + '" aria-label="Chat about this request" title="Chat">' +
        CHAT_ICON_SVG +
        (unread > 0 ? '<span class="chat-unread-badge" title="' + unread + ' new message' + (unread === 1 ? "" : "s") + '">' + unread + '</span>' : '') +
      '</button>'
    );
  }
  /* The chat icon now opens the small chat popup directly (openChatPopup)
     instead of jumping into the full request-detail drawer — tapping the
     row itself still opens that full detail (with the same chat thread
     built into it, further down). focusChat is no longer needed here
     since the popup IS the chat view, but the param is left accepted
     (unused) rather than touching every call site's signature. */
  function wireChatIcons(list, role, focusChat){
    list.querySelectorAll("[data-chat-ref]").forEach(function(btn){
      btn.addEventListener("click", function(e){
        e.stopPropagation(); // don't also trigger the row's own click handler
        openChatPopup(btn.getAttribute("data-chat-ref"), role);
      });
    });
  }
  function setTabBadge(id, count){
    var el = document.getElementById(id);
    if(!el) return;
    if(count > 0){ el.textContent = count; el.hidden = false; }
    else{ el.hidden = true; el.textContent = ""; }
  }

  function renderApps(){
    var apps = loadApps();
    var empty = document.getElementById("apps-empty");
    var tableWrap = document.getElementById("apps-table-wrap");
    var list = document.getElementById("apps-list");
    var countMyReqEl = document.getElementById("count-myrequests");
    if(countMyReqEl) countMyReqEl.textContent = apps.length;
    setTabBadge("tab-badge-myrequests", apps.reduce(function(sum, a){ return sum + unreadChatCount(a, "hospital"); }, 0));
    if(apps.length === 0){
      empty.style.display = "block";
      tableWrap.style.display = "none";
      renderPagination("apps-pagination", "apps", 1, 1, renderApps);
      return;
    }
    empty.style.display = "none";
    tableWrap.style.display = "block";
    // This tab IS the hospital/requester side, regardless of the viewer's
    // actual role — see openRequestDetail's forcedRole comment.
    var reversed = apps.slice().reverse();
    var page = paginate(reversed, "apps");
    list.innerHTML = page.items.map(function(a){
      var meta = statusMeta(a.status);
      var unread = unreadChatCount(a, "hospital");
      return (
        '<div class="req-card" data-ref="' + a.ref + '">' +
          '<div class="req-card-top">' +
            '<div><div class="req-card-name">' + a.name + '</div>' +
              (a.rin ? '<span class="rin-note">RIN ' + a.rin + '</span>' : '') +
            '</div>' +
            chatIconHTML(a.ref, unread) +
          '</div>' +
          '<div class="req-card-meta">' + a.kind + ' · ' + a.when + '</div>' +
          '<span class="status-chip ' + meta.cls + '"><span class="dot"></span>' + meta.label + '</span>' +
        '</div>'
      );
    }).join("");
    list.querySelectorAll(".req-card").forEach(function(row){
      row.addEventListener("click", function(){ openRequestDetail(row.getAttribute("data-ref"), "hospital"); });
    });
    wireChatIcons(list, "hospital", true);
    renderPagination("apps-pagination", "apps", page.totalPages, page.page, renderApps);
  }

  /* ---------------- Connect Office (Missions Office / connect side) ----------------
     Same underlying apps store as My Requests above, but every request
     from every hospital, with a Hospital column, and opened in "connect"
     posting mode so replies from here go out as Missions Office. */
  function renderConnectView(){
    var apps = loadApps();
    var empty = document.getElementById("connect-empty");
    var tableWrap = document.getElementById("connect-table-wrap");
    var list = document.getElementById("connect-list");
    if(!list) return;
    var countConnectEl = document.getElementById("count-connectview");
    if(countConnectEl) countConnectEl.textContent = apps.length;
    setTabBadge("tab-badge-connectview", apps.reduce(function(sum, a){ return sum + unreadChatCount(a, "connect"); }, 0));
    if(apps.length === 0){
      empty.style.display = "block";
      tableWrap.style.display = "none";
      renderPagination("connect-pagination", "connect", 1, 1, renderConnectView);
      return;
    }
    empty.style.display = "none";
    tableWrap.style.display = "block";
    var reversed = apps.slice().reverse();
    var page = paginate(reversed, "connect");
    list.innerHTML = page.items.map(function(a){
      var meta = statusMeta(a.status);
      var unread = unreadChatCount(a, "connect");
      return (
        '<div class="req-card" data-ref="' + a.ref + '">' +
          '<div class="req-card-top">' +
            '<div><div class="req-card-name">' + a.name + '</div>' +
              (a.rin ? '<span class="rin-note">RIN ' + a.rin + '</span>' : '') +
            '</div>' +
            chatIconHTML(a.ref, unread) +
          '</div>' +
          '<div class="req-card-meta">' + (a.hospital || "—") + ' · ' + a.kind + ' · ' + a.when + '</div>' +
          '<span class="status-chip ' + meta.cls + '"><span class="dot"></span>' + meta.label + '</span>' +
        '</div>'
      );
    }).join("");
    wireChatIcons(list, "connect", true);
    renderPagination("connect-pagination", "connect", page.totalPages, page.page, renderConnectView);
    list.querySelectorAll(".req-card").forEach(function(row){
      row.addEventListener("click", function(){ openRequestDetail(row.getAttribute("data-ref"), "connect"); });
    });
  }

  function addApp(kind, name, opts){
    opts = opts || {};
    var apps = loadApps();
    var now = timeLabel();
    // status/statusHistory/rin mirror AssetRequest's real shape (see
    // equipment-resources-missions-collection-schema.md) — every new
    // request starts Pending; everything past that is set by whoever
    // (Missions Office / ARO) acts on it elsewhere, not from this page.
    apps.push({
      ref: nextRequestId(), kind: kind, name: name, when: now,
      hospital: opts.hospital || "", assetId: opts.assetId || null,
      qty: opts.qty || null,
      status: "Pending", rin: null,
      statusHistory: [{ status: "Pending", when: now, note: "Submitted" }],
      chatThread: [],
      lastRead: { hospital: null, connect: null }
    });
    saveApps(apps);
    renderApps();
    renderConnectView();
    renderDashboard();
  }

  function showToast(id, textId, msg){
    var toast = document.getElementById(id);
    if(msg) document.getElementById(textId).textContent = msg;
    toast.classList.add("show");
    clearTimeout(toast._t);
    toast._t = setTimeout(function(){ toast.classList.remove("show"); }, 4000);
  }

  /* ---------------- Forms ---------------- */
  document.getElementById("apply-form").addEventListener("submit", function(e){
    e.preventDefault();
    var item = EQUIPMENT.find(function(i){ return i.id === state.selected; });
    if(!item) return;
    // Optional-chained: the hospital select is swapped for a plain "Test
    // Hospital" label on this page right now, so the element may not
    // exist — don't let that throw and block the whole submit.
    var hospital = document.getElementById("apply-hospital")?.value || "";
    var qty = parseInt(document.getElementById("apply-qty").value, 10) || 0;
    var qtyErrorEl = document.getElementById("apply-qty-error");
    // Per-request cap only (see asset.maxPerRequest, set from the Add
    // Equipment form / Admin Dashboard's Asset Manager table) — this is
    // deliberately not also checked against item.units (remaining stock);
    // that's enforced later, when a nodal/admin Approves the request.
    if(item.maxPerRequest && qty > item.maxPerRequest){
      qtyErrorEl.textContent = "You can request up to " + item.maxPerRequest + " unit" + (item.maxPerRequest === 1 ? "" : "s") + " of this item per request.";
      qtyErrorEl.hidden = false;
      return;
    }
    if(qtyErrorEl){ qtyErrorEl.hidden = true; qtyErrorEl.textContent = ""; }
    addApp("Application", item.name, { hospital: hospital, assetId: item.id, qty: qty || null });
    showToast("apply-toast", "apply-toast-text", "Sent — check My Requests to see it.");
    setTimeout(closeDrawer, 1100);
  });
  document.getElementById("apply-draft").addEventListener("click", function(){
    showToast("apply-toast", "apply-toast-text", "Saved. Come back anytime to finish.");
  });

  /* ---------------- Supporting document picker (New Request) ----------------
     Present only if the form includes the optional file field — keeps
     this file working whether or not that field exists on the page. */
  var REQ_DOC_DEFAULT = "Attach quote or specification (optional)";
  var reqDocInput = document.getElementById("req-doc");
  var reqDocLabelText = document.getElementById("req-doc-label");
  var reqDocLabelEl = reqDocLabelText ? reqDocLabelText.closest(".file-input") : null;

  function resetReqDoc(){
    if(!reqDocInput) return;
    reqDocInput.value = "";
    reqDocLabelText.textContent = REQ_DOC_DEFAULT;
    if(reqDocLabelEl) reqDocLabelEl.classList.remove("has-file");
  }

  if(reqDocInput){
    reqDocInput.addEventListener("change", function(){
      var file = reqDocInput.files && reqDocInput.files[0];
      if(file){
        reqDocLabelText.textContent = file.name;
        if(reqDocLabelEl) reqDocLabelEl.classList.add("has-file");
      }else{
        resetReqDoc();
      }
    });
  }

  document.getElementById("request-form").addEventListener("submit", function(e){
    e.preventDefault();
    var name = document.getElementById("req-name").value || "Equipment request";
    // Same optional-chain guard as the apply-form handler above — see its
    // comment.
    var hospital = document.getElementById("req-hospital")?.value || "";
    addApp("Request", name, { hospital: hospital, assetId: null });
    showToast("req-toast", "req-toast-text", "Sent — check My Requests to see it.");
    this.reset();
    resetReqDoc();
  });
  document.getElementById("req-draft").addEventListener("click", function(){
    showToast("req-toast", "req-toast-text", "Saved. Come back anytime to finish.");
  });

  populateHospitalSelect(document.getElementById("req-hospital"));
  populateHospitalSelect(document.getElementById("apply-hospital"));

  renderRegister();
  renderApps();
  renderConnectView();
  renderHistory();

}
  /* Asset script ends*/

//SAM Project script starts
/* ==========================================================================
   SAM Project — Applicant/Admin Dashboard + Two-Way Chat + Training Report
   Add this whole block to formLoad.js. It follows the exact same pattern as
   the existing FOV Grants code in this file (loadFovApplication,
   loadFovAppStatusTable, the fovFeedback comment handlers, RequestChangeBtn)
   — only the collection name, statuses and chat direction differ. See the
   accompanying samDashboard.dynamicRender.additions.js for the render
   functions this calls (renderFunctions.samAppChat/samAppView/samReportView).

   HYBRID MODE (current state): the FormIO *schema* for
   "samProjectApplicationForm" is already deployed for real in your MongoDB
   FormIO collection (confirmed against the live rendered form), so schema
   lookups for it go straight to the real fetchCollectionData call — see
   getSamFormSchema() below, and its use inside samProjectApplication().
   Everything else — the actual application/report *records* (Save Draft /
   Submit, the Applicant/Admin dashboard tables, admin status-change
   actions, chat send/delete) and the "samTrainingReportForm" schema (which
   isn't deployed for real yet) — still goes through the SamLocalStore block
   right below, which persists to the browser's localStorage instead of
   MongoDB. This is a deliberate stand-in, not a mistake: samProjectApplicationForm/
   samTrainingReportForm don't exist as real MongoDB *collections* yet
   (only the one schema document does), so every call site that reads/writes
   application or report records still calls SamLocalStore instead of
   fetchCollectionData — nothing about how those functions are wired
   together changed, only what they call to persist data.

   SWITCHING TO REAL MONGODB LATER: once samProjectApplicationForm /
   samTrainingReportForm exist as real collections (and samTrainingReportForm's
   schema is seeded into FormIO), swap each remaining SamLocalStore.find/
   insert/update call back to the matching fetchCollectionData('fetchCollectionData'
   | 'insertCollectionData' | 'updateCollectionData', {...}) call — every call
   site below is commented with what that real call looked like, so it's a
   like-for-like swap, not a rewrite. getSamFormSchema('samTrainingReportForm')
   already knows to fall back to the real call the moment that formKey is
   added to a live FormIO document too — see its own comment. (Everything
   else in this file — FOV, Council, etc. — was never touched and still
   calls fetchCollectionData directly.)
   ========================================================================== */

// -------- shared state --------
let currentSamChatRecord = null;
let samChatEditor = null;
let samApplicationTable;
let samAppStatusTable;
let samReportTable;
let samReportStatusTable;

// -------- SamLocalStore: localStorage-backed stand-in for MongoDB --------
// See the header comment above. Supports exactly the query/modifier shapes
// this file actually uses: plain equality (incl. dot-path keys like
// "added.userId"), $regex, $ne, sort/limit in options, and $set/$push
// modifiers on update. Swap to real fetchCollectionData calls once
// samProjectApplicationForm/samTrainingReportForm are real MongoDB
// *record* collections — see each call site below for the exact original
// call. (samProjectApplicationForm's *schema* already comes from the real
// FormIO collection — see getSamFormSchema() below, not SCHEMAS here.)
const SamLocalStore = (function () {
  const STORE_PREFIX = 'samLocalDemo__';

  // Only samTrainingReportForm's schema lives here now — it isn't deployed
  // to the real FormIO collection yet. samProjectApplicationForm's schema
  // used to be duplicated in here too, but that schema is already live in
  // your real database (see getSamFormSchema()), so keeping a second,
  // hand-maintained copy here was just a staleness risk with no upside —
  // removed. Kept in sync with sam-training-report.form.io.json in this
  // project; if you edit that schema file, paste the updated JSON in here
  // too (or, once samTrainingReportForm is seeded into your real FormIO
  // collection, delete this SCHEMAS block entirely and add its formKey to
  // REAL_DB_FORM_KEYS below).
  const SCHEMAS = {
    samTrainingReportForm: {
      "title": "SAM Project \u2014 Training Report",
      "name": "samTrainingReport",
      "path": "samtrainingreport",
      "display": "form",
      "type": "form",
      "components": [
        {
          "type": "content",
          "key": "reportHeader",
          "input": false,
          "html": "<div class=\"sam-header text-center mb-4\">\n  <p class=\"sam-eyebrow\">Post-Training</p>\n  <h2 class=\"sam-title\">Training Report</h2>\n  <p class=\"sam-subtitle\">Tell us how your time at CMC Vellore went, so we can share your progress with the MBBS 1978 Alumni Batch and the Missions Office.</p>\n</div>"
        },
        {
          "type": "textfield",
          "key": "samGrantId",
          "label": "SAM Grant ID",
          "input": true,
          "disabled": true,
          "tableView": true
        },
        {
          "type": "textfield",
          "key": "reportStatus",
          "label": "Report Status",
          "input": true,
          "disabled": true,
          "hidden": true,
          "defaultValue": "Draft",
          "clearOnHide": false,
          "tableView": false
        },
        {
          "type": "columns",
          "key": "columnsReportBasics",
          "input": false,
          "columns": [
            {
              "width": 6,
              "size": "md",
              "components": [
                {
                  "type": "textfield",
                  "key": "trainingArea",
                  "label": "Area Trained In",
                  "validate": {
                    "required": true
                  },
                  "input": true
                }
              ]
            },
            {
              "width": 6,
              "size": "md",
              "components": [
                {
                  "type": "datetime",
                  "key": "trainingCompletedDate",
                  "label": "Training Completed On",
                  "format": "dd-MM-yyyy",
                  "enableTime": false,
                  "validate": {
                    "required": true
                  },
                  "input": true
                }
              ]
            }
          ]
        },
        {
          "type": "textarea",
          "key": "reportSummary",
          "label": "What did you learn, and how will you apply it at your mission hospital?",
          "autoExpand": true,
          "rows": 6,
          "validate": {
            "required": true
          },
          "input": true
        },
        {
          "type": "textarea",
          "key": "reportImpact",
          "label": "Expected impact on patient care at your hospital",
          "description": "Optional, but helpful for the Grant Committee's records.",
          "autoExpand": true,
          "rows": 3,
          "validate": {
            "required": false
          },
          "input": true
        },
        {
          "type": "file",
          "key": "reportDocuments",
          "label": "Supporting documents (certificate, photos, etc.)",
          "storage": "base64",
          "webcam": false,
          "multiple": true,
          "filePattern": ".pdf,.jpg,.jpeg,.png",
          "fileMaxSize": "5MB",
          "validate": {
            "required": false
          },
          "input": true
        },
        {
          "type": "button",
          "key": "saveDraft",
          "label": "Save as Draft",
          "action": "event",
          "event": "saveDraft",
          "size": "lg",
          "block": false,
          "customClass": "sam-btn-outline d-inline-block px-4 me-2",
          "input": true,
          "tableView": false
        },
        {
          "type": "button",
          "key": "submit",
          "label": "Submit Report",
          "action": "submit",
          "size": "lg",
          "block": false,
          "customClass": "sam-btn-gold d-inline-block px-4",
          "input": true,
          "tableView": false,
          "theme": "primary"
        }
      ]
    }
  };

  function readCollection(name) {
    try {
      return JSON.parse(localStorage.getItem(STORE_PREFIX + name)) || [];
    } catch (e) {
      console.warn('SamLocalStore: could not read', name, 'from localStorage, starting empty', e);
      return [];
    }
  }

  function writeCollection(name, list) {
    localStorage.setItem(STORE_PREFIX + name, JSON.stringify(list));
  }

  function getPath(obj, path) {
    return String(path).split('.').reduce((o, k) => (o === null || o === undefined ? undefined : o[k]), obj);
  }

  function matchQuery(doc, query) {
    return Object.keys(query || {}).every((key) => {
      const cond = query[key];
      const val = getPath(doc, key);
      if (cond && typeof cond === 'object' && !Array.isArray(cond)) {
        if ('$regex' in cond) return new RegExp(cond.$regex, cond.$options || '').test(val || '');
        if ('$ne' in cond) return val !== cond.$ne;
        if ('$in' in cond) return Array.isArray(cond.$in) && cond.$in.includes(val);
        return JSON.stringify(val) === JSON.stringify(cond);
      }
      return val === cond;
    });
  }

  function applySort(list, sort) {
    const entries = Object.entries(sort || {});
    if (!entries.length) return list;
    return list.slice().sort((a, b) => {
      for (const [key, dir] of entries) {
        const av = getPath(a, key), bv = getPath(b, key);
        if (av < bv) return dir === -1 ? 1 : -1;
        if (av > bv) return dir === -1 ? -1 : 1;
      }
      return 0;
    });
  }

  function generateId() {
    return 'local_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 10);
  }

  // Fired after every successful insert()/update() so anything currently on
  // screen (a DataTable, an unread badge) can react without the page being
  // refreshed. See the 'sam:dataChanged' listener below the IIFE for what
  // consumes this.
  function notifyChange(collection) {
    try {
      window.dispatchEvent(new CustomEvent('sam:dataChanged', { detail: { collection: collection } }));
    } catch (e) {
      // CustomEvent should exist everywhere this app runs; if it somehow
      // doesn't, the write itself still succeeded — only the auto-refresh
      // is skipped, so this is safe to swallow rather than throw.
    }
  }

  return {
    // was: fetchCollectionData('fetchCollectionData', { collection, query, projection, options })
    find(collection, query = {}, options = {}) {
      let list = readCollection(collection).filter((doc) => matchQuery(doc, query));
      if (options.sort) list = applySort(list, options.sort);
      if (options.limit) list = list.slice(0, options.limit);
      return { data: list };
    },
    // was: fetchCollectionData('insertCollectionData', { collection, query: doc })
    insert(collection, doc) {
      const list = readCollection(collection);
      const record = Object.assign({}, doc, { _id: doc._id || generateId() });
      list.push(record);
      writeCollection(collection, list);
      notifyChange(collection);
      return { data: { _id: record._id, insertedId: record._id } };
    },
    // was: fetchCollectionData('updateCollectionData', { collection, query: { selector, data: modifier } })
    update(collection, selector, modifier = {}) {
      const list = readCollection(collection);
      const idx = list.findIndex((doc) => matchQuery(doc, selector));
      if (idx === -1) return { data: { error: true, reason: 'Record not found in local demo storage.' } };
      const next = Object.assign({}, list[idx]);
      if (modifier.$set) Object.assign(next, modifier.$set);
      if (modifier.$push) {
        Object.entries(modifier.$push).forEach(([k, v]) => {
          const arr = Array.isArray(next[k]) ? next[k].slice() : [];
          arr.push(v);
          next[k] = arr;
        });
      }
      if (!modifier.$set && !modifier.$push) Object.assign(next, modifier);
      list[idx] = next;
      writeCollection(collection, list);
      notifyChange(collection);
      return { data: { success: true } };
    },
    // was: fetchCollectionData('fetchCollectionData', { collection: 'FormIO', query: { formKey } })
    getFormSchema(formKey) {
      const schema = SCHEMAS[formKey];
      return { data: schema ? [schema] : [] };
    },
    // console helpers — same as the ones the standalone shim shipped with
    dump(collection) {
      if (collection) return readCollection(collection);
      const all = {};
      Object.keys(SCHEMAS).forEach((c) => { all[c] = readCollection(c); });
      return all;
    },
    clear(collection) {
      if (collection) localStorage.removeItem(STORE_PREFIX + collection);
      else Object.keys(SCHEMAS).forEach((c) => localStorage.removeItem(STORE_PREFIX + c));
      console.info('SamLocalStore: cleared', collection || 'all SAM demo collections');
    }
  };
})();
// Exposed on window (not just the top-level `const` above) so
// samDashboard.dynamicRender.additions.js — a separate <script> — can reach
// it reliably regardless of script load order, and so it's available as a
// console helper: SamLocalDemo.dump(...)/.clear(...).
window.SamLocalStore = SamLocalStore;
window.SamLocalDemo = SamLocalStore;

// -------- FormIO schema routing (real DB vs. local demo) --------
// samProjectApplicationForm's schema is already deployed for real in your
// FormIO collection — confirmed against the live rendered form — so it's
// fetched with the exact same fetchCollectionData call every other schema
// lookup in this app uses. samTrainingReportForm has no real schema seeded
// yet, so it still falls back to SamLocalStore's embedded copy. This is the
// single place that decision is made — samProjectApplication() and
// loadSamTrainingReportForm() both call this instead of picking between
// fetchCollectionData/SamLocalStore themselves, so adding a formKey here
// (once its schema is seeded into your real FormIO collection) is a
// one-line change, not a hunt through every call site.
const REAL_DB_FORM_KEYS = ['samProjectApplicationForm'];

async function getSamFormSchema(formKey) {
  if (REAL_DB_FORM_KEYS.includes(formKey)) {
    // was always: fetchCollectionData('fetchCollectionData', { collection: "FormIO", query: { formKey } })
    return fetchCollectionData('fetchCollectionData', { collection: 'FormIO', query: { formKey } });
  }
  return SamLocalStore.getFormSchema(formKey);
}
window.getSamFormSchema = getSamFormSchema;

// -------- Dynamic reflection: auto-refresh visible tables on data change --------
// SamLocalStore.insert()/update() dispatch a 'sam:dataChanged' CustomEvent on
// every successful write — Save Draft, Submit, admin Approve/Reject/Start
// Review/Reopen, chat send/delete. This single listener reacts to it and
// redraws whichever of the four SAM DataTables are currently initialized and
// on screen, using ajax.reload(null, false) (false = keep the current paging
// position instead of jumping back to page 1). This replaces the old
// approach of each handler manually reloading the one table it happened to
// know about — e.g. approving from the "All" tab previously wouldn't touch a
// "Submitted" tab table sitting on screen, and a status change made from one
// place had no way to tell a *different* currently-open table to refresh.
// Registered once at load time (top-level, not inside a function), so it
// never gets re-bound/duplicated across page loads.
function reloadSamTableIfMounted(selector) {
  if (typeof $ !== 'undefined' && $.fn.DataTable && $.fn.DataTable.isDataTable(selector)) {
    $(selector).DataTable().ajax.reload(null, false);
  }
}
window.addEventListener('sam:dataChanged', function (e) {
  const collection = e.detail && e.detail.collection;
  if (collection === 'samProjectApplicationForm') {
    reloadSamTableIfMounted('#samApplicationTable');
    reloadSamTableIfMounted('#samAppStatusTable');
  } else if (collection === 'samTrainingReportForm') {
    reloadSamTableIfMounted('#samReportTable');
    reloadSamTableIfMounted('#samReportStatusTable');
  }
  updateSamChatNotifications();
});

// -------- Chat notifications: unread badges --------
// A message counts as unread for a viewer if it was posted by the OTHER
// role and after that viewer's last-read timestamp for that record. Read
// state is tracked per (record, viewerRole) in its own localStorage
// namespace, separate from SamLocalStore's collections — it's UI state, not
// application data, so it's never sent through insert()/update() and never
// shows up in SamLocalDemo.dump().
const SAM_CHAT_READ_PREFIX = 'samLocalDemo__chatRead__';

function getSamChatLastRead(recordId, viewerRole) {
  try {
    return localStorage.getItem(SAM_CHAT_READ_PREFIX + recordId + '__' + viewerRole) || '';
  } catch (e) {
    return '';
  }
}

function markSamChatRead(recordId, viewerRole) {
  try {
    localStorage.setItem(SAM_CHAT_READ_PREFIX + recordId + '__' + viewerRole, new Date().toISOString());
  } catch (e) {
    // localStorage unavailable — badges just won't clear, nothing breaks.
  }
  updateSamChatNotifications();
}

// Counts messages authored by the OTHER role, posted after this viewer's
// last-read time for this record. Own messages never count as unread for
// yourself, so no special-casing is needed when you send one.
function getSamUnreadCount(row, viewerRole) {
  const thread = Array.isArray(row?.samChatThread) ? row.samChatThread : [];
  if (!thread.length) return 0;
  const lastRead = getSamChatLastRead(row._id, viewerRole);
  const lastReadTime = lastRead ? new Date(lastRead).getTime() : 0;
  return thread.filter((m) => {
    if (m.authorRole === viewerRole) return false;
    const postedTime = m.postedAt ? new Date(m.postedAt).getTime() : 0;
    return postedTime > lastReadTime;
  }).length;
}

function samUnreadBadgeHtml(count) {
  if (!count) return '';
  return `<span class="sam-unread-badge">${count > 9 ? '9+' : count}</span>`;
}

// Sidebar-level "you have unread messages somewhere" badges — separate from
// the per-row badges in the DataTable Chat columns, since each dashboard
// page's DataTable only ever has ONE status tab's rows loaded at a time, so
// it can't by itself tell you about unread messages sitting in a different
// tab. Scans every non-deleted application directly via SamLocalStore
// (cheap — it's just localStorage) rather than relying on whichever tab's
// table happens to be mounted right now.
function updateSamChatNotifications() {
  const applicantBtn = document.querySelector('.sam-sidebar-btn[data-page="samAppDetailsPage"]');
  if (applicantBtn) {
    const userId = usrDetails?.data?._id || '';
    const mine = SamLocalStore.find('samProjectApplicationForm', { isDeleted: false, 'added.userId': userId }).data || [];
    const total = mine.reduce((sum, row) => sum + getSamUnreadCount(row, 'applicant'), 0);
    renderSamSidebarBadge(applicantBtn, total);
  }
  const adminBtn = document.querySelector('.sam-sidebar-btn[data-page="samApplicationPage"]');
  if (adminBtn) {
    const all = SamLocalStore.find('samProjectApplicationForm', { isDeleted: false }).data || [];
    const total = all.reduce((sum, row) => sum + getSamUnreadCount(row, 'admin'), 0);
    renderSamSidebarBadge(adminBtn, total);
  }
}

function renderSamSidebarBadge(buttonEl, count) {
  let badge = buttonEl.querySelector('.sam-sidebar-unread-badge');
  if (!count) {
    badge?.remove();
    return;
  }
  if (!badge) {
    badge = document.createElement('span');
    badge.className = 'sam-sidebar-unread-badge';
    buttonEl.appendChild(badge);
  }
  badge.textContent = count > 9 ? '9+' : String(count);
}

// -------- page switching (shared by both dashboards) --------
// Kept separate from the site's global showPage() (which has its own
// hardcoded pages array covering the Network Consult / FOV pages) so this
// never has to touch, or risk breaking, that unrelated list.
function showSamPage(pageId) {
  const pages = ['samApplication', 'samAppReport'];
  pages.forEach(id => {
    const el = document.getElementById(id);
    el?.classList.toggle('d-none', id !== pageId);
  });
}

// -------- entry point / role gating --------
// Mirrors loadFovGrantsPage() in app.js. FOV gates its admin button with a
// single `usrDetails.data.role === "Admin"` check; roadmap-notes.md's
// earlier "Admin POV" plan called for checking a currentUserRoles ARRAY
// against admin/faculty/superAdmin instead. This supports both shapes so
// it works whichever your real user object uses — adjust the role list
// below if your admin role is named differently.
const SAM_ADMIN_ROLES = ['Admin', 'admin', 'superAdmin', 'faculty', 'Missions'];

async function loadSamGrantsPage() {
  navigateTo("samGrants", null, []);

  const userId = usrDetails?.data?._id || '';
  const roles = Array.isArray(usrDetails?.data?.roles)
    ? usrDetails.data.roles
    : (usrDetails?.data?.role ? [usrDetails.data.role] : []);

  // Applicant Dashboard: only show it once the user has at least one
  // application of their own on file.
  try {
    const myApps = SamLocalStore.find('samProjectApplicationForm',
      { isDeleted: false, 'added.userId': userId },
      { limit: 1 }
    );
    if (myApps?.data?.length > 0) {
      document.getElementById('samAppDashboardBtn')?.classList.remove('d-none');
    }
  } catch (err) {
    console.error('Error checking for existing SAM applications:', err);
  }

  if (roles.some(r => SAM_ADMIN_ROLES.includes(r))) {
    document.getElementById('samAdminDashboardBtn')?.classList.remove('d-none');
  }
}

// -------- dashboard sidebar/tab wiring --------
async function loadSamAppDashboard() {
  document.querySelectorAll('.sam-sidebar-btn').forEach(btn => {
    btn.onclick = () => {
      document.querySelectorAll('.sam-sidebar-btn').forEach(x => x.classList.remove('active'));
      btn.classList.add('active');
      handleTabSwitch(btn.dataset.page);
    };
  });

  function handleTabSwitch(page) {
    switch (page) {
      case 'samAppDetailsPage':
        showSamPage('samApplication');
        loadSamApplication('Draft');
        break;
      case 'samAppReportPage':
        showSamPage('samAppReport');
        loadSamReportTable();
        break;
    }
  }

  $('#samTabs').off('click', '.samAppTab').on('click', '.samAppTab', function (e) {
    e.preventDefault();
    $('#samTabs li').removeClass('active');
    $(this).parent('li').addClass('active');
    loadSamApplication($(this).attr('id'));
  });

  updateSamChatNotifications();
}

async function loadSamAdminDashboard() {
  document.querySelectorAll('.sam-sidebar-btn').forEach(btn => {
    btn.onclick = () => {
      document.querySelectorAll('.sam-sidebar-btn').forEach(x => x.classList.remove('active'));
      btn.classList.add('active');
      handleTabSwitch(btn.dataset.page);
    };
  });

  function handleTabSwitch(page) {
    switch (page) {
      case 'samApplicationPage':
        showSamPage('samApplication');
        loadSamAppStatusTable('Submitted');
        break;
      case 'samReportsPage':
        showSamPage('samAppReport');
        loadSamReportStatusTable();
        break;
    }
  }

  $('#samTabs').off('click', '.samAppTab').on('click', '.samAppTab', function (e) {
    e.preventDefault();
    $('#samTabs li').removeClass('active');
    $(this).parent('li').addClass('active');
    loadSamAppStatusTable($(this).attr('id'));
  });

  updateSamChatNotifications();
}

// -------- Applicant: "My Application" table --------
async function loadSamApplication(actTab = 'Draft') {
  $.fn.dataTable.ext.errMode = 'none';

  if ($.fn.DataTable.isDataTable('#samApplicationTable')) {
    $('#samApplicationTable').DataTable().destroy();
    $('#samApplicationTable').empty();
  }

  const userId = usrDetails?.data?._id || '';

  samApplicationTable = $('#samApplicationTable').DataTable({
    ajax: function (data, callback, settings) {
      (async () => {
        try {
          const query = { isDeleted: false, 'added.userId': userId };
          if (actTab === 'UnderReview') {
            query.applicationStatus = 'Under Review';
          } else if (actTab) {
            query.applicationStatus = actTab;
          }

          const resp = SamLocalStore.find('samProjectApplicationForm', query,
            { sort: { 'added.addedDate': -1 } }
          );

          callback({ data: resp?.data || [] });
        } catch (err) {
          console.error('Error loading SAM applications:', err);
          callback({ data: [] });
        }
      })();
    },
    order: [],
    dom: "<'row'<'col-sm-12 col-md-4'l><'col-sm-12 col-md-8'f>>" +
      "<'row'<'col-sm-12'tr>>" +
      "<'row mb-1'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>",
    columns: [
      { data: 'samGrantId', title: 'SAM Grant ID', defaultContent: 'Not yet assigned' },
      { data: 'trainingArea', title: 'Training Area', defaultContent: '' },
      {
        data: null, title: 'Submitted',
        render: (data, type, row) => formatSamDate(row?.added?.addedDate)
      },
      {
        data: 'applicationStatus', title: 'Status',
        render: (data) => renderSamStatusBadge(data)
      },
      { "data": null, "title": "View", "orderable": false, render: () => '<button class="viewSamApp btn btn-warning btn-sm" type="button"><i class="fas fa-eye"></i></button>' },
      {
        "data": null, "title": "Chat", "orderable": false,
        render: (data, type, row) => `<button class="chatSamApp btn btn-primary btn-sm position-relative" type="button"><i class="fas fa-comment"></i>${samUnreadBadgeHtml(getSamUnreadCount(row, 'applicant'))}</button>`
      },
      { "data": null, "title": "Edit", "orderable": false, className: 'sam-edit-col', render: () => '<button class="editSamApp btn btn-secondary btn-sm" type="button"><i class="fas fa-pen"></i></button>' }
    ],
    initComplete: function () {
      // Only Drafts are editable — everything from Submitted onward is
      // locked in (matches the review-workflow expectation elsewhere).
      this.api().column('.sam-edit-col').visible(actTab === 'Draft');
    }
  });

  const tableEl = $('#samApplicationTable');
  tableEl.off('click');

  tableEl.on('click', '.viewSamApp', function () {
    const rowData = samApplicationTable.row($(this).closest('tr')).data();
    openModal('samAppDocs', '', '');
    const targetEl = document.getElementById('samAppDocs');
    if (targetEl) {
      targetEl.innerHTML = renderFunctions.samAppView(rowData);
      renderSamReadOnlyForm('samAppViewForm', 'samProjectApplicationForm', rowData);
    }
  });

  tableEl.on('click', '.editSamApp', function () {
    const rowData = samApplicationTable.row($(this).closest('tr')).data();
    openModal('formIO', null, '');
    samProjectApplication(rowData._id);
  });

  tableEl.on('click', '.chatSamApp', function () {
    const rowData = samApplicationTable.row($(this).closest('tr')).data();
    rowData.viewerRole = 'applicant';
    currentSamChatRecord = rowData;
    openModal('samAppDocs', '', '');
    const targetEl = document.getElementById('samAppComment');
    if (!targetEl) return;
    targetEl.innerHTML = renderFunctions.samAppChat(rowData);
    initSamChatEditor();
    // Opening the thread is what "reads" it — clears this row's unread
    // badge (and the sidebar total) immediately, and redraws the table so
    // the badge actually disappears without waiting for the next reload.
    markSamChatRead(rowData._id, 'applicant');
    reloadSamTableIfMounted('#samApplicationTable');
  });
}

// -------- Admin: "Applications" table --------
function loadSamAppStatusTable(actTab = 'Submitted') {
  $.fn.dataTable.ext.errMode = 'none';

  if ($.fn.DataTable.isDataTable('#samAppStatusTable')) {
    $('#samAppStatusTable').DataTable().destroy();
    $('#samAppStatusTable').empty();
  }

  const statusMap = { UnderReview: 'Under Review' };

  samAppStatusTable = $('#samAppStatusTable').DataTable({
    ajax: function (data, callback, settings) {
      (async () => {
        try {
          const query = { isDeleted: false };
          if (actTab !== 'All') {
            query.applicationStatus = statusMap[actTab] || actTab;
          } else {
            // "All" still excludes Draft — drafts are the applicant's own
            // working copy and aren't visible to the committee, same as
            // FOV's admin tabs starting from "Approved by Msn" onward.
            query.applicationStatus = { $ne: 'Draft' };
          }

          const resp = SamLocalStore.find('samProjectApplicationForm', query,
            { sort: { 'added.addedDate': -1 } }
          );

          callback({ data: resp?.data || [] });
        } catch (err) {
          console.error('Error loading SAM applications (admin):', err);
          callback({ data: [] });
        }
      })();
    },
    order: [],
    dom: "<'row'<'col-sm-12 col-md-4'l><'col-sm-12 col-md-4'B><'col-sm-12 col-md-4'f>>" +
      "<'row'<'col-sm-12'tr>>" +
      "<'row mb-1'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>",
    columns: [
      { data: 'samGrantId', title: 'SAM Grant ID', defaultContent: 'Not yet assigned' },
      { data: 'applicantName', title: 'Applicant' },
      { data: 'hospitalNameAddress', title: 'Mission Hospital', className: 'col-md-3' },
      { data: 'trainingArea', title: 'Training Area' },
      {
        data: null, title: 'Submitted',
        render: (data, type, row) => formatSamDate(row?.added?.addedDate)
      },
      {
        data: 'applicationStatus',
        title: 'Status / Action',
        render: function (data, type, row) {
          if (actTab === 'All') return renderSamStatusBadge(data);
          if (actTab === 'Submitted') {
            return `<button class="startReviewSamApp btn btn-warning btn-sm my-1">Start Review</button>
                    <button class="rejectSamApp btn btn-danger btn-sm">Reject</button>`;
          }
          if (actTab === 'UnderReview') {
            return `<button class="approveSamApp btn btn-success btn-sm my-1">Approve</button>
                    <button class="rejectSamApp btn btn-danger btn-sm">Reject</button>`;
          }
          if (actTab === 'Approved') {
            return `<button class="rejectSamApp btn btn-danger btn-sm">Reject</button>`;
          }
          if (actTab === 'Rejected') {
            return `<button class="reopenSamApp btn btn-secondary btn-sm">Reopen</button>`;
          }
          return renderSamStatusBadge(data);
        }
      },
      { "data": null, "title": "View", "orderable": false, render: () => '<button class="viewSamApp btn btn-warning btn-sm" type="button"><i class="fas fa-eye"></i></button>' },
      {
        "data": null, "title": "Chat", "orderable": false,
        render: (data, type, row) => `<button class="chatSamApp btn btn-primary btn-sm position-relative" type="button"><i class="fas fa-comment"></i>${samUnreadBadgeHtml(getSamUnreadCount(row, 'admin'))}</button>`
      }
    ],
    buttons: [
      {
        extend: 'excelHtml5',
        className: "btn btn-success",
        text: '<div><i class="far fa-file-excel"></i>&nbsp;Excel</div>',
        title: 'SAM_Applications_' + actTab + '_' + new Date().toISOString().split('T')[0],
        exportOptions: { columns: ':visible:not(:last-child):not(:nth-last-child(2))' }
      }
    ]
  });

  const tableEl = $('#samAppStatusTable');
  tableEl.off('click');

  tableEl.on('click', '.viewSamApp', function () {
    const rowData = samAppStatusTable.row($(this).closest('tr')).data();
    openModal('samAppDocs', '', '');
    const targetEl = document.getElementById('samAppDocs');
    if (targetEl) {
      targetEl.innerHTML = renderFunctions.samAppView(rowData);
      renderSamReadOnlyForm('samAppViewForm', 'samProjectApplicationForm', rowData);
    }
  });

  tableEl.on('click', '.chatSamApp', function () {
    const rowData = samAppStatusTable.row($(this).closest('tr')).data();
    rowData.viewerRole = 'admin';
    currentSamChatRecord = rowData;
    openModal('samAppDocs', '', '');
    const targetEl = document.getElementById('samAppComment');
    if (!targetEl) return;
    targetEl.innerHTML = renderFunctions.samAppChat(rowData);
    initSamChatEditor();
    markSamChatRead(rowData._id, 'admin');
    reloadSamTableIfMounted('#samAppStatusTable');
  });

  tableEl.on('click', '.startReviewSamApp', function () {
    const rowData = samAppStatusTable.row($(this).closest('tr')).data();
    if (rowData) RequestChangeSamStatus(rowData._id, 'Under Review');
  });
  tableEl.on('click', '.approveSamApp', function () {
    const rowData = samAppStatusTable.row($(this).closest('tr')).data();
    if (rowData) RequestChangeSamStatus(rowData._id, 'Approved');
  });
  tableEl.on('click', '.rejectSamApp', function () {
    const rowData = samAppStatusTable.row($(this).closest('tr')).data();
    if (rowData) RequestChangeSamStatus(rowData._id, 'Rejected');
  });
  tableEl.on('click', '.reopenSamApp', function () {
    const rowData = samAppStatusTable.row($(this).closest('tr')).data();
    if (rowData) RequestChangeSamStatus(rowData._id, 'Submitted');
  });
}

// Admin status changes — mirrors RequestChangeBtn(reqId, reqType) for FOV.
function RequestChangeSamStatus(reqId, newStatus) {
  const modified = {
    userId: usrDetails?.data?._id || '',
    userName: usrDetails?.data?.profile?.name || '',
    modifiedDate: new Date()
  };

  const result = SamLocalStore.update('samProjectApplicationForm',
    { _id: reqId },
    { $set: { applicationStatus: newStatus, modified: modified } }
  );

  if (result?.data?.error) {
    console.error('Error updating SAM application status:', result.data.reason);
    Bert.alert('Could not update this application. Please try again.', 'danger', 'fixed-top');
  } else {
    Bert.alert('SAM application updated successfully', 'success', 'fixed-top');
    // No manual reload here — SamLocalStore.update() above already fired
    // 'sam:dataChanged', which redraws every currently-mounted SAM table
    // (see the listener up near getSamFormSchema), including this one.
  }
}

// -------- Two-way chat: add / delete --------
function initSamChatEditor() {
  const el = document.getElementById('samNewChatMessage');
  if (!el) return;
  samChatEditor = new Quill('#samNewChatMessage', {
    theme: 'snow',
    placeholder: 'Write a message…',
    modules: { toolbar: [['bold', 'italic'], [{ list: 'ordered' }, { list: 'bullet' }]] }
  });
}

$(document).on('click', '#saveSamChatMessage', async function () {
  const button = $(this);
  const samId = button.attr('data-sam-id');
  const viewerRole = button.attr('data-viewer-role') || 'applicant';
  const errorEl = document.getElementById('samChatError');

  if (!samId) {
    errorEl.textContent = 'Application record is missing.';
    return;
  }
  if (!samChatEditor) {
    errorEl.textContent = 'Message editor is not initialized.';
    return;
  }

  const messageText = samChatEditor.getText().trim();
  if (!messageText) {
    errorEl.textContent = 'Please enter a message.';
    return;
  }
  const messageHtml = samChatEditor.root.innerHTML.trim();
  errorEl.textContent = '';

  const userId = usrDetails?.data?._id || '';
  const userName = usrDetails?.data?.profile?.name || (viewerRole === 'admin' ? 'SAM Grant Committee' : 'Applicant');
  const chatMessage = {
    message: messageHtml,
    authorRole: viewerRole,
    authorId: userId,
    authorName: userName,
    postedAt: new Date().toISOString()
  };

  button.prop('disabled', true).html('<span class="spinner-border spinner-border-sm me-1"></span>Sending...');

  try {
    const result = SamLocalStore.update('samProjectApplicationForm',
      { _id: samId },
      { $push: { samChatThread: chatMessage } }
    );

    if (result?.data?.error || result?.data?.reason) {
      throw new Error(result?.data?.reason || 'Unable to send message.');
    }

    if (currentSamChatRecord) {
      if (!Array.isArray(currentSamChatRecord.samChatThread)) {
        currentSamChatRecord.samChatThread = [];
      }
      currentSamChatRecord.samChatThread.push(chatMessage);
    }

    // Re-render the thread and reset the editor for the next message.
    const targetEl = document.getElementById('samAppComment');
    if (targetEl && currentSamChatRecord) {
      targetEl.innerHTML = renderFunctions.samAppChat(currentSamChatRecord);
      initSamChatEditor();
    }
  } catch (error) {
    console.error('Error sending SAM chat message:', error);
    errorEl.textContent = error.message || 'Unable to send message.';
    button.prop('disabled', false).html('<i class="fa fa-paper-plane me-1"></i> Send');
  }
});

$(document).on('click', '.delete-sam-chat', async function () {
  const index = Number($(this).attr('data-index'));
  if (!currentSamChatRecord || !Array.isArray(currentSamChatRecord.samChatThread)) return;
  if (!confirm('Delete this message?')) return;

  const updatedThread = currentSamChatRecord.samChatThread.filter((_, i) => i !== index);

  try {
    SamLocalStore.update('samProjectApplicationForm',
      { _id: currentSamChatRecord._id },
      { $set: { samChatThread: updatedThread } }
    );
    currentSamChatRecord.samChatThread = updatedThread;
    const targetEl = document.getElementById('samAppComment');
    if (targetEl) {
      targetEl.innerHTML = renderFunctions.samAppChat(currentSamChatRecord);
      initSamChatEditor();
    }
  } catch (err) {
    console.error('Error deleting SAM chat message:', err);
  }
});

// -------- SAM Grant ID generator (year-scoped, mirrors generateFovGrantId) --------
async function generateSamGrantId() {
  const currentYear = new Date().getFullYear().toString().slice(-2);
  let nextNumber = 1;

  try {
    const response = SamLocalStore.find('samProjectApplicationForm',
      { isDeleted: false, samGrantId: { $regex: `^${currentYear}SAM` } },
      { limit: 1, sort: { 'added.addedDate': -1 } }
    );

    const lastId = response?.data?.[0]?.samGrantId || '';
    if (lastId.includes('SAM')) {
      const parsed = parseInt(lastId.split('SAM')[1], 10);
      if (!isNaN(parsed)) nextNumber = parsed + 1;
    }
  } catch (err) {
    console.error('Error generating SAM Grant ID, defaulting to 1:', err);
  }

  return `${currentYear}SAM${String(nextNumber).padStart(5, '0')}`;
}

// -------- Application form: load / save (Draft + Submit) --------
// Replaces the earlier version of samProjectApplication() — same loader
// spinner (ensureSamLoaderStyles/showSamFormLoader/hideSamFormLoader, kept
// as-is further down this file), but now supports resuming a saved draft
// and writes a real applicationStatus + samGrantId, mirroring
// loadFOVGrantForm/handleFovFormSave.
async function samProjectApplication(reqId = null) {
  const container = document.getElementById('genFormIO');
  showSamFormLoader(container);

  // Real DB lookup — samProjectApplicationForm's schema is already deployed
  // in your real FormIO collection (getSamFormSchema routes it there).
  const samProjectForm = await getSamFormSchema('samProjectApplicationForm');

  let currentReqId = reqId;
  let existingSubmissionData = null;
  if (currentReqId) {
    try {
      // Still SamLocalStore — the applications themselves aren't a real
      // MongoDB collection yet (only the schema document above is real),
      // so a saved draft/submission still only exists in localStorage.
      const existingRecord = SamLocalStore.find('samProjectApplicationForm',
        { _id: currentReqId, isDeleted: false },
        { limit: 1 }
      );
      existingSubmissionData = existingRecord?.data?.[0] || null;
    } catch (err) {
      console.error('Error loading existing SAM application:', err);
    }
  }

  Formio.createForm(container, samProjectForm.data[0], {
    hide: { style: true, missionOfficeUse: true }
  }).then(function (form) {
    form.ready.then(async () => {
      hideSamFormLoader();

      const username = usrDetails?.data?.profile?.name || '';

      if (existingSubmissionData) {
        // Resuming a saved draft (or reopening any existing application) —
        // show the Application ID it was already assigned, not a new one.
        form.submission = { data: existingSubmissionData };
      } else {
        // Brand-new application — assign the Application ID the moment the
        // form opens, so it's visible right away instead of only appearing
        // after the first Save/Submit.
        form.getComponent('applicantName')?.setValue(username);
        form.getComponent('applicationStatus')?.setValue('Draft');
        const newGrantId = await generateSamGrantId();
        form.getComponent('samGrantId')?.setValue(newGrantId);
      }
          const saveDraftBtn = document.querySelector(
        '[name="data[saveDraft]"]'
    );

    const prepareEmailBtn = document.querySelector(
        '[name="data[prepareApplicationEmail]"]'
    );

    if (saveDraftBtn) {
        saveDraftBtn.classList.add("sam-btn-outline");
    }

    if (prepareEmailBtn) {
        prepareEmailBtn.classList.add("sam-btn-gold");

        const wrapper = prepareEmailBtn.closest(
            ".formio-component-button"
        );

        if (wrapper) {
            wrapper.style.textAlign = "right";
        }
    }

      console.log("Form ready");

      form.on('saveDraft', async () => {
        const fnlData = form.data; // allows incomplete data
        const result = await handleSamFormSave(fnlData, currentReqId, { saveDraft: true }, samProjectForm);
        if (result) {
          currentReqId = result.reqId;
          form.getComponent('samGrantId')?.setValue(result.samGrantId);
        }
      });

      form.on('submit', async (submitForm) => {
        const fnlData = submitForm.data;
        const result = await handleSamFormSave(fnlData, currentReqId, { finalSubmit: true }, samProjectForm);
        if (result) {
          currentReqId = result.reqId;
          form.getComponent('samGrantId')?.setValue(result.samGrantId);
        }
      });
    });
  });
}

async function handleSamFormSave(fnlData, reqId, actionType = {}, samProjectForm) {
  try {
    const userId = usrDetails?.data?._id || '';
    const userName = usrDetails?.data?.profile?.name || '';
    const now = new Date();

    let samGrantId = fnlData.samGrantId;
    if (!samGrantId) {
      samGrantId = await generateSamGrantId();
      fnlData.samGrantId = samGrantId;
    }

    if (actionType.saveDraft) {
      fnlData.applicationStatus = 'Draft';
    } else if (actionType.finalSubmit) {
      fnlData.applicationStatus = 'Submitted';
      fnlData.isDeleted = false;
    }

    let savedReqId = reqId;

    if (reqId) {
      fnlData.modified = { userId, userName, modifiedDate: now };
      SamLocalStore.update('samProjectApplicationForm', { _id: reqId }, { $set: fnlData });
    } else {
      fnlData.added = { userId, userName, addedDate: now };
      fnlData.samChatThread = [];
      const insertResponse = SamLocalStore.insert('samProjectApplicationForm', fnlData);
      savedReqId = insertResponse?.data?._id || insertResponse?.data?.insertedId || null;
    }

    closeModal();
    openModal('msgModal', null, {
      message: actionType.saveDraft
        ? 'Your application draft has been saved. You can find it under Draft in your Applicant Dashboard.'
        : 'Thank you — your SAM Project application has been submitted.',
      btnText: 'OK'
    });

    return { reqId: savedReqId, samGrantId };
  } catch (error) {
    console.error('Error saving SAM application:', error);
    openModal('msgModal', null, {
      message: 'Something went wrong while saving your application. Please try again.',
      btnText: 'OK'
    });
    return null;
  }
}

// -------- Training Report: load / save (Draft + Submit) --------
async function loadSamTrainingReportForm(reqId = null) {
  const container = document.getElementById('genFormIO');
  showSamFormLoader(container);

  const userId = usrDetails?.data?._id || '';
  let currentReqId = reqId;
  let existingSubmissionData = null;
  let prefillSamGrantId = null;

  if (currentReqId) {
    const existingRecord = SamLocalStore.find('samTrainingReportForm',
      { _id: currentReqId, isDeleted: false },
      { limit: 1 }
    );
    existingSubmissionData = existingRecord?.data?.[0] || null;
  } else {
    // New report: find the applicant's own most recent Approved application
    // to pre-fill the SAM Grant ID against.
    const approvedApp = SamLocalStore.find('samProjectApplicationForm',
      { isDeleted: false, 'added.userId': userId, applicationStatus: 'Approved' },
      { limit: 1, sort: { 'added.addedDate': -1 } }
    );
    prefillSamGrantId = approvedApp?.data?.[0]?.samGrantId || null;

    if (!prefillSamGrantId) {
      hideSamFormLoader();
      container.innerHTML = `<div class="alert alert-warning m-3">
        You don't have an Approved SAM application yet — a Training Report can only be
        submitted once your application has been approved and your training is complete.
      </div>`;
      return;
    }
  }

  // Routed through getSamFormSchema too, for consistency — currently
  // resolves via SamLocalStore since samTrainingReportForm has no real
  // FormIO document yet (add it to REAL_DB_FORM_KEYS once it does).
  const reportForm = await getSamFormSchema('samTrainingReportForm');

  Formio.createForm(container, reportForm.data[0]).then(function (form) {
    form.ready.then(async () => {
      hideSamFormLoader();

      if (existingSubmissionData) {
        form.submission = { data: existingSubmissionData };
      } else if (prefillSamGrantId) {
        form.getComponent('samGrantId')?.setValue(prefillSamGrantId);
      }

      form.on('saveDraft', async () => {
        const fnlData = form.data;
        const result = await handleSamReportSave(fnlData, currentReqId, { saveDraft: true });
        if (result) currentReqId = result.reqId;
      });

      form.on('submit', async (submitForm) => {
        const fnlData = submitForm.data;
        const result = await handleSamReportSave(fnlData, currentReqId, { finalSubmit: true });
        if (result) currentReqId = result.reqId;
      });
    });
  });
}

async function handleSamReportSave(fnlData, reqId, actionType = {}) {
  try {
    const userId = usrDetails?.data?._id || '';
    const userName = usrDetails?.data?.profile?.name || '';
    const now = new Date();

    fnlData.reportStatus = actionType.saveDraft ? 'Draft' : 'Submitted';

    let savedReqId = reqId;
    if (reqId) {
      fnlData.modified = { userId, userName, modifiedDate: now };
      SamLocalStore.update('samTrainingReportForm', { _id: reqId }, { $set: fnlData });
    } else {
      fnlData.isDeleted = false;
      fnlData.added = { userId, userName, addedDate: now };
      const insertResponse = SamLocalStore.insert('samTrainingReportForm', fnlData);
      savedReqId = insertResponse?.data?._id || insertResponse?.data?.insertedId || null;
    }

    closeModal();
    openModal('msgModal', null, {
      message: actionType.saveDraft
        ? 'Your training report draft has been saved.'
        : 'Thank you — your training report has been submitted.',
      btnText: 'OK'
    });

    if (typeof loadSamReportTable === 'function') loadSamReportTable();

    return { reqId: savedReqId };
  } catch (error) {
    console.error('Error saving SAM training report:', error);
    openModal('msgModal', null, {
      message: 'Something went wrong while saving your report. Please try again.',
      btnText: 'OK'
    });
    return null;
  }
}

// -------- Training Report tables --------
function loadSamReportTable() {
  $.fn.dataTable.ext.errMode = 'none';
  if ($.fn.DataTable.isDataTable('#samReportTable')) {
    $('#samReportTable').DataTable().destroy();
    $('#samReportTable').empty();
  }

  const userId = usrDetails?.data?._id || '';

  samReportTable = $('#samReportTable').DataTable({
    ajax: function (data, callback, settings) {
      (async () => {
        try {
          const resp = SamLocalStore.find('samTrainingReportForm',
            { isDeleted: false, 'added.userId': userId },
            { sort: { 'added.addedDate': -1 } }
          );
          callback({ data: resp?.data || [] });
        } catch (err) {
          console.error('Error loading SAM training reports:', err);
          callback({ data: [] });
        }
      })();
    },
    order: [],
    columns: [
      { data: 'samGrantId', title: 'SAM Grant ID' },
      { data: 'trainingArea', title: 'Training Area' },
      {
        data: null, title: 'Submitted',
        render: (data, type, row) => formatSamDate(row?.added?.addedDate)
      },
      { data: 'reportStatus', title: 'Status', render: (data) => renderSamStatusBadge(data) },
      { "data": null, "title": "View", "orderable": false, render: () => '<button class="viewSamReport btn btn-warning btn-sm" type="button"><i class="fas fa-eye"></i></button>' }
    ]
  });

  $('#samReportTable').off('click').on('click', '.viewSamReport', function () {
    const rowData = samReportTable.row($(this).closest('tr')).data();
    openModal('samAppDocs', '', '');
    const targetEl = document.getElementById('samAppDocs');
    if (targetEl) {
      targetEl.innerHTML = renderFunctions.samReportView(rowData);
      renderSamReadOnlyForm('samReportViewForm', 'samTrainingReportForm', rowData);
    }
  });
}

function loadSamReportStatusTable() {
  $.fn.dataTable.ext.errMode = 'none';
  if ($.fn.DataTable.isDataTable('#samReportStatusTable')) {
    $('#samReportStatusTable').DataTable().destroy();
    $('#samReportStatusTable').empty();
  }

  samReportStatusTable = $('#samReportStatusTable').DataTable({
    ajax: function (data, callback, settings) {
      (async () => {
        try {
          const resp = SamLocalStore.find('samTrainingReportForm',
            { isDeleted: false, reportStatus: 'Submitted' },
            { sort: { 'added.addedDate': -1 } }
          );
          callback({ data: resp?.data || [] });
        } catch (err) {
          console.error('Error loading SAM training reports (admin):', err);
          callback({ data: [] });
        }
      })();
    },
    order: [],
    columns: [
      { data: 'samGrantId', title: 'SAM Grant ID' },
      { data: 'added.userName', title: 'Fellow' },
      { data: 'trainingArea', title: 'Training Area' },
      {
        data: null, title: 'Submitted',
        render: (data, type, row) => formatSamDate(row?.added?.addedDate)
      },
      { "data": null, "title": "View", "orderable": false, render: () => '<button class="viewSamReport btn btn-warning btn-sm" type="button"><i class="fas fa-eye"></i></button>' }
    ]
  });

  $('#samReportStatusTable').off('click').on('click', '.viewSamReport', function () {
    const rowData = samReportStatusTable.row($(this).closest('tr')).data();
    openModal('samAppDocs', '', '');
    const targetEl = document.getElementById('samAppDocs');
    if (targetEl) {
      targetEl.innerHTML = renderFunctions.samReportView(rowData);
      renderSamReadOnlyForm('samReportViewForm', 'samTrainingReportForm', rowData);
    }
  });
}
//SAM Project script ends

