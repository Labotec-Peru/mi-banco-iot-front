import PageContainer from '../../../layouts/PageContainer';
import {
    Button,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    useDisclosure,
} from '@heroui/react';
import StatsRow from '../../dashboard/components/StatsRow';

import Lecturas from './Lecturas';

export default function WaterMeterDashboard() {
    const { isOpen, onClose } = useDisclosure();

    return (
        <PageContainer>
            <StatsRow />                
            <Modal isOpen={isOpen} onClose={onClose} size="sm">
                <ModalContent>
                    <ModalHeader className="text-sm">Confirmar revisión</ModalHeader>
                    <ModalBody>
                        <p className="text-xs text-default-600">
                            ¿Confirmas que has revisado la alerta de flujo continuo?
                        </p>
                    </ModalBody>
                    <ModalFooter>
                        <Button size="sm" color="danger" variant="light" onPress={onClose}>
                            Cancelar
                        </Button>
                        <Button size="sm" color="primary" onPress={onClose}>
                            Confirmar
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
            <Lecturas />
        </PageContainer>
    );
}