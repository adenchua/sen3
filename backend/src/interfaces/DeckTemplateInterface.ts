export default interface DeckTemplate {
  id: string;
  chatIds: string[];
  createdDate: Date;
  isDeleted: boolean;
  isDefault: boolean;
  title: string;
  updatedDate: Date;
}
