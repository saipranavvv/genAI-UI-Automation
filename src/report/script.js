// document.addEventListener('DOMContentLoaded', () => {
//     const resultsContainer = document.getElementById('results-container');

//     // Fetch the JSON data
//     fetch('results.json')
//         .then(response => {
//             if (!response.ok) {
//                 throw new Error(`HTTP error! Status: ${response.status}`);
//             }
//             return response.json();
//         })
//         .then(data => {
//             if (data && data.scenarios) {
//                 // Iterate through each scenario
//                 data.scenarios.forEach(scenario => {
//                     const scenarioContainer = document.createElement('div');
//                     scenarioContainer.className = 'scenario-container';

//                     const scenarioTitle = document.createElement('h2');
//                     scenarioTitle.className = 'scenario-title';
//                     scenarioTitle.textContent = scenario.title;
//                     scenarioContainer.appendChild(scenarioTitle);

//                     // Iterate through each step within the scenario
//                     scenario.steps.forEach(step => {
//                         const stepItem = document.createElement('div');
//                         stepItem.className = 'step-item';

//                         const stepImage = document.createElement('img');
//                         stepImage.className = 'step-image';
//                         // Dynamically set the image source based on the step number
//                         stepImage.src = `step${step.number}.png`; 
//                         stepImage.alt = `Screenshot for step ${step.number}`;
//                         stepItem.appendChild(stepImage);

//                         const stepDescription = document.createElement('p');
//                         stepDescription.className = 'step-description';

//                         const keywordSpan = document.createElement('span');
//                         keywordSpan.className = 'keyword';
//                         keywordSpan.textContent = step.keyword;

//                         const textNode = document.createTextNode(` ${step.step_text}`);

//                         stepDescription.appendChild(keywordSpan);
//                         stepDescription.appendChild(textNode);
//                         stepItem.appendChild(stepDescription);

//                         scenarioContainer.appendChild(stepItem);
//                     });

//                     resultsContainer.appendChild(scenarioContainer);
//                 });
//             } else {
//                 resultsContainer.innerHTML = '<p>No test results found in the JSON data.</p>';
//             }
//         })
//         .catch(error => {
//             console.error('Error fetching or parsing JSON:', error);
//             resultsContainer.innerHTML = `<p>Error loading test results: ${error.message}</p>`;
//         });
// });

document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('image-container');
    const loadingMessage = document.getElementById('loading-message');
    // async function to fetch the JSON and transform it
async function getTransformedSteps() {
  const filePath = '../transformed_feature.json'; // Replace with your file path
  let transformedData = {};

  try {
    const response = await fetch(filePath);
    
    // Check for a successful HTTP status
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    // Check if the JSON structure is as expected
    if (data && data.scenarios && Array.isArray(data.scenarios)) {
      // Loop through each scenario
      data.scenarios.forEach(scenario => {
        // Loop through each step within the scenario
        if (scenario.steps && Array.isArray(scenario.steps)) {
          scenario.steps.forEach(step => {
            const stepKey = `step${step.number}`;
            // Create the new object with the specified key and array
            transformedData[stepKey] = [
              step.keyword,
              step.step_text
            ];
          });
        }
      });
    } else {
      throw new Error("Invalid JSON format. 'scenarios' array not found.");
    }

    return transformedData;

  } catch (error) {
    console.error("Failed to transform JSON data:", error);
    return null; // Return null to indicate an error
  }
}


    // Asynchronous function to load and display images and descriptions
    async function loadImagesAndDescriptions() {
        let imageData = {};
        let transformedSteps = await getTransformedSteps();
        // let numberOfSteps = Object.keys(transformedSteps).length;
        // console.log("Number of steps: "+numberOfSteps);
        console.log(transformedSteps);
        try {
            // 1. Fetch the JSON data
            const response = await fetch('results.json');
            if (!response.ok) {
                throw new Error(`Failed to load JSON file: ${response.status}`);
            }
            imageData = await response.json();

            // Hide the loading message
            if (loadingMessage) {
                loadingMessage.style.display = 'none';
            }

            // 2. Loop through sequential steps and display them
            let stepNumber = 1;
            let imageFound = true;

            // This loop checks for each sequential step file until one is not found.
            // This is a common pattern for displaying a series of files with a number sequence.
            while (imageFound) {
                const imageName = `step${stepNumber}.png`;
                // const imagePath = `./${imageName}`;
                const imagePath = `../../screenshots/${imageName}`;

                // Create new elements for each step
                const stepContainer = document.createElement('div');
                stepContainer.className = 'step-container';

                const imageElement = new Image();
                imageElement.className = 'step-image';
                
                // Use a promise to check if the image exists
                const imageExists = new Promise((resolve) => {
                    imageElement.onload = () => resolve(true);
                    imageElement.onerror = () => resolve(false);
                    imageElement.src = imagePath;
                });

                if (await imageExists) {
                    // Image exists, so create the description and append to the container
                    const descriptionElement = document.createElement('p');
                    descriptionElement.className = 'step-description';

                    // Get the corresponding description from the JSON data
                    const descriptionKey = `step${stepNumber}`;
                    // const descriptionText = imageData[descriptionKey] || 'Description not found in data.json';
                    const descriptionText = transformedSteps[descriptionKey] || 'Description not found in data.json';

                    descriptionElement.textContent = descriptionText;
                    
                    stepContainer.appendChild(imageElement);
                    stepContainer.appendChild(descriptionElement);
                    container.appendChild(stepContainer);

                    stepNumber++; // Move to the next step
                } else {
                    // Image does not exist, so stop the loop
                    imageFound = false;
                    console.log(`Stopped at step_${stepNumber}.png as it was not found.`);
                }
            }

            if (stepNumber === 1 && !imageFound) {
                 container.innerHTML = `<p style="text-align: center; color: red;">No images starting with 'step_' found.</p>`;
            }


        } catch (error) {
            console.error('An error occurred:', error);
            if (loadingMessage) {
                loadingMessage.textContent = 'Error loading data. Please check the console.';
                loadingMessage.style.color = 'red';
            }
        }
    }
    async function loadFeatureSteps(){
      const filePath = '../transformed_feature.json'; // Replace with your file path
  let transformedData = {};

 
    const response = await fetch(filePath);
    
    // Check for a successful HTTP status
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const jsonData = await response.json();
    const container = document.getElementById('feature-container');
    if (!container) {
                console.error(`Error: Container with ID "${containerId}" not found.`);
                return;
            }
            if (!jsonData || !jsonData.feature) {
                 console.error(`Error: Invalid JSON data provided.`);
                 container.innerHTML = '<p>Could not load feature data.</p>';
                 return;
            }
            
            // Clear any previous content
            container.innerHTML = '';

            // Start building the HTML string
            let htmlContent = `<div class="feature-title"><span class="keyword">Feature:</span> ${jsonData.feature}</div>`;

            // Loop through each scenario in the feature
            jsonData.scenarios.forEach(scenario => {
                htmlContent += `
                    <div class="scenario">
                        <div class="scenario-title">Scenario: ${scenario.title}</div>
                        <div class="steps-list">
                `;
                
                // Loop through each step in the scenario
                scenario.steps.forEach(step => {
                    htmlContent += `
                        <div class="step">
                            <span class="keyword">${step.keyword}</span>
                            <span class="step-text">${step.step_text}</span>
                        </div>
                    `;
                });

                htmlContent += `
                        </div>
                    </div>
                `;
            });

            // Set the container's content to the generated HTML
            container.innerHTML = htmlContent;
        

        // --- Call the function when the page loads ---
        // We pass the JSON data and the ID of our container div
        window.onload = () => {
            displayFeature(featureData, 'feature-container');
        };
  } 
    loadFeatureSteps();
    loadImagesAndDescriptions();
});