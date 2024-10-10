// frontend/src/components/mainDashboardComponents/views/KanbanBoardView.jsx

import React, { useState } from "react";
const DynamicKanbanBoard = dynamic(
  () => import("../../components/KanbanBoard"),
  {
    ssr: false,
  }
);

<DynamicKanbanBoard className="h-full" />;
