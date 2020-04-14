import MinLength from "./constraints/minLength";
import MaxLength from "./constraints/maxLength";
import Required from "./constraints/required";
import Email from "./constraints/email";
import Equal from "./constraints/equal";

export default class Metadata {
    static build(metadata) {
        if (metadata === 'default') {
            return {
                minLength: 1,
                maxLength: 100,
                required: true,
                constraints: [
                    new MinLength(1),
                    new MaxLength(100),
                    new Required(),
                ]
            };
        }

        const keys = Object.keys(metadata);
        const obj = {
            constraints: [],
        };

        for (const key of keys) {
            if (key === 'min') {
                obj.minLength = metadata[key];
                obj.constraints.push(new MinLength(obj.minLength));
            }

            if (key === 'max') {
                obj.maxLength = metadata[key];
                obj.constraints.push(new MaxLength(obj.maxLength));
            }

            if (key === 'required') {
                obj.constraints.push(new Required());
            }

            if (key === 'email') {
                obj.constraints.push(new Email());
            }

            if (key === 'equal') {
                obj.constraints.push(new Equal(metadata[key].compareField));
            }
        }

        return obj;
    }

    static createCluster(metadata, state) {
        const mKeys = Object.keys(metadata);
        const cluster = {};
        for (const key of mKeys) {
            cluster[key] = {
                name: key,
                constraints: metadata[key].constraints,
                props: state[key],
            };
        }

        return cluster;
    }
}

