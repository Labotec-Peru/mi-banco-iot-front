import { useState } from 'react';
import PageContainer from '../../../layouts/PageContainer';
import {
    Card,
    CardBody,
    Button,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    useDisclosure,
    Radio,
    RadioGroup,
    RangeCalendar,
    cn,
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem,
    Autocomplete,
    AutocompleteItem,
} from '@heroui/react';
import {
    Calendar,
    Cpu,
} from '@solar-icons/react';
import type { DateValue } from "@react-types/calendar";
import type { RangeValue } from "@react-types/shared";
import {
    today,
    getLocalTimeZone,
} from "@internationalized/date";
import ConsumptionChart from '../../../components/ux/ConsumptionChart';
import StatsRow from '../../dashboard/components/StatsRow';

export default function WaterMeterDashboard() {
    const { isOpen,  onClose } = useDisclosure();

    const [dateRange, setDateRange] = useState<RangeValue<DateValue> | null>({
        start: today(getLocalTimeZone()),
        end: today(getLocalTimeZone()).add({ weeks: 1, days: 3 }),
    });
    const [focusedValue, setFocusedValue] = useState<DateValue | null>(today(getLocalTimeZone()));




    const CustomRadio = (props: any) => {
        const { children, ...otherProps } = props;

        return (
            <Radio
                {...otherProps}
                classNames={{
                    base: cn(
                        "flex-none m-0 h-8 bg-content1 hover:bg-content2 items-center justify-between",
                        "cursor-pointer rounded-full border-2 border-default-200/60",
                        "data-[selected=true]:border-primary",
                    ),
                    label: "text-tiny text-default-500",
                    labelWrapper: "px-1 m-0",
                    wrapper: "hidden",
                }}
            >
                {children}
            </Radio>
        );
    };

    const formatDateRange = () => {
        if (dateRange?.start && dateRange?.end) {
            const start = `${dateRange.start.day}/${dateRange.start.month}/${dateRange.start.year}`;
            const end = `${dateRange.end.day}/${dateRange.end.month}/${dateRange.end.year}`;
            return `${start} - ${end}`;
        }
        return 'Seleccionar fechas';
    };

    const devices = [
        { label: "Mi banco CantoGrande", key: "cantoGrande", description: "The second most popular pet in the world" },
        { label: "Mi banco Huaycan", key: "huaycan", description: "The most popular pet in the world" },
        { label: "Mi banco San Juan de Lurigancho", key: "lurigancho", description: "The most popular pet in the world" },
    ];

    return (
        <PageContainer>
            <StatsRow />
            <div className="flex items-center justify-between gap-2">
                <div className='flex gap-2 items-center'>
                    <Dropdown size='sm' placement="bottom-start" >
                        <DropdownTrigger>
                            <Button
                                variant="flat"
                                color='default'
                                radius="sm"
                                className="h-12 w-full max-w-xs justify-start px-3"
                            >
                                <div className="flex items-center gap-3 w-full">
                                    <div className="flex flex-col items-start min-w-0 mb-1">
                                        <span className="text-[11px] text-default-500">
                                            Rango de fechas
                                        </span>
                                        <div className="flex items-center gap-1">
                                            <Calendar weight="Bold" size={15} />
                                            <span className="text-sm text-foreground truncate">
                                                {formatDateRange()}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </Button>
                        </DropdownTrigger>
                        <DropdownMenu
                            aria-label="Selector de fechas"
                            closeOnSelect={false}
                            className="p-0 up"
                        >
                            <DropdownItem
                                key="calendar"
                                isReadOnly
                                className="p-0"
                            >
                                <div >
                                    <RangeCalendar
                                        showMonthAndYearPickers aria-label="Date (Show Month and Year Picker)"
                                        bottomContent={
                                            <RadioGroup
                                                aria-label="Date precision"
                                                classNames={{
                                                    base: "w-full pb-2",
                                                    wrapper: "py-2.5 px-3 gap-1 flex-nowrap overflow-x-auto",
                                                }}
                                                defaultValue="exact_dates"
                                                orientation="horizontal"
                                            >
                                                <CustomRadio value="exact_dates">Hoy</CustomRadio>
                                                <CustomRadio value="1_day">1 día</CustomRadio>
                                                <CustomRadio value="2_days">2 días</CustomRadio>
                                                <CustomRadio value="3_days">3 días</CustomRadio>
                                                <CustomRadio value="7_days">7 días</CustomRadio>
                                                <CustomRadio value="14_days">14 días</CustomRadio>
                                            </RadioGroup>
                                        }
                                        focusedValue={focusedValue}
                                        nextButtonProps={{
                                            variant: "bordered",
                                            size: "sm",
                                        }}
                                        prevButtonProps={{
                                            variant: "bordered",
                                            size: "sm",
                                        }}                                        
                                        onChange={setDateRange}
                                        onFocusChange={setFocusedValue}
                                    />
                                </div>
                            </DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                    <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
                        <Autocomplete
                            className="max-w-sm"
                            size='sm'
                            startContent={
                                <Cpu size={20} />
                            }
                            defaultItems={devices}
                            label="Dispositivo"
                            placeholder="Seleecione Dispositivos"
                        >
                            {(item) => <AutocompleteItem key={item.key}>{item.label}</AutocompleteItem>}
                        </Autocomplete>
                    </div>
                </div>
            </div>



            <Card shadow='none'>
                <CardBody className="p-4">
                    <div className="bg-default-100 dark:bg-default-50">
                        <div className="text-center">
                            <ConsumptionChart />
                        </div>
                    </div>
                </CardBody>
            </Card>

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
        </PageContainer>
    );
}