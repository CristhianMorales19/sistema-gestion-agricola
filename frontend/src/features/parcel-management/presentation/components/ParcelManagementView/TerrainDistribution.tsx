import { useMemo } from "react";
import { Parcel } from "../../../domain/entities/Parcel";
import { ParcelService } from "../../../application/ParcelService";
import {
  TerrainDistributionCard,
  TerrainCardContent,
  TerrainTitle,
  DistributionContainer,
  DistributionItem,
  DistributionItemHeader,
  DistributionItemLeft,
  TerrainColorDot,
  TerrainName,
  TerrainStats,
  TerrainProgressBar,
} from "./ParcelManagementView.styles";

const TERRAIN_COLORS: Record<string, string> = {
  plano: "#10b981",
  inclinado: "#3b82f6",
  mixto: "#f59e0b",
  otro: "#8b5cf6",
  arenoso: "#ec4899",
  arcilloso: "#06b6d4",
  sin_especificar: "#6b7280",
};

interface TerrainDistributionProps {
  parcels: Parcel[];
}

export const TerrainDistribution = ({ parcels }: TerrainDistributionProps) => {
  const distribution = useMemo(() => {
    const counts: Record<
      string,
      { count: number; area: number; color: string }
    > = {};

    parcels.forEach((p) => {
      const tipo =
        p.tipoTerrenoEfectivo ||
        p.tipoTerreno ||
        p.tipoTerrenoOtro ||
        "sin_especificar";
      const tipoNormalizado = tipo.toLowerCase().replace(/\s+/g, "_");
      if (!counts[tipoNormalizado]) {
        counts[tipoNormalizado] = {
          count: 0,
          area: 0,
          color: TERRAIN_COLORS[tipoNormalizado] || "#8b5cf6",
        };
      }
      counts[tipoNormalizado].count++;
      counts[tipoNormalizado].area += p.areaHectareas || 0;
    });

    return Object.entries(counts).map(([tipo, data]) => ({
      tipo,
      label: ParcelService.getTipoTerrenoLabel(tipo as any, null),
      ...data,
      percentage: parcels.length > 0 ? (data.count / parcels.length) * 100 : 0,
    }));
  }, [parcels]);

  return (
    <TerrainDistributionCard>
      <TerrainCardContent>
        <TerrainTitle>
          {distribution.length === 0
            ? "Sin datos para mostrar"
            : "Distribución por Tipo de Terreno"}
        </TerrainTitle>
        <DistributionContainer>
          {distribution.map(
            ({ tipo, label, count, area, color, percentage }) => (
              <DistributionItem key={tipo}>
                <DistributionItemHeader>
                  <DistributionItemLeft>
                    <TerrainColorDot color={color} />
                    <TerrainName>{label}</TerrainName>
                  </DistributionItemLeft>
                  <TerrainStats>
                    {count} ({percentage.toFixed(0)}%) • {area.toFixed(2)} ha
                  </TerrainStats>
                </DistributionItemHeader>
                <TerrainProgressBar
                  variant="determinate"
                  value={percentage}
                  colorhex={color}
                />
              </DistributionItem>
            ),
          )}
        </DistributionContainer>
      </TerrainCardContent>
    </TerrainDistributionCard>
  );
};
