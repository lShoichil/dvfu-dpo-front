import { Price, Program } from '.';

export interface Thread {
  id: number;
  max_members: number;
  price: Price;
  program: Program;
  public: boolean;
  status: string;
  start_date: Date;
  finish_date: Date;
}
