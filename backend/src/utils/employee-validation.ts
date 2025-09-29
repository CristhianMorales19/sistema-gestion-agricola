import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

interface EmployeeInput {
    identification?: string
    name?: string;
    email?: string;
    phone?: string;
    birthDate?: string;
    entryDate?: string;
    role?: string;
    contractType?: string;
    baseSalary?: number | string;
    department?: string;
}

export const validateEmployeeInputSingleError = async (input: EmployeeInput) : Promise<string | null> => {
    // 1. Campos no vacíos
    if (input.name !== undefined && input.name.trim() === '') return 'El nombre no puede estar vacío';
    if (input.email !== undefined && input.email.trim() === '') return 'El correo no puede estar vacío';
    if (input.phone !== undefined && input.phone.trim() === '') return 'El teléfono no puede estar vacío';
    if (input.identification !== undefined && input.identification.trim() === '') return 'La cédula no puede estar vacía';

    // 2. Verificar si la cédula ya existe
    if (input.identification) {
        const existingEmployeeById = await prisma.mom_trabajador.findFirst({
            where: {
                documento_identidad: input.identification.trim(),
            }
            
        });
        if (existingEmployeeById) return 'Ya existe un trabajador con esta cédula';
    }

    // 3. Email válido
    if (input.email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(input.email)) return 'El correo no tiene un formato válido';

        // Verificar si ya existe en trabajadores
        const existingEmployee = await prisma.mom_trabajador.findFirst({
        where: { email: input.email }
        });
        if (existingEmployee) return 'Ya existe un trabajador con este correo electrónico';

        // Verificar si ya existe en usuarios
        const existingUser = await prisma.mot_usuario.findFirst({
        where: { username: input.email }
        });
        if (existingUser) return 'Ya existe un usuario con este correo electrónico';
    }

    // 4. Teléfono numérico
    if (input.phone && !/^\d+$/.test(input.phone)) return 'El teléfono debe ser numérico';

    // 5. Fechas válidas
    let birth: Date | null = null;
    let entry: Date | null = null;

    if (input.birthDate) {
        birth = new Date(input.birthDate);
        if (isNaN(birth.getTime())) return 'La fecha de nacimiento no es válida';
    }

    if (input.entryDate) {
        entry = new Date(input.entryDate);
        if (isNaN(entry.getTime())) return 'La fecha de ingreso no es válida';
    }

    // 6. Fecha de ingreso mayor o igual a fecha de nacimiento
    if (birth && entry && entry < birth) return 'La fecha de ingreso no puede ser menor a la fecha de nacimiento';

    // 7. Salario base positivo
    if (input.baseSalary !== undefined) {
        const salario = typeof input.baseSalary === 'string' ? parseFloat(input.baseSalary) : input.baseSalary;
        if (isNaN(salario) || salario < 0) return 'El salario base debe ser un número positivo';
    }

    return null; // No hay errores
};
