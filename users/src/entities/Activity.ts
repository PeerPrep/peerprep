import { Entity, PrimaryKey, Property } from "@mikro-orm/core";

@Entity({ tableName: "activity" })
export class Activity {
  @PrimaryKey()
  uid!: string;

  @PrimaryKey()
  questionId!: string;

  @Property()
  submitted!: Date;
}
