// cuadrillas/application/search-crews.ts
import { CrewRepository } from "../domain/crew-repository";

export class SearchCrewsUseCase {
  constructor(private readonly repo: CrewRepository) {}

  async execute(query: string) {
    if (!query || query.trim().length < 2) {
      return [];
    }

    return this.repo.search(query.trim().toLowerCase());
  }
}
