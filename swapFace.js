export const swapFace = (data) => {
  fetch("https://felixrosberg-face-swap.hf.space/+/api/predict/", {
    method: "POST",
    body: JSON.stringify({
      data: data,
    }),
    headers: { "Content-Type": "application/json" },
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (json_response) {
      //   console.log(json_response);
    });
};
