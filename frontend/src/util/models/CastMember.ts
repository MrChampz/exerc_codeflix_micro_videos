import { Timestampable } from "./Timestampable";

export interface CastMember extends Timestampable {
  readonly id: string;
  name: string;
  type: number;
}

export const CastMemberTypeMap = {
  1: 'Ator',
  2: 'Diretor',
}