"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Topbar } from "@/components/topbar/topbar"

const patients = [
  {
    id: "p-001",
    name: "Mariana Souza",
    birthDate: "2017-05-12",
    therapy: "Fonoaudiologia",
  },
  {
    id: "p-002",
    name: "João Silva",
    birthDate: "2015-08-23",
    therapy: "Psicologia",
  },
  {
    id: "p-003",
    name: "Ana Costa",
    birthDate: "2018-03-15",
    therapy: "Terapia Ocupacional",
  },
]

export default function PacientesPage() {
  return (
    <>
      <Topbar
        breadcrumbs={[
          { label: "Início", href: "/dashboard" },
          { label: "Pacientes" },
        ]}
        actions={
          <Button>Novo Paciente</Button>
        }
      />
      <div className="flex-1 space-y-4 p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Pacientes</h1>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Lista de Pacientes</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead>Data de Nascimento</TableHead>
                  <TableHead>Terapia</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {patients.map((patient) => (
                  <TableRow key={patient.id}>
                    <TableCell className="font-medium">{patient.id}</TableCell>
                    <TableCell>{patient.name}</TableCell>
                    <TableCell>{patient.birthDate}</TableCell>
                    <TableCell>{patient.therapy}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        Ver detalhes
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
