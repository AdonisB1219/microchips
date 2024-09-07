import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import {
    CustomCellphoneTextField,
    CustomTextField,
    SingleFormBoxScene,
} from '@/shared/components';
import { gridSizeMdLg6 } from '@/shared/constants';
import { Empresa } from '@/shared/interfaces';
import {
    CreateEmpresaParams,
    useCreateEmpresas,
    useUpdateEmpresa,
} from '@/store/app/empresas';
import { returnUrlEmpresasPage } from '../../../pages';
import { empresaFormSchema } from '@/shared/utils/validation-schemas/app/empresa/empresa.schema';
import { useIsSuperAdmin } from '@/shared/hooks';

export interface SaveEmpresaProps {
    title: string;
    empresa?: Empresa;
}

type SaveFormData = CreateEmpresaParams & {};

const SaveEmpresa: React.FC<SaveEmpresaProps> = ({ title, empresa }) => {
    const navigate = useNavigate();
    useIsSuperAdmin();

    ///* form
    const form = useForm<SaveFormData>({
        resolver: yupResolver(empresaFormSchema as any),
    });

    const {
        handleSubmit,
        reset,
        formState: { errors, isValid },
    } = form;

    ///* mutations
    const createEmpresaMutation = useCreateEmpresas({
        navigate,
        returnUrl: returnUrlEmpresasPage,
    });
    const updateEmpresaMutation = useUpdateEmpresa({
        navigate,
        returnUrl: returnUrlEmpresasPage,
    });

    ///* handlers
    const onSave = async (data: SaveFormData) => {
        if (!isValid) return;        

        ///* upd
        if (empresa?.id) {
            updateEmpresaMutation.mutate({ id: empresa.id, data });
            return;
        }

        ///* create
        createEmpresaMutation.mutate(data);
    };

    ///* effects
    useEffect(() => {
        if (!empresa?.id) return;
        reset({
            ...empresa,
            /// user
            nombre_empresa: empresa?.nombre_empresa,
            direccion: empresa?.direccion,
            telefono: empresa?.telefono,
            email: empresa?.email,
        });
    }, [empresa, reset]);

    return (
        <SingleFormBoxScene
            titlePage={title}
            onCancel={() => navigate(returnUrlEmpresasPage)}
            onSave={handleSubmit(onSave, () => { })}
        >
            <CustomTextField
                label="Nombre"
                name="nombre_empresa"
                control={form.control}
                defaultValue={form.getValues().nombre_empresa}
                error={errors.nombre_empresa}
                helperText={errors.nombre_empresa?.message}
                size={gridSizeMdLg6}
            />


            <CustomTextField
                label="Direccion"
                name="direccion"
                control={form.control}
                defaultValue={form.getValues().direccion}
                error={errors.direccion}
                helperText={errors.direccion?.message}
                size={gridSizeMdLg6}
            />

            <CustomCellphoneTextField
                label="Telefono"
                name="telefono"
                control={form.control}
                defaultValue={form.getValues().telefono}
                error={errors.telefono}
                helperText={errors.telefono?.message}
                size={gridSizeMdLg6}
            />

            <CustomTextField
                label="Email"
                name="email"
                type="email"
                control={form.control}
                defaultValue={form.getValues().email}
                error={errors.email}
                helperText={errors.email?.message}
                size={gridSizeMdLg6}
            />

        </SingleFormBoxScene>
    );
};

export default SaveEmpresa;
