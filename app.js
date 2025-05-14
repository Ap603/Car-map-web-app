let map;
let carSpots = JSON.parse(localStorage.getItem("carSpots") || "[]");

const cameraInput = document.getElementById("cameraInput");
const galleryInput = document.getElementById("galleryInput");

// Initialize map centered on current location
function initMap(pos) {
  const center = { lat: pos.coords.latitude, lng: pos.coords.longitude };
  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 16,
    center,
  });

  // Display saved car spots
  carSpots.forEach(spot => {
    new google.maps.Marker({
      position: { lat: spot.lat, lng: spot.lng },
      map,
      title: spot.label || "Car Spot"
    });
  });
}

// Load map with geolocation
navigator.geolocation.getCurrentPosition(initMap);

// Open camera
function openCamera() {
  cameraInput.click();
}

// Open gallery
function openGallery() {
  galleryInput.click();
}

// Handle image uploads (camera or gallery)
function handleImageUpload(file) {
  if (!file) return;

  const reader = new FileReader();
  reader.onloadend = () => {
    const imageDataURL = reader.result;
    const brand = document.getElementById("brandInput").value.trim();
    const model = document.getElementById("modelInput").value.trim();

    if (!brand || !model) {
      alert("Please enter both a brand and a model.");
      return;
    }

    navigator.geolocation.getCurrentPosition(pos => {
      const spot = {
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
        label: `${brand} ${model}`,
        img: imageDataURL,
      };
      carSpots.push(spot);
      localStorage.setItem("carSpots", JSON.stringify(carSpots));

      new google.maps.Marker({
        position: { lat: spot.lat, lng: spot.lng },
        map,
        title: spot.label
      });

      document.getElementById("car-info").innerHTML = `
        <p><strong>${spot.label}</strong></p>
        <img src="${imageDataURL}" width="200">
      `;
    });
  };
  reader.readAsDataURL(file);
}

cameraInput.addEventListener("change", () => {
  handleImageUpload(cameraInput.files[0]);
});

galleryInput.addEventListener("change", () => {
  handleImageUpload(galleryInput.files[0]);
});

// Dummy handler if user clicks "Add Car Spot" without image
function addCarSpot() {
  alert("Please use the 'Open Camera' or 'Open Gallery' buttons to select an image.");
}