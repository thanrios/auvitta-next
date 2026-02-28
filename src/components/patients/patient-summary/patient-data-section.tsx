import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatIsoDate } from '@/lib/utils'

import type { PatientDataSectionProps } from './types'

export function PatientDataSection({ patient, labels }: PatientDataSectionProps) {
  return (
    <div className="space-y-4 pb-4">
      <Card className="shadow-md">
        <CardHeader className="py-3">
          <CardTitle className="text-base">{labels.identification}</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-2 text-sm md:grid-cols-2">
          <div>
            <p className="text-muted-foreground">{labels.name}</p>
            <p className="font-medium">{patient.full_name}</p>
          </div>
          <div>
            <p className="text-muted-foreground">{labels.birthDate}</p>
            <p className="font-medium">{formatIsoDate(patient.birth_date)}</p>
          </div>
          <div>
            <p className="text-muted-foreground">{labels.age}</p>
            <p className="font-medium">
              {patient.age ?? '-'} {labels.years}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">{labels.sex}</p>
            <p className="font-medium">{patient.biological_sex_display || labels.notInformedSex}</p>
          </div>
          <div>
            <p className="text-muted-foreground">{labels.status}</p>
            <p className="font-medium">{patient.status_display || '-'}</p>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-md">
        <CardHeader className="py-3">
          <CardTitle className="text-base">{labels.documents}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1.5 text-sm">
          {patient.documents.length === 0 ? (
            <p className="text-muted-foreground">{labels.empty}</p>
          ) : (
            patient.documents.map((document) => (
              <div key={document.id} className="flex items-center justify-between rounded-md border p-2">
                <span>{document.document_type_display || '-'}</span>
                <span className="font-medium">{document.document_number || '-'}</span>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <Card className="shadow-md">
        <CardHeader className="py-3">
          <CardTitle className="text-base">{labels.phones}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1.5 text-sm">
          {patient.phones.length === 0 ? (
            <p className="text-muted-foreground">{labels.empty}</p>
          ) : (
            patient.phones.map((phone) => (
              <div key={phone.id} className="flex items-center justify-between rounded-md border p-2">
                <span>{phone.phone_type_display || '-'}</span>
                <span className="font-medium">{phone.formatted_phone || '-'}</span>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <Card className="shadow-md">
        <CardHeader className="py-3">
          <CardTitle className="text-base">{labels.addresses}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1.5 text-sm">
          {patient.addresses.length === 0 ? (
            <p className="text-muted-foreground">{labels.empty}</p>
          ) : (
            patient.addresses.map((address) => (
              <div key={address.id} className="rounded-md border p-2">
                <p className="font-medium">{address.address_type_display || '-'}</p>
                <p className="text-muted-foreground">
                  {address.street}, {address.number}
                  {address.complement ? ` - ${address.complement}` : ''}
                </p>
                <p className="text-muted-foreground">
                  {address.neighborhood} - {address.city}/{address.state}
                </p>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <Card className="shadow-md">
        <CardHeader className="py-3">
          <CardTitle className="text-base">{labels.guardians}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1.5 text-sm">
          {patient.guardians.length === 0 ? (
            <p className="text-muted-foreground">{labels.empty}</p>
          ) : (
            patient.guardians.map((guardian) => (
              <div key={guardian.id} className="rounded-md border p-2">
                <p className="font-medium">{guardian.full_name}</p>
                <p className="text-muted-foreground">{guardian.relationship_type_display || '-'}</p>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  )
}
