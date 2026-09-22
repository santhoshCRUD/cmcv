// Define our send method.
var send = function (data, msqId) {
    // let dateString = moment().format('DD-MMM-YYYY, h:mm:ss a');
    if (data.sender === 'me') {
        //console.log("data",data);
        var updateData = {
            misnExtcomment: data.msg,
            misnExtcmtaddedBy: usrDetails.data.profile.name,
            misnExtcmtaddedById: usrDetails._id,
            misnExtcmtDate: new Date(),
        };
        //console.log("updateData",updateData);
        var updateQuery = {
            collection: 'MissionRequests', query: {
                selector: { _id: msqId },
                data: { $set: updateData }, $push: { misnExtupdateComments: updateData }
            }
        };
        fetchCollectionData('updateCollectionData', updateQuery)
            .then(resp => {
                console.log("data updated", resp);
            }).catch(err => { console.log('Error: ', err); })
    }
    const msgHtml = data.sender === 'me'
        ? `
    <div class="msg from">
        <div>${updateData.misnExtcomment}</div>
        <div class="grey-color1">on ${moment(updateData.misnExtcmtDate).format('DD-MM-YYYY')} by ${usrDetails.data.profile.name}</div>
    </div>`
        : data.sender === 'ack'
            ? `
    <div class="msg to typing">
        <div>Auto generating reply</div>
        <div class="grey-color1">on ${moment(new Date()).format('DD-MM-YYYY')} by you</div>
    </div>`
            : '';

    if (msgHtml) {
        const $msg = $(msgHtml).appendTo('#msgCont');
        $('#msgCont').animate({ scrollTop: $('#msgCont')[0].scrollHeight }, 800);

        // If it's an acknowledgment, handle delay and content update
        if (data.sender === 'ack') {
            setTimeout(() => {
                if ($msg.hasClass('typing')) {
                    $msg.removeClass('typing');
                }
                $msg.find('div:first-child').text('This is an automated message. Our staffs will respond as soon as possible. Thank you');
                $msg.find('.comment-date').remove();
            }, 3500);
        }
    }
}


function chatupdate(msg, msqId) {
    if (msg.trim() !== '') {
        //update db and ui
        send({ sender: 'me', msg: msg }, msqId)
        //ack automatic generated
        setTimeout(() => {
            send({ sender: 'ack' });
        }, 1500);

    } else {
        console.log('Input is empty. Not sending.');
    }

}