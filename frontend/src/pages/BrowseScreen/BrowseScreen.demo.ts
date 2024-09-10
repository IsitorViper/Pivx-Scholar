import { ApiPaper } from "../../contexts/api/Api";
export const dummyPDFUrl="https://cors-anywhere.herokuapp.com/https://cims.fti.dp.ua/j/article/download/193/181/572";
export const dummyApiPapers: ApiPaper[] = [
  {
    title: "Exploring Quantum Computing: A Comprehensive Review",
    abstract: "This paper provides an in-depth analysis of quantum computing technologies and their potential impacts on the future of computing. We explore the theoretical foundations, current advancements, and practical applications of quantum computing.",
    category: "Computer Science",
    address: "123 Quantum St, Tech City, CA 94016, USA",
    ipfsHash: "QmZxQYZzMfU1d8G9RrG7wH9kC4XkFmJg3vP7v7rcQe5dp1",
    user: "john.doe@example.com",
    status: "PUBLISHED",
    date: 1693432800000 // September 1, 2024
  },
  {
    title: "Advancements in Machine Learning Algorithms",
    abstract: "This paper discusses the latest advancements in machine learning algorithms, focusing on their applications in various industries and their impact on data analysis and decision-making processes.",
    category: "Artificial Intelligence",
    address: "456 AI Blvd, Silicon Valley, CA 94025, USA",
    ipfsHash: "QmYw6FzHdH1S6Npxh8U1dA9z7eR6F1Sk5KQnV2M2UuG8Fv",
    user: "jane.smith@example.com",
    status: "UNDER_REVIEW",
    date: 1694114400000 // September 10, 2024
  },
  {
    title: "Innovations in Renewable Energy Sources",
    abstract: "This paper explores the latest innovations in renewable energy sources, including solar, wind, and hydro power. It highlights recent technological advancements and their implications for sustainable energy solutions.",
    category: "Environmental Science",
    address: "789 Greenway Dr, Eco Town, TX 75001, USA",
    ipfsHash: "QmT6M8S5EJ8B1aJ5LQs7Z4g5yW6Zk2Nf9V4XcL7E9mZ7d",
    user: "alice.johnson@example.com",
    status: "PUBLISHED",
    date: 1694709600000 // September 20, 2024
  },
  {
    title: "The Future of Blockchain Technology",
    abstract: "This paper investigates the future of blockchain technology, examining its potential applications beyond cryptocurrency, including supply chain management, digital identity, and smart contracts.",
    category: "Finance",
    address: "101 Blockchain Ave, Crypto City, NY 10001, USA",
    ipfsHash: "QmR5K3gNf1k4Q2Wk6Rv8Jg7Lp3N8E1P2V9xT4YwY8L4J5",
    user: "bob.brown@example.com",
    status: "REJECTED",
    date: 1695328000000 // September 30, 2024
  }
];
