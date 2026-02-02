import { getCloudinaryUrl } from "~/lib/cloudinary";

export const pets = [
    {
        id: 1,
        name: 'Mascota Perro 1',
        description: 'Pet 1',
        image: getCloudinaryUrl('/pets/Mascota_Perro_1.png'),
        category: 'pets',
        sexo: 'neutral',
    },
    {
        id: 2,
        name: 'Mascota Perro 2',
        description: 'Pet 2',
        image: getCloudinaryUrl('/pets/Mascota_Perro_2.png'),
        category: 'pets',
        sexo: 'neutral',
    },
    {
        id: 3,
        name: 'Mascota Gato 1',
        description: 'Pet 3',
        image: getCloudinaryUrl('/pets/Mascota_Gato_1.png'),
        category: 'pets',
        sexo: 'neutral',
    },
    {
        id: 4,
        name: 'Mascota Gato 2',
        description: 'Pet 4',
        image: getCloudinaryUrl('/pets/Mascota_Gato_2.png'),
        category: 'pets',
        sexo: 'neutral',
    },
    {
        id: 5,
        name: 'Mascota Gato 3',
        description: 'Pet 5',
        image: getCloudinaryUrl('/pets/Mascota_Gato_3.png'),
        category: 'pets',
        sexo: 'neutral',
    },
];