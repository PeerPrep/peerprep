import { Entity, Enum, PrimaryKey, Property } from "@mikro-orm/core";

enum Role {
    USER = "user",
    ADMIN = "admin"
}

enum Language {
    CPP = "cpp",
    JAVA = "java",
    PYTHON = "python"
}

@Entity({ tableName: "profiles" })
export class Profile {
    @PrimaryKey()
    uid!: string;

    @Property()
    name!: string;

    @Property({ nullable: true })
    imageUrl?: string;

    @Enum(() => Language)
    preferredLang!: Language;

    @Enum({ items: () => Role, default: Role.USER })
    role!: Role;

    constructor(uid: string, name: string, preferredLang: Language, imageUrl?: string) {
        this.uid = uid;
        this.name = name;
        this.imageUrl = imageUrl;
        this.preferredLang = preferredLang;
    }
}
