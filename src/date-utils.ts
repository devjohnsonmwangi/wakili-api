// Generic utility function to handle date conversion
    export function convertDates<T extends Record<string, any>>(entity: T, dateFields: (keyof T)[]): T { 
        const convertedEntity = { ...entity };
        dateFields.forEach(field => {
          if (convertedEntity[field]) {
            convertedEntity[field] = new Date(convertedEntity[field]) as any;
          }
        });
        return convertedEntity;
      }