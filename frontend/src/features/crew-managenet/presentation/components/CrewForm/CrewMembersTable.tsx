import { useState, useMemo } from "react";
import { Search } from "@mui/icons-material";
import { Employee } from "@features/personnel-management";

import { TextFieldGeneric } from "../../../../../shared/presentation/styles/TextField.styles";
import { TextGeneric } from "../../../../../shared/presentation/styles/Text.styles";

import {
  SearchContainerGeneric,
  SearchInputContainer,
} from "../../../../../shared/presentation/styles/SearchContainer.styles";
import { CrewTableGeneric } from "./CrewFormTable/CrewTableGeneric";

import {
  CountChip,
  MainContainer,
  SectionContainer,
  SectionHeader,
} from "./CrewMembersTable.styles";

interface CrewMembersTableProps {
  employees: Employee[];
  selectedWorkers: Employee[];
  onAddWorker: (worker: Employee) => void;
  onRemoveWorker: (worker: Employee) => void;
}

export const CrewMembersTable = ({
  employees,
  selectedWorkers,
  onAddWorker,
  onRemoveWorker,
}: CrewMembersTableProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  // Filtrar empleados basado en la búsqueda
  const filteredEmployees = useMemo(() => {
    if (!searchQuery) return employees;

    const term = searchQuery.toLowerCase();
    return employees.filter(
      (employee) =>
        employee.identification.toLowerCase().includes(term) ||
        (employee.position && employee.position.toLowerCase().includes(term)) ||
        employee.name.toLowerCase().includes(term),
    );
  }, [employees, searchQuery]);

  // Obtener empleados disponibles (no en la cuadrilla)
  const availableEmployees = useMemo(() => {
    return filteredEmployees.filter(
      (employee) => !selectedWorkers.includes(employee),
    );
  }, [filteredEmployees, selectedWorkers]);

  return (
    <>
      <TextGeneric variant="h6" mt={3}>
        Gestión de empleados
      </TextGeneric>
      <SearchContainerGeneric>
        <SearchInputContainer>
          <TextFieldGeneric
            placeholder="Buscar por cédula o cargo"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            fullWidth
            InputProps={{
              startAdornment: <Search />,
            }}
          />
        </SearchInputContainer>
      </SearchContainerGeneric>
      <MainContainer>
        <SectionContainer>
          <SectionHeader>
            <TextGeneric variant="subtitle1">
              Trabajadores Disponibles
            </TextGeneric>
            <CountChip label={availableEmployees.length} size="small" />
          </SectionHeader>

          <CrewTableGeneric
            employees={availableEmployees}
            emptyMessage={
              searchQuery
                ? "No se encontraron trabajadores"
                : "No hay trabajadores disponibles"
            }
            action="add"
            onAction={onAddWorker}
          />
        </SectionContainer>

        <SectionContainer>
          <SectionHeader>
            <TextGeneric variant="subtitle1">
              Miembros de la cuadrilla
            </TextGeneric>
            <CountChip label={selectedWorkers.length} size="small" />
          </SectionHeader>

          <CrewTableGeneric
            employees={selectedWorkers}
            emptyMessage="No hay miembros en la cuadrilla"
            action="remove"
            onAction={onRemoveWorker}
          />
        </SectionContainer>
      </MainContainer>
    </>
  );
};
