import React from "react";
import { Card, CardBody } from "@heroui/react";
import { Icon } from "@iconify/react";

interface RecommendationCardProps {
  title: string;
  saving: number;
}

export const RecommendationCard = ({ title, saving }: RecommendationCardProps) => {
  return (
    <Card>
      <CardBody>
        <div className="flex items-start gap-3">
          <div className="bg-blue-100 p-2 rounded-full">
            <Icon icon="lucide:info" className="text-blue-500" />
          </div>
          <div className="flex-1">
            <h3 className="font-medium mb-1">Recomendaciones</h3>
            <p className="text-default-700 mb-2" dangerouslySetInnerHTML={{ __html: title }} />
            <p className="text-default-500 text-sm">
              Estimado ad <span className="font-medium">{saving}</span>
            </p>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};