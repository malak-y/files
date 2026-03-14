# 🚀 DevOps Todo App

A full-stack Node.js Todo application with a complete CI/CD pipeline using **Jenkins**, **Docker**, **Kubernetes (EKS)**, and **Terraform**.

---

## Project Structure

```
devops-todo-project/
├── app/
│   ├── app.js              # Express REST API
│   ├── package.json
│   ├── public/
│   │   └── index.html      # Frontend UI
│   └── tests/
│       └── app.test.js     # Jest tests
├── Dockerfile              # Multi-stage Docker build
├── .dockerignore
├── Jenkinsfile             # CI/CD pipeline
├── k8s/
│   ├── deployment.yaml
│   └── service.yaml
└── terraform/
    ├── provider.tf
    ├── variables.tf
    ├── main.tf
    └── outputs.tf
```

---

## API Endpoints

| Method | Path           | Description              |
|--------|----------------|--------------------------|
| GET    | /health        | Health check             |
| GET    | /todos         | List all todos           |
| GET    | /todos?completed=true | Filter by status  |
| GET    | /todos/:id     | Get single todo          |
| POST   | /todos         | Create todo              |
| PATCH  | /todos/:id     | Update todo              |
| DELETE | /todos/:id     | Delete todo              |
| DELETE | /todos         | Clear all completed      |

---

## Run Locally

```bash
cd app
npm install
npm start          # http://localhost:3000
npm test           # run Jest tests
```

---

## Docker

```bash
# Build
docker build -t malak/todo-app:latest .

# Run
docker run -p 3000:3000 malak/todo-app:latest

# Push
docker push malak/todo-app:latest
```

---

## Terraform (AWS Infrastructure)

```bash
cd terraform
terraform init
terraform plan
terraform apply
```

After apply, configure kubectl:
```bash
aws eks update-kubeconfig --region us-east-1 --name todo-eks-cluster
```

---

## Kubernetes Deploy

```bash
kubectl apply -f k8s/
kubectl get pods
kubectl get svc todo-service   # get LoadBalancer external IP
```

---

## CI/CD Flow

```
GitHub push → Jenkins → npm test → Docker build → DockerHub push → kubectl deploy
```
