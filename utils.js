const globalUrl = 'https://academics.cmcvellore.edu.in/api/connectApp/'
const localUrl = 'http://localhost:3000/methods/'
// Function to fetch data from the API for a given collection
async function fetchCollectionData(collectionRequestType, collectionData, useLocal = false) {
  const url = useLocal ? localUrl : globalUrl;
  const response = await fetch(`${url}${collectionRequestType}`, {
    // const response = await fetch(`https://academics.cmcvellore.edu.in/api/connectApp/${collectionRequestType}`, {
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
// fetchedDataAPI function to handle collections
async function fetchedDataAPI(collectionRequestType, collections, useLocal) {
  const results = {};

  await Promise.all(collections.map(async (coll) => {
    try {
      const data = await fetchCollectionData(collectionRequestType, coll, useLocal);
      results[coll.collection] = data;
    } catch (error) {
      console.error(`Error fetching data for collection ${coll.collection}:`, error);
      results[coll.collection] = { error: error.message };
    }
  }));

  return results;
}
function loadNewsTicker() {
  console.log("ticker called")
  $('.demo').easyTicker({
    // or 'down'
    direction: 'up',
    // easing function
    easing: 'swing',
    // animation speed
    speed: 'slow',
    // animation delay
    interval: 4000,
    // height
    height: 'auto',
    // the number of visible elements of the list
    visible: 5,
    // enables pause on hover
    mousePause: true,
    // enables autoplay
    autoplay: true,
    // custom controls
    controls: {
      up: '.up-control',
      down: '.down-control',
      toggle: '',
      playText: 'Play',
      stopText: 'Stop'
    },
    // callbacks
    callbacks: {
      before: function (ul, li) {
        // do something
      },
      after: function (ul, li) {
        // do something
        // if (li.hasClass('et-last')) {

      },
      finish: function (ul, li) {
        // do something
      }
    }
  });
}

function removeInfiniteScroll() {
  const container = document.getElementById("content");
  const newContainer = container.cloneNode(true); // Clone to remove all event listeners
  container.replaceWith(newContainer); // Replace the original with the cloned node
}

const base64ToBlob = (base64, contentType = '') => {
  const byteCharacters = atob(base64);
  const byteArrays = [];

  for (let i = 0; i < byteCharacters.length; i += 512) {
    const slice = byteCharacters.slice(i, i + 512);
    const byteNumbers = new Array(slice.length);
    for (let j = 0; j < slice.length; j++) {
      byteNumbers[j] = slice.charCodeAt(j);
    }
    byteArrays.push(new Uint8Array(byteNumbers));
  }

  return new Blob(byteArrays, { type: contentType });
};
const resizeImage = (base64String, maxWidth = 150, maxHeight = 150) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "Anonymous";

    img.onload = () => {
      const canvas = document.createElement("CANVAS");
      const ctx = canvas.getContext("2d");

      let newWidth, newHeight;
      if (img.naturalWidth > img.naturalHeight) {
        newWidth = maxWidth;
        newHeight = (img.naturalHeight / img.naturalWidth) * maxWidth;
      } else {
        newHeight = maxHeight;
        newWidth = (img.naturalWidth / img.naturalHeight) * maxHeight;
      }

      canvas.width = newWidth;
      canvas.height = newHeight;

      ctx.drawImage(img, 0, 0, newWidth, newHeight);
      const dataURL = canvas.toDataURL("image/png"); // Convert to Base64
      resolve(dataURL.split(",")[1]); // Remove "data:image/png;base64,"
    };

    img.onerror = (err) => reject(err);
    img.src = `data:image/png;base64,${base64String}`;
  });
};
const bucketName = "img.studenthub.in";

const uploadToS3 = async (base64String, key, thumb = false, fileType = "") => {

  const extension = key.split(".").pop().toLowerCase();
  let contentType = fileType;

  // Fallback if MIME type is not available
  if (!contentType) {

    if (["jpg", "jpeg", "png", "gif", "webp"].includes(extension)) {

      contentType = extension === "jpg" ? "image/jpeg" : `image/${extension}`;

    } else if (extension === "pdf") {
      contentType = "application/pdf";

    } else if (extension === "csv") {
      contentType = "text/csv";

    } else if (extension === "doc") {
      contentType = "application/msword";

    } else if (extension === "docx") {
      contentType = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

    } else if (extension === "xls") {
      contentType = "application/vnd.ms-excel";

    } else if (extension === "xlsx") {
      contentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

    } else {
      console.error("Unsupported file type:", extension);
      return null;
    }
  }

  // Remove data URL prefix if one is accidentally passed
  const cleanBase64 = extractBase64(base64String);

  if (!cleanBase64) {
    console.error("Invalid Base64 string.");
    return null;
  }

  const base64Regex = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/;

  const isValidBase64 = base64Regex.test(cleanBase64);

  if (!isValidBase64) {
    console.error("Invalid Base64 string.");
    return null;
  }

  let blob;

  if (thumb && contentType.startsWith("image/")) {
    const resizedBase64 = await resizeImage(cleanBase64);
    blob = base64ToBlob(resizedBase64, contentType);

  } else {
    blob = base64ToBlob(cleanBase64, contentType);
  }

  const params = {
    Bucket: bucketName,
    Key: key,
    Body: blob,
    ContentType: contentType
  };

  try {
    const data = await s3.upload(params).promise();
    console.log(`Successfully uploaded: ${key}`, data.Location);

    return data.Location;

  } catch (err) {
    console.error("S3 Upload Error:", err);
    return null;
  }
};

function initBackToTop() {
  const btn = document.getElementById('backToTopBtn');
  const content = document.getElementById('content');

  if (!btn || !content) return;

  // Remove old listener if exists
  if (content._scrollHandler) {
    content.removeEventListener('scroll', content._scrollHandler);
  }

  content._scrollHandler = function () {
    if (content.scrollTop > 300) {
      btn.style.display = 'flex';
    } else {
      btn.style.display = 'none';
    }
  };

  content.addEventListener('scroll', content._scrollHandler);

  btn.onclick = function () {
    content.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
}


function imageZoomIn() {
  var myImg = document.getElementById('modalContent');
  if (!myImg) return false;
  var currWidth = myImg.clientWidth;
  if (currWidth >= 2500) return false;
  else {
    myImg.style.width = (currWidth + 100) + "px";
    myImg.style.maxWidth = "none";
    myImg.style.margin = "0 auto";
    myImg.style.position = "relative";
    myImg.style.left = "50%";
    myImg.style.transform = "translateX(-50%)";
  }
}
function imageZoomOut() {
  var myImg = document.getElementById('modalContent');
  if (!myImg) return false;
  var currWidth = myImg.clientWidth;
  if (currWidth <= 100) return false;
  else {
    myImg.style.width = (currWidth - 100) + "px";
    myImg.style.maxWidth = "none";
    myImg.style.margin = "0 auto";
    myImg.style.position = "relative";
    myImg.style.left = "50%";
    myImg.style.transform = "translateX(-50%)";
  }
}

// ── Flipbook ────────────────────────────────────────────────────────────────
let pdfDoc = null;
let pageFlip = null;
let zoom = 1;

const PAGE_WIDTH = 340;
const PAGE_HEIGHT = 425;
const renderedPages = new Set();

async function initFlipbook() {
  pdfjsLib.GlobalWorkerOptions.workerSrc =
    'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

  const PDF_URL =
    'https://s3.amazonaws.com/img.studenthub.in/CMCVConnect_Portal/Pictures/_6fbf13373125ddd5c9a8d7460b4c6789_Pictures.pdf';

  try {
    pdfDoc = await pdfjsLib.getDocument(PDF_URL).promise;
    const totalPages = pdfDoc.numPages;
    const flipbookContainer = document.getElementById('flipbook');
    flipbookContainer.innerHTML = '';
    renderedPages.clear();

    for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
      const pageDiv = document.createElement('div');
      pageDiv.className = 'page';

      const canvas = document.createElement('canvas');
      canvas.id = `page-canvas-${pageNum}`;

      pageDiv.appendChild(canvas);
      flipbookContainer.appendChild(pageDiv);
    }

    document.getElementById('loading').style.display = 'none';
    document.getElementById('controls').style.display = 'flex';
    document.getElementById('viewer').style.display = 'flex';

    pageFlip = new St.PageFlip(flipbookContainer, {
      width: PAGE_WIDTH,
      height: PAGE_HEIGHT,
      size: 'stretch',
      autoSize: true,
      minWidth: 300,
      maxWidth: 1000,
      minHeight: 400,
      maxHeight: 1500,
      showCover: true,
      drawShadow: true,
      flippingTime: 500,
      mobileScrollSupport: true,
      usePortrait: window.innerWidth < 768
    });

    pageFlip.loadFromHTML(document.querySelectorAll('.page'));

    await preloadSurroundingPages(0);
    updatePageInfo();

    pageFlip.on('flip', (e) => {
      updatePageInfo();
      preloadSurroundingPages(e.data);
    });

    document.getElementById('prev-btn').addEventListener('click', () => pageFlip.flipPrev());
    document.getElementById('next-btn').addEventListener('click', () => pageFlip.flipNext());

  } catch (err) {
    console.error('Flipbook error:', err);
    document.getElementById('loading').innerText = 'Failed to load flipbook.';
  }

  document.getElementById('fullscreen-btn').onclick = async () => {
    const wrapper = document.getElementById('viewer').closest('.modal-content');
    if (!document.fullscreenElement) {
      if (wrapper && wrapper.requestFullscreen) {
        await wrapper.requestFullscreen();
        zoom = 1; applyZoom();
      } else {
        await document.documentElement.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) await document.exitFullscreen();
    }
  };

  document.getElementById('zoom-in').onclick = () => { zoom = Math.min(zoom + 0.2, 3); applyZoom(); };
  document.getElementById('zoom-out').onclick = () => { zoom = Math.max(zoom - 0.2, 0.5); applyZoom(); };
  document.getElementById('zoom-reset').onclick = () => { zoom = 1; applyZoom(); };

  initDragToPan(document.getElementById('viewer'));
}

async function renderPageToCanvas(pageNum, canvas) {
  if (renderedPages.has(pageNum)) return;
  renderedPages.add(pageNum);

  const page = await pdfDoc.getPage(pageNum);
  const viewport = page.getViewport({ scale: 0.25 });

  const scale = Math.min(PAGE_WIDTH / viewport.width, PAGE_HEIGHT / viewport.height);
  const outputScale = (window.devicePixelRatio || 0.25) * 1;
  const scaledViewport = page.getViewport({ scale: scale * outputScale });

  console.log(scaledViewport.width, scaledViewport.height);

  canvas.width = scaledViewport.width;
  canvas.height = scaledViewport.height;

  await page.render({ canvasContext: canvas.getContext('2d'), viewport: scaledViewport }).promise;
}

async function preloadSurroundingPages(currentIndex) {
  const currentPDFPage = currentIndex + 1;
  const pagesToLoad = [
    currentPDFPage - 1,
    currentPDFPage,
    currentPDFPage + 1,
    currentPDFPage + 2,
    currentPDFPage + 3
  ].filter(p => p >= 1 && p <= pdfDoc.numPages);

  for (let p of pagesToLoad) {
    const canvas = document.getElementById(`page-canvas-${p}`);
    if (canvas) renderPageToCanvas(p, canvas).catch(err => console.log('Render Error', err));
  }
}

function updatePageInfo() {
  const idx = pageFlip.getCurrentPageIndex();
  const totalPages = pdfDoc.numPages;
  document.getElementById('page-num').innerText = `Page ${idx + 1} of ${totalPages}`;
  document.getElementById('prev-btn').disabled = idx === 0;
  document.getElementById('next-btn').disabled = idx >= totalPages - 1;
}

function applyZoom() {
  const flipbook = document.getElementById('flipbook');
  const viewer = document.getElementById('viewer');

  document.getElementById('zoom-label').textContent = `${Math.round(zoom * 100)}%`;

  if (zoom > 1) {
    viewer.style.display = 'block';
    flipbook.style.position = 'absolute';
    flipbook.style.top = '0';
    flipbook.style.left = '0';
    flipbook.style.margin = '0';
    flipbook.style.transform = `scale(${zoom})`;

    let spacer = document.getElementById('zoom-spacer');
    if (!spacer) {
      spacer = document.createElement('div');
      spacer.id = 'zoom-spacer';
      viewer.appendChild(spacer);
    }
    spacer.style.width = `${flipbook.offsetWidth * zoom}px`;
    spacer.style.height = `${flipbook.offsetHeight * zoom}px`;

    flipbook.style.pointerEvents = 'none';
    viewer.style.cursor = 'move';
  } else {
    viewer.style.display = 'flex';
    flipbook.style.margin = 'auto';
    flipbook.style.position = 'relative';
    flipbook.style.transform = `scale(1)`;
    flipbook.style.left = 'auto';
    flipbook.style.top = 'auto';

    let spacer = document.getElementById('zoom-spacer');
    if (spacer) spacer.remove();

    viewer.scrollLeft = 0;
    viewer.scrollTop = 0;
    flipbook.style.pointerEvents = '';
    viewer.style.cursor = 'grab';
  }
}

function initDragToPan(viewer) {
  let isDragging = false;
  let startX = 0, startY = 0, scrollLeft = 0, scrollTop = 0;

  function engagePan(x, y) {
    if (zoom <= 1) return;
    isDragging = true;
    viewer.style.cursor = 'grabbing';
    startX = x;
    startY = y;
    scrollLeft = viewer.scrollLeft;
    scrollTop = viewer.scrollTop;
  }

  function performPan(x, y) {
    if (!isDragging) return;
    viewer.scrollLeft = scrollLeft - (x - startX);
    viewer.scrollTop = scrollTop - (y - startY);
  }

  function endPan() {
    isDragging = false;
    if (zoom > 1) viewer.style.cursor = 'move';
    else viewer.style.cursor = 'grab';
  }

  viewer.addEventListener('mousedown', (e) => {
    engagePan(e.pageX, e.pageY);
    if (zoom > 1) e.preventDefault();
  });
  viewer.addEventListener('mousemove', (e) => performPan(e.pageX, e.pageY));
  viewer.addEventListener('mouseup', endPan);
  viewer.addEventListener('mouseleave', endPan);

  viewer.addEventListener('touchstart', (e) => engagePan(e.touches[0].pageX, e.touches[0].pageY), { passive: true });
  viewer.addEventListener('touchmove', (e) => {
    if (zoom > 1) {
      performPan(e.touches[0].pageX, e.touches[0].pageY);
      e.preventDefault();
    }
  }, { passive: false });
}

let fovCommentEditor = null;

let currentFovCommentApplication = null;

let editingFovCommentIndex = null;
function initFovCommentEditor() {

  const editorEl = document.getElementById('fovNewComment');

  if (!editorEl) {
    console.warn('FOV comment editor element not found.');
    return;
  }

  // Destroy previous instance reference
  fovCommentEditor = null;
  fovCommentEditor = new Quill(
    '#fovNewComment',
    {
      theme: 'snow',
      placeholder: 'Enter your feedback...',
      modules: {
        toolbar: [
          ['bold', 'italic', 'underline'],
          [{ 'list': 'ordered' }, { 'list': 'bullet' }],
          [{ 'align': [] }],
          ['link'],
          ['clean']
        ]
      }
    }
  );
}

function sanitizeFovComment(html) {

  if (!html) {
    return '';
  }

  const template = document.createElement('template');
  template.innerHTML = html;
  const allowedTags = ['P', 'BR', 'STRONG', 'B', 'EM', 'I', 'U', 'OL', 'UL', 'LI', 'A'];

  const elements = template.content.querySelectorAll('*');

  elements.forEach(element => {

    if (!allowedTags.includes(element.tagName)) {
      element.replaceWith(document.createTextNode(element.textContent));
      return;
    }

    // Remove all attributes except href
    [...element.attributes].forEach(attr => {

      if (element.tagName === 'A' && attr.name === 'href') {
        const value = attr.value.trim();
        if (!value.startsWith('https://') && !value.startsWith('http://') && !value.startsWith('mailto:')) {
          element.removeAttribute('href');
        }
      } else {
        element.removeAttribute(attr.name);
      }
    });

    // Links open separately
    if (element.tagName === 'A') {
      element.setAttribute('target', '_blank');
      element.setAttribute('rel', 'noopener noreferrer');
    }
  });
  return template.innerHTML;
}

function escapeFovHtml(value = '') {

  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function formatFovCommentDate(dateValue) {

  if (!dateValue) {
    return '';
  }

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return escapeFovHtml(dateValue);
  }

  return date.toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function renderSingleFovComment(comment, index) {

  const userName = escapeFovHtml(comment?.userName || 'Admin');
  const date = escapeFovHtml(formatFovCommentDate(comment?.date));
  const commentHtml = sanitizeFovComment(comment?.comment || '');

  return `
        <div class="fov-comment-item border rounded-3 p-3 mb-3" data-comment-index="${index}">
            <div class="d-flex align-items-start">
                <div class="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center me-3 flex-shrink-0" style="width:42px; height:42px;">
                    <i class="fa fa-user"></i>
                </div>

                <div class="flex-grow-1" style="min-width:0;">
                    <div class="d-flex justify-content-between align-items-start gap-2 mb-2">
                        <div>
                            <div class="fw-bold">${userName}</div>
                            <small class="text-muted">${date}</small>
                        </div>

                        <!-- Actions -->
                        ${comment.Editor ? `
                        <div class="dropdown">
                            <button type="button" class="btn btn-sm btn-light border" data-bs-toggle="dropdown" aria-expanded="false">
                                <i class="fa fa-ellipsis-v"></i>
                            </button>

                            <ul class="dropdown-menu dropdown-menu-end">
                                <li>
                                    <button type="button" class="dropdown-item edit-fov-comment" data-index="${index}">
                                        <i class="fa fa-edit me-2"></i>
                                        Edit
                                    </button>
                                </li>

                                <li>
                                    <button type="button" class="dropdown-item text-danger delete-fov-comment" data-index="${index}">
                                        <i class="fa fa-trash me-2"></i>
                                        Delete
                                    </button>
                                </li>
                            </ul>
                        </div>
                        ` : ''}
                    </div>


                    <!-- Formatted comment -->

                    <div class="fov-comment-content bg-light rounded-3 p-3">
                        ${commentHtml}
                    </div>
                </div>
            </div>
        </div>
    `;
}

function refreshFovCommentsUI() {

  if (!currentFovCommentApplication) {
    return;
  }
  const targetEl = document.getElementById('fovAppComments');
  if (!targetEl) {
    return;
  }
  targetEl.innerHTML = renderFunctions.fovAppComments(currentFovCommentApplication);
  initFovCommentEditor();
}

async function addFovComment(button) {

  const fovId = button.attr('data-fov-id');
  const errorEl = document.getElementById('fovCommentError');
  if (!fovCommentEditor) {
    errorEl.textContent = 'Comment editor is not initialized.';
    return;
  }
  const commentText = fovCommentEditor.getText().trim();
  if (!commentText) {
    errorEl.textContent = 'Please enter a comment.';
    return;
  }
  const feedback = {
    date: new Date().toISOString(),
    comment: fovCommentEditor.root.innerHTML.trim(),
    userId: usrDetails?.data?._id || '',
    userName: usrDetails?.data?.profile?.name || 'Admin'
  };

  button.prop('disabled', true);

  try {

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
      });

    if (result?.data?.error || result?.data?.reason) {
      throw new Error(result?.data?.reason || 'Unable to save comment.');
    }
    if (currentFovCommentApplication) {
      if (!Array.isArray(currentFovCommentApplication.fovFeedback)) {
        currentFovCommentApplication.fovFeedback = [];
      }
      currentFovCommentApplication.fovFeedback.push(feedback);
    }
    refreshFovCommentsUI();
  } catch (error) {
    console.error('Add FOV comment error:', error);
    errorEl.textContent = error.message;

  } finally {
    button.prop('disabled', false);
  }
}

async function updateFovComment(index) {

  if (!currentFovCommentApplication) {
    return;
  }
  if (!fovCommentEditor) {
    return;
  }
  const comments = currentFovCommentApplication.fovFeedback || [];
  const existing = comments[index];
  if (!existing) {
    return;
  }
  const commentText = fovCommentEditor.getText().trim();
  const errorEl = document.getElementById('fovCommentError');

  if (!commentText) {
    errorEl.textContent = 'Please enter a comment.';
    return;
  }
  const updatedHtml = fovCommentEditor.root.innerHTML.trim();
  const updatedDate = new Date().toISOString();
  const updatedComment = {
    ...existing,
    comment: updatedHtml,
    date: updatedDate
  };
  const button = $('#saveFovComment');
  button.prop('disabled', true)
    .html(`
            <span class="spinner-border spinner-border-sm me-1"></span>
            Updating...
        `);

  try {

    const result = await fetchCollectionData('updateCollectionData',
      {
        collection: 'FovApplication',
        query: {
          selector: {
            _id: currentFovCommentApplication._id
          },
          data: {
            $set: {
              [`fovFeedback.${index}`]: updatedComment
            }
          }
        }
      }
    );
    console.log('Update FOV comment response:', result);

    if (result?.data?.error || result?.data?.reason) {
      throw new Error(result?.data?.reason || 'Unable to update comment.');
    }

    // Update local object
    currentFovCommentApplication.fovFeedback[index] = updatedComment;
    editingFovCommentIndex = null;

    // Refresh UI
    refreshFovCommentsUI();

  } catch (error) {

    console.error('Update FOV comment error:', error);
    errorEl.textContent = error.message || 'Unable to update comment.';

  } finally {

    button.prop('disabled', false).html(`
                <i class="fa fa-paper-plane me-1"></i>
                Add Comment
            `);
    $('#cancelFovCommentEdit').remove();

  }
}

async function deleteFovComment(index) {

  if (!currentFovCommentApplication) {
    return;
  }

  const comments = Array.isArray(currentFovCommentApplication.fovFeedback) ? currentFovCommentApplication.fovFeedback : [];
  const comment = comments[index];

  if (!comment) {
    return;
  }

  const userName = comment.userName || 'Admin';
  const confirmed = window.confirm(`Delete this comment by ${userName}?`);

  if (!confirmed) {
    return;
  }

  try {
    const newComments = comments.filter((_, i) => i !== index);
    const result = await fetchCollectionData('updateCollectionData',
      {
        collection: 'FovApplication',
        query: {
          selector: {
            _id: currentFovCommentApplication._id
          },
          data: {
            $set: {
              fovFeedback: newComments
            }
          }
        }
      }
    );
    console.log('Delete FOV comment response:', result);
    if (result?.data?.error || result?.data?.reason) {
      throw new Error(result?.data?.reason || 'Unable to delete comment.');
    }
    // Update local object
    currentFovCommentApplication.fovFeedback = newComments;
    // Refresh
    refreshFovCommentsUI();
    console.log('FOV comment deleted successfully.');
  } catch (error) {
    console.error('Delete FOV comment error:', error);
    alert(error.message || 'Unable to delete comment.');
  }
}