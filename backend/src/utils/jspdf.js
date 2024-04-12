import fs from 'fs';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import path from 'path';
import { fileURLToPath } from 'url';
import { formatDate } from './format-date.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const buildPdfPetD = pet => {
  const doc = new jsPDF();

  // header
  doc.setFontSize(20).text('CERTIFICADO', 105, 20, { align: 'center' });
  doc
    .setFontSize(15)
    .text('Por medio del presente se certifica que:', 105, 30, {
      align: 'center',
    });
  doc.setFontSize(15).text(`${pet?.nombre_mascota?.toUpperCase()}`, 105, 40, {
    align: 'center',
  });
  doc
    .setFontSize(15)
    .text(`Se implanto en: ${pet?.lugar_implantacion}`, 105, 50, {
      align: 'center',
    });
  doc
    .setFontSize(15)
    .text(
      `El microchip con código: ${
        pet?.codigo_chip
      } fue implantado el: ${new Date(
        pet?.fecha_implantacion
      ).toLocaleDateString('es-ES')}`,
      105,
      60,
      { align: 'center' }
    );

  // images
  const docWidth = doc.internal.pageSize.getWidth();
  const imagePath1 = path.join(__dirname, './../assets/1.png');
  const imagePath2 = path.join(__dirname, './../assets/guayaquil.jpg');

  const image1 = fs.readFileSync(imagePath1, { encoding: 'base64' });
  const image2 = fs.readFileSync(imagePath2, { encoding: 'base64' });

  const imageWidth1 = 50;
  const imageHeight1 = 39;

  const imageWidth2 = 70;
  const imageHeight2 = 39;

  const spaceBetweenImages = 10;
  const totalWidth = imageWidth1 + imageWidth2 + spaceBetweenImages;

  const y = 75; // initial y position
  const x1 = (docWidth - totalWidth) / 2;
  const x2 = x1 + imageWidth1 + spaceBetweenImages;

  doc.addImage(image1, 'PNG', x1, y, imageWidth1, imageHeight1);
  doc.addImage(image2, 'JPG', x2, y, imageWidth2, imageHeight2);

  // body
  doc.autoTable({
    head: [
      [
        'Responsable',
        'Identificación',
        'No. Registro',
        'Dirección',
        'Teléfono',
        'Email',
        'Aga',
      ],
    ],
    body: [
      [
        pet?.Responsable?.user?.nombre,
        pet?.Responsable?.user?.identificacion,
        pet?.Responsable?.no_registro,
        pet?.Responsable?.user?.direccion,
        pet?.Responsable?.user?.telefono,
        pet?.Responsable?.user?.email,
        pet?.Mascota?.aga,
      ],
    ],
    startY: 126,
  });

  doc.autoTable({
    head: [
      [
        'Tutor',
        'Identificación',
        'Dirección',
        'Teléfono',
        'Email',
        'Observaciones',
      ],
    ],
    body: [
      [
        pet?.Tutor?.user?.nombre,
        pet?.Tutor?.user?.identificacion,
        pet?.Tutor?.user?.direccion,
        pet?.Tutor?.user?.telefono,
        pet?.Tutor?.user?.email,
        pet?.Tutor?.observaciones,
      ],
    ],
    startY: doc.previousAutoTable.finalY + 7,
  });

  doc.autoTable({
    head: [
      [
        'Mascota',
        'Código de chip',
        'Lugar de implantación',
        'Fecha de implantación',
        'Esterilizado',
      ],
    ],
    body: [
      [
        pet?.nombre_mascota,
        pet?.codigo_chip,
        pet?.lugar_implantacion,
        formatDate(pet?.fecha_implantacion),
        pet?.esterilizado,
      ],
    ],
    startY: doc.previousAutoTable.finalY + 7,
  });

  doc.autoTable({
    head: [['Especie', 'Raza', 'Sexo', 'Fecha de nacimiento']],
    body: [
      [
        pet?.especie,
        pet?.raza,
        pet?.sexo,
        formatDate(pet?.fecha_nacimiento),
      ],
    ],

    startY: doc.previousAutoTable.finalY + 7,
  });

  // buffer
  const pdf = doc.output('arraybuffer');
  return Buffer.from(pdf);
};
