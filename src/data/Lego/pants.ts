import { getCloudinaryUrl } from "~/lib/cloudinary";

export const pants = [
    {
        id: 1,
        name: 'Pantalón Negro',
        description: 'Pantalón 1',
        image: getCloudinaryUrl('/Pantalones/Pantalon_Negro.png'),
        category: 'legs',
        sexo: 'neutral',
    },
    {
        id: 2,
        name: 'Pantalón Blanco',
        description: 'Pantalón 2',
        image: getCloudinaryUrl('/Pantalones/Pantalon_Blanco.png'),
        category: 'legs',
        sexo: 'neutral',
    },
    {
        id: 3,
        name: 'Pantalón Azul',
        description: 'Pantalón 3',
        image: getCloudinaryUrl('/Pantalones/Pantalon_Azul.png'),
        category: 'legs',
        sexo: 'neutral',
    },
];