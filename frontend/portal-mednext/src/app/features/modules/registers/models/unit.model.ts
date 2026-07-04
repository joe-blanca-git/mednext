export interface ILocation {
  id: number;
  name: string;
  description: string;
}

export interface IUnit {
  id: number;
  name: string;
  description: string;
  state: string;
  city: string;
  neighborhood: string;
  street: string;
  number: string;
  complement?: string;
  zipCode: string;
  phone: string;
  active: boolean;
  locations: ILocation[];
}
