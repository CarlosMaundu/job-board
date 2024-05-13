document.addEventListener('DOMContentLoaded', function() {
    if (sessionStorage.getItem("jobs")) {
        const storedJobs = JSON.parse(sessionStorage.getItem("jobs"));
        displayJobs(storedJobs);
        updateJobCount(storedJobs.length);
    } else {
        fetchJobs();
    }
});

async function fetchJobs() {
    const pageSize = document.getElementById('pageSize').value;
    const response = await fetch(`/api/jobs?limit=${pageSize}`);
    const data = await response.json();
    sessionStorage.setItem("jobs", JSON.stringify(data.results)); // Save current jobs to session
    updateJobCount(data.results.length);
    displayJobs(data.results);
}

function updateJobCount(count) {
    const countElement = document.getElementById('job-count');
    countElement.innerHTML = `${count} Jobs Found`;
}

function displayJobs(jobs) {
    const jobsContainer = document.getElementById('jobs-container');
    jobsContainer.innerHTML = ''; // Clear previous results
    jobs.forEach(job => {
        const jobElement = document.createElement('div');
        jobElement.className = 'job';
        jobElement.innerHTML = `<h3>${job.name}</h3><p>${job.company ? job.company.name : 'No company info'}</p>`;
        jobElement.onclick = () => displayJobDetails(job);
        jobsContainer.appendChild(jobElement);
    });
}

function displayJobDetails(job) {
    const jobsContainer = document.getElementById('jobs-container');
    jobsContainer.innerHTML = `
        <div class="job-detail">
            <h2>${job.name} at ${job.company ? job.company.name : 'No company info'}</h2>
            <p>${job.contents}</p>
            <button onclick="goBack()">Back to Listings</button>
        </div>
    `;
}

function goBack() {
    const storedJobs = JSON.parse(sessionStorage.getItem("jobs"));
    displayJobs(storedJobs);
    updateJobCount(storedJobs.length);
}

function filterJobs() {
    let input = document.getElementById('searchInput').value.toLowerCase();
    let jobElements = document.querySelectorAll('.job');
    jobElements.forEach(jobElement => {
        let text = jobElement.textContent.toLowerCase();
        jobElement.style.display = text.includes(input) ? '' : 'none';
    });
}


function searchJobs() {
    let input = document.getElementById('searchInput');
    let filter = input.value.toLowerCase();
    let nodes = document.getElementsByClassName('job');
    for (let i = 0; i < nodes.length; i++) {
        let jobTitle = nodes[i].querySelector('h3').innerText.toLowerCase();
        let jobDescription = nodes[i].querySelector('p').innerText.toLowerCase();
        if (jobTitle.includes(filter) || jobDescription.includes(filter)) {
            nodes[i].style.display = "block";
        } else {
            nodes[i].style.display = "none";
        }
    }
}
