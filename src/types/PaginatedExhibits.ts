import { Exhibit } from "src/exhibits/exhibits.entity";

export interface PaginatedExhibits {
  data: Exhibit[];        
  total: number;          
  page: string;           
  lastPage: number;       
}