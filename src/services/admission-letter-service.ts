import PDFDocument from 'pdfkit'

type AdmissionLetterInput = {
  name: string
  course: string
  admissionDate?: Date
}

export const generateAdmissionLetter = (data: AdmissionLetterInput): Promise<Buffer> => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: 'A4',
      margins: {
        top: 50,
        bottom: 50,
        left: 60,
        right: 60,
      },
    })

    const chunks: Buffer[] = []

    doc.on('data', (chunk) => chunks.push(chunk))

    doc.on('end', () => {
      resolve(Buffer.concat(chunks))
    })

    doc.on('error', reject)

    /*
     * HEADER
     */

    doc.font('Helvetica-Bold').fontSize(20).text('WESTBULL GLOBAL', {
      align: 'center',
    })

    doc.font('Helvetica-Oblique').fontSize(10).text('Learn. Build. Innovate. Lead.', {
      align: 'center',
    })

    doc.moveDown(0.5)

    doc
      .font('Helvetica')
      .fontSize(8)
      .text('4 Kasumu Close, Off Shinaba Street, Agboroko, Ojo, Lagos • License No.: 7617809', {
        align: 'center',
      })

    doc.moveDown(1.5)

    /*
     * DATE
     */

    const admissionDate = data.admissionDate ?? new Date()

    doc
      .font('Helvetica')
      .fontSize(10)
      .text(`Date: ${formatDate(admissionDate)}`)

    doc.moveDown(1)

    /*
     * TITLE
     */

    doc.font('Helvetica-Bold').fontSize(16).text('ADMISSION LETTER', {
      align: 'center',
    })

    doc.moveDown(1.5)

    /*
     * GREETING
     */

    doc.font('Helvetica').fontSize(11).text(`Dear ${data.name},`)

    doc.moveDown(1)

    /*
     * INTRODUCTION
     */

    doc.text(
      'Congratulations and welcome to the WestBull Global Tech Skill Empowerment Program. We are pleased to confirm your admission following your successful registration for the program.',
      {
        align: 'justify',
        lineGap: 5,
      },
    )

    doc.moveDown(1)

    doc.text('You have been admitted to the following skill path:', {
      lineGap: 5,
    })

    doc.moveDown(0.5)

    /*
     * COURSE
     */

    doc.font('Helvetica-Bold').text(`COURSE: ${data.course}`)

    doc.moveDown(1)

    /*
     * PROGRAM DESCRIPTION
     */

    doc
      .font('Helvetica')
      .text(
        'The program is designed to provide practical, industry-relevant training that equips participants with valuable technical skills, hands-on experience, and the confidence to apply their knowledge in real-world projects.',
        {
          align: 'justify',
          lineGap: 5,
        },
      )

    doc.moveDown(1)

    /*
     * PROGRAM DETAILS
     */

    doc.font('Helvetica-Bold').text('PROGRAM DETAILS')

    doc.moveDown(0.5)

    doc.font('Helvetica').text('Duration: 3 Months')

    doc.text('Lecture Commencement Date: 14 September 2026')

    doc.text('Program: Tech Skill Empowerment Program')

    doc.text(`Selected Course: ${data.course}`)

    doc.moveDown(1)

    /*
     * TERMS
     */

    doc.text(
      'Your admission is subject to the terms and guidelines of WestBull Global. We encourage you to attend lectures consistently, participate actively in practical sessions, complete assigned projects, and make full use of the learning opportunities provided throughout the program.',
      {
        align: 'justify',
        lineGap: 5,
      },
    )

    doc.moveDown(1)

    /*
     * CLOSING
     */

    doc.text(
      'We are excited to have you join our learning community and look forward to seeing you Learn, Build, Innovate, and Lead. Once again, congratulations on your admission.',
      {
        align: 'justify',
        lineGap: 5,
      },
    )

    doc.moveDown(1.5)

    doc.text('Yours faithfully,')

    doc.moveDown(2)

    doc.font('Helvetica-Bold').text('Eng. Ojameruaye Rukevwe')

    doc.font('Helvetica').text('Chief Executive Officer (CEO)')

    doc.text('WestBull Global')

    doc.end()
  })
}

const formatDate = (date: Date) => {
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}
