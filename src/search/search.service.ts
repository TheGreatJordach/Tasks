import { Injectable, Logger } from "@nestjs/common";
import { MeiliSearch } from "meilisearch";

@Injectable()
export class SearchService {
  private readonly client: MeiliSearch;
  // Index name for todo items
  private readonly indexName = "todos";

  private readonly logger = new Logger("MeiliSearch Service");

  constructor() {
    this.client = new MeiliSearch({
      host: process.env.MEILISEARCH_HOST,
      apiKey: process.env.MEILI_MASTER,
    });
    this.createIndex().then((r) => this.logger.log(r));
  }
  // Create index in Meilisearch (if not exists)
  async createIndex() {
    try {
      const index = await this.client.createIndex(this.indexName, {
        primaryKey: "id", // Assuming 'id' is the primary key for your todo items
      });
      this.logger.log("Meilisearch index created or found");
      return index;
    } catch (error) {
      this.logger.error("Failed to create index", error);
    }
  }

  // Index a new document
  async addTodo(todo: any) {
    try {
      const index = this.client.index(this.indexName);
      const response = await index.addDocuments([todo]);
      this.logger.log("Todo indexed successfully");
      return response;
    } catch (error) {
      this.logger.error("Failed to index todo", error);
    }
  }

  // Search documents
  async searchTodos(query: string, limit = 10, offset = 0) {
    try {
      const index = this.client.index(this.indexName);
      return await index.search(query, {
        limit,
        offset,
      });
    } catch (error) {
      this.logger.error("Failed to search todos", error);
    }
  }
}
