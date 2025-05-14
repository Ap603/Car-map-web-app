let map;
let carSpots = JSON.parse(localStorage.getItem("carSpots") || "[]");

const brandInput = document.getElementById("brandInput");
const modelInput = document.getElementById("modelInput");
const cameraInput = document.getElementById("cameraInput");
const galleryInput = document.getElementById("galleryInput");

function initMap(pos) {
  const center = { lat: pos.coords.latitude, lng: pos.coords.longitude };
  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 16,
    center,
  });

  carSpots.forEach(spot => {
    const marker = new google.maps.Marker({
      position: { lat: spot.lat, lng: spot.lng },
      map,
      title: spot.label || "Car Spot"
    });

    const infoWindow = new google.maps.InfoWindow({
      content: `<p><strong>${spot.label}</strong></p><img src="${spot.img}" width="200">`
    });

    marker.addListener("click", () => {
      infoWindow.open(map, marker);
    });
  });
}

navigator.geolocation.getCurrentPosition(initMap);

function openCamera() {
  cameraInput.click();
}

function openGallery() {
  galleryInput.click();
}

function handleImageUpload(file) {
  if (!file) return;

  const reader = new FileReader();
  reader.onloadend = () => {
    const imageDataURL = reader.result;
    const brand = brandInput.value.trim();
    const model = modelInput.value.trim();

    if (!brand) {
      alert("Please enter a brand.");
      return;
    }
    if (!model) {
      alert("Please enter a model.");
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

      const marker = new google.maps.Marker({
        position: { lat: spot.lat, lng: spot.lng },
        map,
        title: spot.label
      });

      const infoWindow = new google.maps.InfoWindow({
        content: `<p><strong>${spot.label}</strong></p><img src="${spot.img}" width="200">`
      });

      marker.addListener("click", () => {
        infoWindow.open(map, marker);
      });

      document.getElementById("car-info").innerHTML = `<p><strong>${spot.label}</strong></p><img src="${imageDataURL}" width="200">`;
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

function addCarSpot() {
  alert("Please use the 'Open Camera' or 'Open Gallery' buttons to select an image.");
}
