const express = require('express');

const server = express();

server.use(express.json());

const projects = [];

// Add New Project
server.post('/projects', (req, res) => {
  const { id, title } = req.body;

  const project = {
    id,
    title,
    tasks: []
  }

  projects.push(project);

  return res.json(project);
});

// Middleware (Global) to count how many requests the API has got so far
server.use((req, res, next) => {
  console.count("Requests");

  return next(); 
});


// Middleware to verify if the project exists by id
function checkProjectId(req, res, next) {
  if (!projects[req.params.id]) {
    return res.status(400).json({ error: 'Project does not exists'});
  }

  return next();
}

// List Projects
server.get('/projects', (req, res) => {
  return res.json(projects);
});

// Edit Project
server.put('/projects/:id', checkProjectId, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(p => p.id == id);
  
  project.title = title;

  return res.json(project);
});

// Delete Project
server.delete('/projects/:id', checkProjectId, (req, res) => {
  const { id } = req.params;

  const projectIndex = projects.findIndex(p => p.id == id);

  projects.splice(projectIndex, 1);

  return res.send();
});

// Add Task to a Project
server.post('/projects/:id/tasks', checkProjectId, (req, res) => {
  const { id } = req.params;
  const { title } = req.body
  
  const project = projects.find(p => p.id == id);

  project.tasks.push(title);

  return res.json(project);
});

server.listen(4000);